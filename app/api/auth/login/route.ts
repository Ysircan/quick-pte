import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createRequire } from 'module'
import { prisma } from '@/lib/db'

const require = createRequire(import.meta.url)
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'Missing email/password' }, { status: 400 })
    }

    const emailNorm = email.trim().toLowerCase()
    const user = await prisma.user.findUnique({ where: { email: emailNorm } })
    if (!user) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ ok: false, error: 'Wrong password' }, { status: 401 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      ok: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      
        isSystemAccount: user.isSystemAccount,
        createdAt: user.createdAt,
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
