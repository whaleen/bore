// packages/ui/src/components/theme/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export type Theme = 'light' | 'dark';

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: Theme;
  onThemeChange?: (theme: Theme) => void;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  initialTheme = 'dark',
  onThemeChange,
  storageKey = 'ui-theme'
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return initialTheme;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(storageKey, theme);
    onThemeChange?.(theme);
  }, [theme, storageKey, onThemeChange]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
