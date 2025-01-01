// src/components/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('dark') // Default to dark
  const { publicKey } = useWallet()
  const publicKeyBase58 = publicKey ? publicKey.toBase58() : null

  useEffect(() => {
    // Fetch user preferences when wallet is connected
    if (publicKeyBase58) {
      fetch(
        `/.netlify/functions/get-user-preferences?userId=${publicKeyBase58}`
      )
        .then((res) => res.json())
        .then((data) => {
          setTheme(data.theme || 'dark')
        })
        .catch(console.error)
    }
  }, [publicKeyBase58])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    console.log('Toggling theme to:', newTheme)

    setTheme(newTheme)

    if (publicKeyBase58) {
      try {
        console.log('Making API call with:', {
          userId: publicKeyBase58,
          theme: newTheme,
        })
        const response = await fetch(
          '/.netlify/functions/update-user-preferences',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: publicKeyBase58,
              theme: newTheme,
            }),
          }
        )
        const data = await response.json()
        console.log('API response:', data)
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

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
