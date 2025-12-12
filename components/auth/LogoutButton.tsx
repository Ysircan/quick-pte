'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token') // 清空 token
    router.push('/auth/login')       // 跳回登录页
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-400 hover:text-red-400 transition"
    >
      Logout
    </button>
  )
}
