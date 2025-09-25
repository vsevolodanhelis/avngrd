'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSmartPrefetch } from '@/lib/prefetch'
import { ChevronDownIcon, Bars3Icon, XMarkIcon, BuildingOfficeIcon, UserGroupIcon, ChartBarIcon, DocumentTextIcon, UsersIcon, ShieldCheckIcon, BuildingLibraryIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useLanguage } from '@/contexts/LanguageContext'
import { SettingsDropdown } from '@/components/SettingsDropdown'

interface SiteHeaderProps {
  className?: string
}

export function SiteHeader({ className = '' }: SiteHeaderProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const { t, language } = useLanguage()
  const router = useRouter()

  useSmartPrefetch(router, { rootMargin: '200px' })

  // Scroll detection effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  const headerClasses = `z-40 transition-all duration-300 ease-in-out fixed top-0 w-full ${
    isScrolled 
      ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm' 
      : 'bg-transparent'
  }`
  const textClasses = 'text-gray-900'
  const navLinkClasses = 'text-gray-700 hover:text-yellow-400'

  const handlePrefetch = useCallback((href: string) => {
    if (href && href.startsWith('/')) {
      try { router.prefetch(href) } catch {}
    }
  }, [router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // You can implement search functionality here
      console.log('Searching for:', searchQuery)
      // For now, we'll just clear the search
      setSearchQuery('')
    }
  }

  const handleDropdownEnter = (dropdown: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    setActiveDropdown(dropdown)
  }

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null)
    }, 150) // 150ms delay before closing
    setHoverTimeout(timeout)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

  return (
    <header className={`${headerClasses} ${className}`} role="banner" aria-label="Site header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" prefetch={false} className="flex items-center py-2" onMouseEnter={() => handlePrefetch('/')}
            >
              <div className="flex items-center">
                {/* Rising Trend Chart Logo */}
                <div className="w-7 h-5 mr-2.5 flex items-end justify-between">
                  {/* First bar - shortest */}
                  <div className="w-0.5 h-2 bg-gray-800"></div>
                  {/* Second bar - medium */}
                  <div className="w-0.5 h-2.5 bg-gray-800"></div>
                  {/* Third bar - medium-tall */}
                  <div className="w-0.5 h-3.5 bg-gray-800"></div>
                  {/* Fourth bar - tall */}
                  <div className="w-0.5 h-4 bg-gray-800"></div>
                  {/* Fifth bar - tallest */}
                  <div className="w-0.5 h-5 bg-gray-800"></div>
                </div>
                
                {/* Compact Bank Name */}
                <div className="flex flex-col justify-center">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-bold text-gray-900 leading-tight tracking-wider">
                      AVANGARD
                    </span>
                    <span className="text-sm font-bold text-gray-900 leading-tight tracking-wider">
                      BANK
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 leading-tight">
                    АКЦІОНЕРНЕ ТОВАРИСТВО «БАНК АВАНГАРД»
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* About dropdown */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => handleDropdownEnter('about')}
              onMouseLeave={handleDropdownLeave}
            >
              <Link href="/about" prefetch={false} onMouseEnter={() => handlePrefetch('/about')} className={`${navLinkClasses} font-medium transition-colors duration-300 flex items-center font-century`}>
                {t('nav.about')}
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              </Link>
              {activeDropdown === 'about' && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-gradient-to-b from-white/95 via-slate-50/95 to-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-300">
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
              <Link href="/products" prefetch={false} onMouseEnter={() => handlePrefetch('/products')} className={`${navLinkClasses} font-medium transition-colors duration-300 flex items-center font-century`}>
                {t('nav.products')}
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              </Link>
              {activeDropdown === 'products' && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-gradient-to-b from-white/95 via-slate-50/95 to-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-300">
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

          {/* Search Box - Desktop */}
          <div className="hidden md:flex items-center ml-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ua' ? 'Шукати...' : 'Search...'}
                  className="w-40 pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                />
                <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </form>
          </div>

          {/* Settings Dropdown - Desktop */}
          <div className="hidden md:flex items-center ml-4">
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
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <form onSubmit={handleSearch} className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={language === 'ua' ? 'Шукати...' : 'Search...'}
                      className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                    />
                    <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </form>
              </div>
              <Link
                href="/"
                prefetch={false}
                onMouseEnter={() => handlePrefetch('/')}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-400 hover:bg-gray-50 rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
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
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
