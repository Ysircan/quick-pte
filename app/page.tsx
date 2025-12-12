'use client'

import { useRouter } from 'next/navigation'
import ParticlesBackground from '@/components/ParticlesBackground'
import Navbar from '@/components/default/Navbar'

export default function HomePage() {
  const router = useRouter()

  const handleGetStarted = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) router.push('/dashboard')
    else router.push('/auth/login')
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black text-white font-sans">
      {/* 粒子背景层（不变） */}
      <ParticlesBackground />

      {/* 顶部导航栏（不变） */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Hero 区域（仅按钮加了 onClick） */}
      <section className="relative z-10 flex flex-col items-center text-center mt-24 px-4">
        <h1 className="text-5xl font-bold mb-4">PTE</h1>
        <p className="text-sm text-gray-300 mb-2">
          Plan lessons faster. Assign tasks that keep students moving, one clear step at a time.
        </p>
        <p className="text-sm text-gray-400 mb-6">
          Turn lessons into journeys—simple to start, motivating to finish.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-semibold px-6 py-2 rounded-full transition"
          aria-label="Get started"
        >
          Get Started →
        </button>
        <p className="text-xs text-gray-500 mt-4">
          Build your first learning track today and share it with your class.
        </p>
      </section>

      {/* 功能卡片区域（不变） */}
      <section className="relative z-10 mt-20 px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          { title: 'Question Builder', desc: 'Create clear, level-appropriate questions from your own materials.' },
          { title: 'Task-Based Progress', desc: 'Break learning into daily tasks so students always know what to do next.' },
          { title: 'Card Collection', desc: 'Reward milestones with collectible cards to celebrate steady progress.' },
        ].map((item) => (
          <div key={item.title} className="bg-zinc-900 rounded-xl p-6 text-center border border-zinc-800">
            <h3 className="font-bold text-lg">{item.title}</h3>
            <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* How It Works（不变） */}
      <section className="relative z-10 mt-24 text-center px-6">
        <div className="flex flex-wrap justify-center items-center text-sm gap-4">
          <div className="bg-zinc-800 px-4 py-2 rounded-full">Add Your Materials</div>
          <span>→</span>
          <div className="bg-zinc-800 px-4 py-2 rounded-full">Build Questions & Tasks</div>
          <span>→</span>
          <div className="bg-zinc-800 px-4 py-2 rounded-full">Share With Students</div>
          <span>→</span>
          <div className="bg-zinc-800 px-4 py-2 rounded-full">Track Progress & Reward</div>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Teachers are already using Quick to simplify planning and keep classes on track.
        </p>
      </section>

      {/* 页脚（不变） */}
      <footer className="relative z-10 text-center text-xs text-gray-600 mt-16 pb-8">
        © 2025 Build clear learning journeys.
      </footer>
    </div>
  )
}
