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

    if (!name || !email || !password) {
      return NextResponse.json({ ok: false, error: 'Missing name/email/password' }, { status: 400 })
    }

    const emailNorm = email.trim().toLowerCase()

    const existing = await prisma.user.findUnique({ where: { email: emailNorm } })
    if (existing) {
      return NextResponse.json({ ok: false, error: 'Email already registered' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email: emailNorm,
        passwordHash,
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

    // ✅ NEW: init progress rows
    await prisma.userProgress.create({
      data: { userId: user.id, unlockXP: 0 },
    })

    await prisma.userLanguageProgress.create({
      data: { userId: user.id, language: 'en', langXP: 0 },
    })

    return NextResponse.json({ ok: true, user }, { status: 201 })
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
