// src/components/ThemeToggle.jsx
import { useTheme } from './ThemeContext'
import { Sun, Moon } from 'lucide-react'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className='p-2 rounded-lg bg-base-200 hover:bg-base-300 transition-colors'
      aria-label='Toggle theme'
    >
      {theme === 'light' ? (
        <Moon className='w-5 h-5' />
      ) : (
        <Sun className='w-5 h-5' />
      )}
    </button>
  )
}

export default ThemeToggle
