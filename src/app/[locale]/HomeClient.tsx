'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSmartPrefetch } from '@/lib/prefetch'
import {
  BuildingOfficeIcon,
  CreditCardIcon,
  NewspaperIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useLanguage } from '@/contexts/LanguageContext'
import { SettingsDropdown } from '@/components/SettingsDropdown'
import { SiteHeader } from '@/components/SiteHeader'
import { DynamicMetadata } from '@/components/DynamicMetadata'
import { Language } from '@/lib/utils'

export default function HomeClient({ locale }: { locale: Language }) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t, language } = useLanguage()
  const router = useRouter()

  const handleDropdownEnter = (menu: string) => setActiveDropdown(menu)
  const handleDropdownLeave = () => setActiveDropdown(null)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Smart prefetch for above-the-fold links when they enter viewport
  useSmartPrefetch(router, { rootMargin: '200px', selector: 'a[data-prefetch="true"], a[href^="/"]' })

  // Safe translation fallback if key is missing (t returns the key as-is)
  const tr = (key: string, fallback: string) => {
    const v = t(key)
    // treat as missing if undefined, exactly equals key, or looks like a key token (no spaces, contains dot/underscore)
    const looksLikeKey = typeof v === 'string' && /[._]/.test(v) && !/\s/.test(v)
    if (!v || v === key || looksLikeKey) return fallback
    return v
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-white flex flex-col">
      <DynamicMetadata />
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-yellow-500 text-black px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-yellow-600"
      >
        Перейти до основного вмісту
      </a>
      <SiteHeader />
      <main id="main-content" role="main" className="relative flex-1" aria-label="Main content">
        {/* Hero Section - Enhanced with Stock Chart Background */}
        <section className="relative min-h-screen pt-24 md:pt-32 pb-20 overflow-hidden flex items-center" aria-label="Hero section">
          {/* Stock Chart Background */}
          <div className="absolute inset-0 z-0">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat opacity-80"
              style={{
                backgroundImage: "url('/world-map-bg.svg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-gray-50/60 to-white/70" />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Main heading with highlighted text like Synox */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
                {language === 'ua' ? (
                  <>
                    Підвищте свої <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent font-extrabold">фінанси та консалтинг</span> з Авангард Банком.
                  </>
                ) : (
                  <>
                    Boost Your <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent font-extrabold">Finance & Consulting</span> With Avangard Bank.
                  </>
                )}
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-10">
                {tr('hero.subtitle', 'Авангард Банк має потужні можливості, на які ви можете покластися для створення високоякісних фінансових рішень швидше, ніж будь-коли раніше.')}
              </p>

              {/* CTA Button with Synox style */}
              <div className="mb-16">
                <a href="/products" className="inline-flex items-center px-8 py-4 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <span className="mr-3">{tr('cta.getStarted', 'Переглянути послуги')}</span>
                  <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.7071 8.70711C20.0976 8.31658 20.0976 7.68342 19.7071 7.29289L13.3431 0.928932C12.9526 0.538408 12.3195 0.538408 11.9289 0.928932C11.5384 1.31946 11.5384 1.95262 11.9289 2.34315L17.5858 8L11.9289 13.6569C11.5384 14.0474 11.5384 14.6805 11.9289 15.0711C12.3195 15.4616 12.9526 15.4616 13.3431 15.0711L19.7071 8.70711ZM0 9H19V7H0V9Z" fill="currentColor"/>
                  </svg>
                </a>
              </div>

              {/* Decorative arrow element like Synox */}
              <div className="absolute top-1/2 right-8 transform -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M45 30L15 15V45L45 30Z" fill="currentColor" className="text-yellow-500"/>
                </svg>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
