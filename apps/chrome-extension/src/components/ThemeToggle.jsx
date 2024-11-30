// chrome-extension/src/components/ThemeToggle.jsx
import React, { useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'

const ThemeToggle = () => {
  const { theme, setTheme } = useContext(ThemeContext)

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <button
      className='btn btn-ghost'
      onClick={toggleTheme}
    >
      {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  )
}

export default ThemeToggle
