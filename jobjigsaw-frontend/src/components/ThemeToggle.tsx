'use client'

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useTheme } from './DarkModeProvider'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    if (theme === 'dark') {
      return <MoonIcon className="h-5 w-5" />
    } else if (theme === 'light') {
      return <SunIcon className="h-5 w-5" />
    } else {
      // system theme - show based on actual system preference
      if (!mounted) {
        return <SunIcon className="h-5 w-5" />
      }
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return isDark ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-md p-2 text-primary-foreground hover:bg-accent/10 hover:text-accent-foreground transition-colors"
      title={`Current theme: ${theme}. Click to cycle through light/dark/system.`}
    >
      {getIcon()}
    </button>
  )
}