import { NextResponse } from 'next/server'
import { createRequire } from 'module'
import { prisma } from '@/lib/db'

const require = createRequire(import.meta.url)
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET!

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ ok: false, error: 'Missing token' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)

    const user = await prisma.user.findUnique({
      where: { id: (decoded as any).userId },
      select: {
        id: true,
        name: true,
        email: true,
    
        isSystemAccount: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, user })
  } catch (err) {
    console.error('me error:', err)
    return NextResponse.json({ ok: false, error: 'Invalid or expired token' }, { status: 401 })
  }
}
