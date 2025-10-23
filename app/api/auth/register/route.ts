import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

type RegisterBody = {
  name?: string
  email?: string
  password?: string
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = (await req.json()) as RegisterBody

    // 基础校验
    if (!name || !email || !password) {
      return NextResponse.json({ ok: false, error: 'Missing name/email/password' }, { status: 400 })
    }

    const emailNorm = email.trim().toLowerCase()

    // 唯一性检查
    const existing = await prisma.user.findUnique({ where: { email: emailNorm } })
    if (existing) {
      return NextResponse.json({ ok: false, error: 'Email already registered' }, { status: 400 })
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10)

    // 严格按表字段写入
    const user = await prisma.user.create({
      data: {
        name,
        email: emailNorm,
        passwordHash,
        // 其余字段（avatarUrl/isSystemAccount/emailVerifiedAt/...）使用数据库默认值
      },
      select: {
        id: true,
        name: true,
        email: true,
      
        isSystemAccount: true,
        emailVerifiedAt: true,
        passwordChangedAt: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ ok: true, user }, { status: 201 })
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
