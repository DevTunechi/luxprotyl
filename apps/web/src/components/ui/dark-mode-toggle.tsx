'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="w-[72px] h-[36px] rounded-full" style={{ background: 'var(--glass-bg)', border: '1px solid var(--gold-border)' }} />
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="relative flex items-center w-[72px] h-[36px] rounded-full p-1 transition-all duration-300"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #1A3D28, #0A1F12)'
          : 'linear-gradient(135deg, #F5E6C8, #E8D4A8)',
        border: '1px solid var(--gold-border)',
        boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.1)',
      }}
    >
      <span className="absolute left-2 transition-opacity duration-200" style={{ opacity: isDark ? 0.3 : 0.8 }}>
        <Sun size={14} color={isDark ? '#C9943A' : '#A87828'} />
      </span>
      <span className="absolute right-2 transition-opacity duration-200" style={{ opacity: isDark ? 0.8 : 0.3 }}>
        <Moon size={14} color="#C9943A" />
      </span>
      <span
        className="relative z-10 w-[28px] h-[28px] rounded-full flex items-center justify-center transition-all duration-300 ease-in-out"
        style={{
          transform: isDark ? 'translateX(36px)' : 'translateX(0)',
          background: isDark
            ? 'linear-gradient(135deg, #C9943A, #8A5E18)'
            : 'linear-gradient(135deg, #FFFFFF, #F5EDD8)',
          boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        {isDark ? <Moon size={13} color="#0A1F12" /> : <Sun size={13} color="#A87828" />}
      </span>
    </button>
  )
}
