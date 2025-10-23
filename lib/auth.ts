import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET!

export function signToken(payload: any, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
  } catch {
    return null
  }
}
