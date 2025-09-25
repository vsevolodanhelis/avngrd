'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

// Global theme state - this will be managed at the document level
let currentTheme: Theme = 'light'
let themeListeners: Set<(theme: Theme) => void> = new Set()

// Global theme management functions - DISABLED FOR NOW
const applyThemeToDocument = (theme: Theme) => {
  // Theme switching temporarily disabled
  // Keep function for future implementation
  console.log(`Theme switching disabled. Would switch to: ${theme}`)

  if (typeof window !== 'undefined') {
    // Always ensure light theme (remove any dark classes)
    const root = document.documentElement
    root.classList.remove('dark')

    // Always set light theme meta color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#ffffff')
    }

    // Don't store theme preference for now
    // localStorage.setItem('avangard-theme', theme)

    // Update global state to always be light
    currentTheme = 'light'

    // Notify all listeners with light theme
    themeListeners.forEach(listener => listener('light'))
  }
}

const loadInitialTheme = () => {
  if (typeof window !== 'undefined') {
    // Always return light theme for now
    applyThemeToDocument('light')
    return 'light'
  }
  return 'light'
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Always use light theme for now
  const [theme, setThemeState] = useState<Theme>('light')

  // Initialize theme immediately on mount
  useEffect(() => {
    loadInitialTheme()
    setThemeState('light')
    currentTheme = 'light'
  }, [])

  // Global theme management functions - DISABLED
  const setTheme = (newTheme: Theme) => {
    console.log(`Theme switching disabled. Attempted to set: ${newTheme}`)
    // Don't actually change theme, keep as light
    applyThemeToDocument('light')
    setThemeState('light')
  }

  const toggleTheme = () => {
    console.log('Theme switching disabled. Toggle attempted.')
    // Don't actually toggle, keep as light
    applyThemeToDocument('light')
    setThemeState('light')
  }

  return (
    <ThemeContext.Provider value={{
      theme: 'light', // Always provide light theme
      setTheme,
      toggleTheme
    }}>
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

// Export global theme functions for components that need direct access - DISABLED
export const getGlobalTheme = () => 'light' // Always return light
export const setGlobalTheme = (theme: Theme) => {
  console.log(`Global theme switching disabled. Attempted to set: ${theme}`)
  applyThemeToDocument('light') // Always apply light
}
export const toggleGlobalTheme = () => {
  console.log('Global theme toggle disabled.')
  applyThemeToDocument('light') // Always apply light
}
