// lib/getCurrentUserFromRequest.ts
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

/**
 * 从请求头中解析 JWT 并返回当前用户
 */
export default async function getCurrentUserFromRequest(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded?.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      name: true,
      email: true,
      isSystemAccount: true,
      createdAt: true,
      updatedAt: true,
      lastLoginAt: true,
    },
  });

  return user ?? null;
}
