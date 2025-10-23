// File: lib/getCurrentUserFromRequest.ts
import { createRequire } from 'module'
import { prisma } from '@/lib/db'

const require = createRequire(import.meta.url)
const jwt = require('jsonwebtoken')

type DecodedToken = {
  userId: string
  email?: string
  // 以后需要可再扩展字段
}

export default async function getCurrentUserFromRequest(req: Request) {
  // header 名大小写不敏感，但统一用小写更稳
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null

  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken
    if (!decoded?.userId) return null

    // 只返回安全字段，避免把 passwordHash 带出去
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
        emailVerifiedAt: true,
      },
    })

    return user ?? null
  } catch (err) {
    console.error('❌ Invalid or expired token:', err)
    return null
  }
}
