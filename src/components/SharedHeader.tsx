'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSmartPrefetch } from '@/lib/prefetch'
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  UsersIcon,
  ShieldCheckIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline'
import { useLanguage } from '@/contexts/LanguageContext'
import { SettingsDropdown } from '@/components/SettingsDropdown'

interface SharedHeaderProps {
  transparent?: boolean
  className?: string
}

export function SharedHeader({ transparent = false, className = '' }: SharedHeaderProps) {
  // State management
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mobileAboutExpanded, setMobileAboutExpanded] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { t } = useLanguage()
  const router = useRouter()


  // Viewport-based smart prefetch for visible header links
  useSmartPrefetch(router, { rootMargin: '200px' })



  // Dropdown menu data using translations
  const dropdownMenus = {
    'about': [
      { label: t('dropdown.about.ownershipStructure'), href: '/about/ownership-structure', icon: BuildingOfficeIcon },
      { label: t('dropdown.about.supervisoryBoard'), href: '/about/supervisory-board', icon: UserGroupIcon },
      { label: t('dropdown.about.financialReporting'), href: '/about/financial-reporting', icon: ChartBarIcon },
      { label: t('dropdown.about.bankDocuments'), href: '/about/bank-documents', icon: DocumentTextIcon },
      { label: t('dropdown.about.shareholdersStakeholders'), href: '/about/shareholders-stakeholders', icon: UsersIcon },
      { label: t('dropdown.about.compliance'), href: '/about/compliance', icon: ShieldCheckIcon },
      { label: t('dropdown.about.bankingGroup'), href: '/about/banking-group', icon: BuildingLibraryIcon }
    ],
    'products': [
      { label: t('dropdown.products.corporate'), href: '#', isHeader: true },
      { label: t('dropdown.products.corporatePayments'), href: '#' },
      { label: t('dropdown.products.corporateDeposits'), href: '#' },
      { label: t('dropdown.products.repo'), href: '#' },
      { label: t('dropdown.products.forex'), href: '#' },
      { label: t('dropdown.products.private'), href: '#', isHeader: true },
      { label: t('dropdown.products.privatePayments'), href: '#' },
      { label: t('dropdown.products.privateDeposits'), href: '#' },
      { label: t('dropdown.products.fxForward'), href: '#' },
      { label: t('dropdown.products.terms'), href: '#' }
    ]
  }

  const handleDropdownEnter = (menu: string) => {
    setActiveDropdown(menu)
  }

  const handleDropdownLeave = () => {
    setActiveDropdown(null)
  }

  // Enhanced scroll detection for three-state behavior (temporarily disabled for hydration stability)
  const [scrollState, setScrollState] = useState<'top' | 'hidden' | 'visible'>('top')

  useEffect(() => {
    // Mark as mounted to enable scroll-based transitions only after first paint
    setMounted(true)

    const SCROLL_THRESHOLD = 100 // Pixels to scroll before header becomes sticky

    const handleScroll = () => {
      const scrollPosition = window.scrollY

      let newScrollState: 'top' | 'hidden' | 'visible'

      if (scrollPosition === 0) {
        // At the very top of the page
        newScrollState = 'top'
      } else if (scrollPosition < SCROLL_THRESHOLD) {
        // Scrolled but not past threshold - header should be hidden
        newScrollState = 'hidden'
      } else {
        // Past threshold - header should be visible and sticky
        newScrollState = 'visible'
      }

      // Only update state if it actually changed to prevent unnecessary re-renders
      setScrollState(prevState => {
        if (prevState !== newScrollState) {
          return newScrollState
        }
        return prevState
      })

      // Keep the old isScrolled state for backward compatibility
      const newIsScrolled = scrollPosition > 0
      setIsScrolled(prevIsScrolled => {
        if (prevIsScrolled !== newIsScrolled) {
          return newIsScrolled
        }
        return prevIsScrolled
      })
    }

    // Set initial scroll state
    handleScroll()

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fully stabilized classes to avoid any SSR/CSR divergence
  const headerClasses = 'z-40 transition-all duration-300 ease-in-out sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200'
  const textClasses = 'text-gray-900'
  const navLinkClasses = 'text-gray-700 hover:text-yellow-400'

  // Prefetch helper (only internal routes)
  const handlePrefetch = useCallback((href: string) => {
    if (href && href.startsWith('/')) {
      try {
        router.prefetch(href)
      } catch {
        // ignore
      }
    }
  }, [router])

  return (
    <header className={`${headerClasses} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" prefetch={false} className="flex items-center" onMouseEnter={() => handlePrefetch('/')}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className={`text-xl font-bold transition-colors duration-300 ${textClasses}`}>
                {t('nav.bankName') || 'Авангард Банк'}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {/* About dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter('about')}
              onMouseLeave={handleDropdownLeave}
            >
              <Link href="/about" prefetch={false} onMouseEnter={() => handlePrefetch('/about')} className={`${navLinkClasses} font-medium transition-colors duration-300 flex items-center`}>
                {t('nav.about')}
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              </Link>
              {activeDropdown === 'about' && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-gradient-to-b from-white/95 via-slate-50/95 to-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-300">
                  {dropdownMenus.about.map((item, index) => {
                    const IconComponent = item.icon
                    return (
                      <a
                        key={index}
                        href={item.href}
                        onMouseEnter={() => handlePrefetch(item.href)}
                        className={`block px-4 py-3 text-gray-700 hover:text-yellow-400 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 transition-all duration-200 ${
                          index === 0 ? 'rounded-t-lg' : ''
                        } ${index === dropdownMenus.about.length - 1 ? 'rounded-b-lg' : ''}`}
                      >
                        <span className="flex items-center">
                          <IconComponent className="w-4 h-4 text-yellow-600 mr-3" />
                          {item.label}
                        </span>
                      </a>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Products dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter('products')}
              onMouseLeave={handleDropdownLeave}
            >
              <Link href="/products" prefetch={false} onMouseEnter={() => handlePrefetch('/products')} className={`${navLinkClasses} font-medium transition-colors duration-300 flex items-center`}>
                {t('nav.products')}
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              </Link>
              {activeDropdown === 'products' && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-gradient-to-b from-white/95 via-slate-50/95 to-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-300">
                  {dropdownMenus.products.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      onMouseEnter={() => handlePrefetch(item.href)}
                      className={`block px-4 py-3 transition-all duration-200 ${
                        item.isHeader
                          ? 'text-gray-900 font-semibold bg-gray-50 border-b border-gray-200'
                          : 'text-gray-700 hover:text-yellow-400 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 pl-6'
                      } ${index === 0 ? 'rounded-t-lg' : ''} ${index === dropdownMenus.products.length - 1 ? 'rounded-b-lg' : ''}`}
                    >
                      {item.isHeader ? (
                        <span className="flex items-center">
                          <span className="text-yellow-500 mr-2">▶</span>
                          {item.label}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <span className="text-gray-400 mr-2">•</span>
                          {item.label}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Requisites */}
            <Link href="/requisites" prefetch={false} onMouseEnter={() => handlePrefetch('/requisites')} className={`${navLinkClasses} font-medium transition-colors duration-300`}>
              {t('nav.requisites')}
            </Link>

            {/* FGVFO */}
            <Link href="/fgvfo" prefetch={false} onMouseEnter={() => handlePrefetch('/fgvfo')} className={`${navLinkClasses} font-medium transition-colors duration-300`}>
              {t('nav.fgvfo')}
            </Link>

            {/* News */}
            <a href="#" className={`${navLinkClasses} font-medium transition-colors duration-300`}>
              {t('nav.news')}
            </a>

            {/* Contacts */}
            <a href="#" className={`${navLinkClasses} font-medium transition-colors duration-300`}>
              {t('nav.contacts')}
            </a>
          </nav>

          {/* Settings Dropdown - Desktop */}
          <div className="hidden md:flex items-center ml-8">
            <SettingsDropdown variant="header" />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Settings Dropdown - Mobile */}
            <SettingsDropdown variant="mobile" className="scale-90" />

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${navLinkClasses} focus:outline-none focus:text-yellow-400 transition-colors duration-200`}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden relative z-50" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg animate-in slide-in-from-top-2 duration-300">
              <Link
                href="/"
                prefetch={false}
                onMouseEnter={() => handlePrefetch('/')}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-400 hover:bg-gray-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              {/* About section with dropdown */}
              <div>
                <button
                  onClick={() => setMobileAboutExpanded(!mobileAboutExpanded)}
                  className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-400 hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  <span>{t('nav.about')}</span>
                  <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${mobileAboutExpanded ? 'rotate-180' : ''}`} />
                </button>
                {mobileAboutExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    <Link
                      href="/about"
                      prefetch={false}
                      onMouseEnter={() => handlePrefetch('/about')}
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-yellow-400 hover:bg-gray-50 rounded-md transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="flex items-center">
                        <BuildingOfficeIcon className="w-4 h-4 text-yellow-600 mr-2" />
                        {t('nav.about')} - {t('sections.about.title')}
                      </span>
                    </Link>
                    {dropdownMenus.about.map((item, index) => {
                      const IconComponent = item.icon
                      return (
                        <a
                          key={index}
                          href={item.href}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-yellow-400 hover:bg-gray-50 rounded-md transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="flex items-center">
                            <IconComponent className="w-4 h-4 text-yellow-600 mr-2" />
                            {item.label}
                          </span>
                        </a>
                      )
                    })}
                  </div>
                )}
              </div>
              <Link
                href="/products"
                prefetch={false}
                onMouseEnter={() => handlePrefetch('/products')}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-400 hover:bg-gray-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.products')}
              </Link>
              <Link
                href="/requisites"
                prefetch={false}
                onMouseEnter={() => handlePrefetch('/requisites')}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-400 hover:bg-gray-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.requisites')}
              </Link>
              <Link
                href="/fgvfo"
                prefetch={false}
                onMouseEnter={() => handlePrefetch('/fgvfo')}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-400 hover:bg-gray-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.fgvfo')}
              </Link>
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-400 hover:bg-gray-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.news')}
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-400 hover:bg-gray-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.contacts')}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
