// packages/ui/src/components/theme/ThemeProvider.tsx
import React, { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { ThemeContext } from './ThemeContext'

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState('dark')
  const { publicKey } = useWallet()
  const publicKeyBase58 = publicKey?.toBase58()

  useEffect(() => {
    if (publicKeyBase58) {
      fetch(`/.netlify/functions/get-user-preferences?userId=${publicKeyBase58}`)
        .then(res => res.json())
        .then(data => setTheme(data.theme || 'dark'))
        .catch(console.error)
    }
  }, [publicKeyBase58])

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)

    if (publicKeyBase58) {
      try {
        await fetch('/.netlify/functions/update-user-preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: publicKeyBase58, theme: newTheme })
        })
      } catch (error) {
        console.error('Failed to update theme:', error)
      }
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
