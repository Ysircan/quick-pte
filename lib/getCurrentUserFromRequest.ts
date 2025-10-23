// File: lib/getCurrentUserFromRequest.ts
import { createRequire } from 'module'
import { prisma } from '@/lib/db'

const require = createRequire(import.meta.url)
const jwt = require('jsonwebtoken')

/**
 * 从请求头中解析 JWT 并返回当前用户
 */
export default async function getCurrentUserFromRequest(req: Request) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null

  if (!token) return null

  try {
    // 解密 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string
      email?: string
    }

    if (!decoded?.userId) return null

    // 查询数据库中的用户（仅返回安全字段）
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
    })

    return user
  } catch (err) {
    console.error('❌ 无法解析 token：', err)
    return null
  }
}
