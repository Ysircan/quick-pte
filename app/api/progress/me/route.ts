import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET!;

function getBearerToken(req: Request) {
  const auth = req.headers.get('authorization') || '';
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? null;
}

export async function GET(req: Request) {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return NextResponse.json({ ok: false, error: 'Missing token' }, { status: 401 });
    }

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ ok: false, error: 'Invalid or expired token' }, { status: 401 });
    }

    const userId = payload?.userId as string | undefined;
    if (!userId) {
      return NextResponse.json({ ok: false, error: 'Invalid token payload' }, { status: 401 });
    }

    // ✅ 这里按你两张表查
    const progress = await prisma.userProgress.findUnique({
      where: { userId },
    });

    const languageProgress = await prisma.userLanguageProgress.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({
      ok: true,
      progress,          // 可能为 null（新用户还没初始化的话）
      languageProgress,  // [] 也正常
    });
  } catch (err) {
    console.error('GET /api/progress/me error:', err);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
