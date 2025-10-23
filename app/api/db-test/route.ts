import { sql } from '@/lib/db'

export async function GET() {
  const rows = await sql/*sql*/`SELECT now() AS now`
  return Response.json({ ok: true, now: rows[0].now })
}
