// chrome-extension/src/contexts/ThemeContext.jsx
import React, { createContext, useEffect } from 'react'

export const ThemeContext = createContext()

export const ThemeProvider = ({ children, initialTheme }) => {
  useEffect(() => {
    if (initialTheme) {
      document.documentElement.setAttribute('data-theme', initialTheme)
      chrome.storage.local.set({ theme: initialTheme })
    }
  }, [initialTheme])

  return (
    <ThemeContext.Provider value={{ theme: initialTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
