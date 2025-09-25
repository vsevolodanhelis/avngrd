'use client'

import { ReactNode } from 'react'
import { Language } from '@/lib/utils'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { LazyAIChatWidget } from '@/components/LazyComponents'

interface LocaleLayoutProps {
  children: ReactNode
  params: {
    locale: Language
  }
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  return (
    <LanguageProvider>
      {children}
      <LazyAIChatWidget />
    </LanguageProvider>
  )
}
