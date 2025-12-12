'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LogoutButton from '@/components/auth/LogoutButton'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data?.ok) setUser(data.user)
      } catch (err) {
        console.error('Error loading user:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading dashboard...
      </div>
    )

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* 顶部栏 */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-zinc-800">
        <h1 className="text-lg font-semibold tracking-wide text-gray-300">
          PTE
        </h1>
        <LogoutButton />
      </header>

      {/* 主体区域 */}
      <main className="flex flex-col items-center justify-center flex-grow text-center px-4">
        <h2 className="text-3xl font-bold mb-2">Welcome back 👋</h2>
        <p className="text-gray-400 mb-8">
          {user ? `Hello, ${user.name}` : 'User not found'}
        </p>

        <div className="text-sm text-gray-500">
          Your personalized learning dashboard will appear here soon.
        </div>
      </main>

      {/* 页脚 */}
      <footer className="text-center text-xs text-gray-600 py-4 border-t border-zinc-800">
        © 2025 Quick PTE · Learn smarter, not harder.
      </footer>
    </div>
  )
}
