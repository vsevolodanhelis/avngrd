'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Language, defaultLocale } from '@/lib/utils'
import { t as translateFn } from '@/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [language, setLanguageState] = useState<Language>(defaultLocale)

  // Extract language from URL pathname
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathSegments = pathname.split('/')
      const urlLang = pathSegments[1] as Language

      if (urlLang && (urlLang === 'ua' || urlLang === 'en')) {
        setLanguageState(urlLang)
        // Map 'ua' (route param) to valid IETF language tag 'uk' for document lang
        document.documentElement.lang = urlLang === 'ua' ? 'uk' : urlLang
        // Save to localStorage for future visits
        localStorage.setItem('avangard-language', urlLang)
      } else {
        // Fallback to saved preference or default
        const savedLanguage = localStorage.getItem('avangard-language') as Language
        const finalLang = (savedLanguage && (savedLanguage === 'ua' || savedLanguage === 'en'))
          ? savedLanguage
          : defaultLocale
        setLanguageState(finalLang)
        document.documentElement.lang = finalLang === 'ua' ? 'uk' : finalLang
      }
    }
  }, [pathname])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)

    if (typeof window !== 'undefined') {
      localStorage.setItem('avangard-language', lang)
      document.documentElement.lang = lang === 'ua' ? 'uk' : lang

      // Update URL to reflect language change
      const pathSegments = pathname.split('/')
      const currentLang = pathSegments[1]

      let newPath: string
      if (currentLang === 'ua' || currentLang === 'en') {
        // Replace existing language in URL
        pathSegments[1] = lang
        newPath = pathSegments.join('/')
      } else {
        // Add language to URL
        newPath = `/${lang}${pathname}`
      }

      router.push(newPath)
    }
  }

  // Translation function using actual translations
  const t = (key: string): string => {
    return translateFn(key, language)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
