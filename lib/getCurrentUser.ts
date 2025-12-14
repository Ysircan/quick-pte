// File: lib/getCurrentUserFromRequest.ts
import { createRequire } from "module";
import { prisma } from "@/lib/db";

const require = createRequire(import.meta.url);
const jwt = require("jsonwebtoken");

type DecodedToken = {
  userId: string;
  email?: string;
};

export default async function getCurrentUserFromRequest(
  req: Request | { headers: Headers }
) {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing in environment variables.");
    return null;
  }

  const authHeader = req.headers.get("authorization");
  const token =
    authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    if (!decoded?.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        // avatarUrl: true, // 如果你 schema 有这个字段，就打开它
        isSystemAccount: true,
        createdAt: true,

        // 下面这些你要就留，不要就删；关键是“统一在这里”
        updatedAt: true,
        lastLoginAt: true,
        emailVerifiedAt: true,
      },
    });

    return user ?? null;
  } catch (err) {
    // token 过期/非法属于正常情况，不要刷屏也行；你想留日志就留
    console.error("❌ Invalid or expired token:", err);
    return null;
  }
}
