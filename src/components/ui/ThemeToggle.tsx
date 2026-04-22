'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="fixed top-16 right-4 z-[9999]">
      <button
        onClick={toggleTheme}
        className="p-3 rounded-full bg-yellow-400 border border-black shadow-md transition-all duration-200 hover:bg-yellow-300"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <Moon className="w-6 h-6 text-black" />
        ) : (
          <Sun className="w-6 h-6 text-black" />
        )}
      </button>
      <div className="mt-1 text-xs text-yellow-800">{theme}</div>
    </div>
  )
}