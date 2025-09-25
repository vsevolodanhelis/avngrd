'use client'

import React, { useState } from 'react'
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { useLanguage } from '@/contexts/LanguageContext'
import { Language, languageNames } from '@/lib/utils'

interface LanguageSwitcherProps {
  className?: string
  variant?: 'header' | 'footer' | 'mobile'
}

export function LanguageSwitcher({ className = '', variant = 'header' }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    setIsOpen(false)

    // Announce language change to screen readers
    const announcement = newLanguage === 'ua' ? 'Мову змінено на українську' : 'Language changed to English'
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', 'polite')
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    announcer.textContent = announcement
    document.body.appendChild(announcer)

    setTimeout(() => {
      document.body.removeChild(announcer)
    }, 1000)
  }

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
      }
    }
  }

  const baseClasses = {
    header: 'relative inline-block text-left',
    footer: 'relative inline-block text-left',
    mobile: 'w-full'
  }

  const buttonClasses = {
    header: 'inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white hover:border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-200',
    footer: 'inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200',
    mobile: 'w-full inline-flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200'
  }

  const dropdownClasses = {
    header: 'absolute right-0 z-50 mt-2 w-48 origin-top-right bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
    footer: 'absolute right-0 z-50 mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
    mobile: 'absolute left-0 right-0 z-50 mt-2 origin-top bg-white border border-gray-200 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
  }

  return (
    <div className={`${baseClasses[variant]} ${className}`}>
      <button
        type="button"
        className={buttonClasses[variant]}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`${t('nav.language')}: ${languageNames[language].native}`}
        id="language-switcher-button"
      >
        <GlobeAltIcon className="w-4 h-4 mr-2" />
        <span className="truncate">
          {languageNames[language].native}
        </span>
        <ChevronDownIcon 
          className={`ml-2 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div
            className={dropdownClasses[variant]}
            role="menu"
            aria-labelledby="language-switcher-button"
          >
            <div className="py-1">
              {(['ua', 'en'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`
                    w-full text-left px-4 py-2 text-sm transition-colors duration-150
                    ${language === lang
                      ? 'bg-yellow-50 text-yellow-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                    ${variant === 'mobile' ? 'text-base py-3' : ''}
                  `}
                  role="menuitem"
                  aria-current={language === lang ? 'true' : 'false'}
                  aria-label={`${t('nav.language')}: ${languageNames[lang].native}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{languageNames[lang].native}</span>
                    {language === lang && (
                      <div className="w-2 h-2 bg-yellow-400 rounded-full" aria-hidden="true"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Compact version for mobile menu
export function CompactLanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'ua' ? 'en' : 'ua')
  }

  return (
    <button
      onClick={toggleLanguage}
      className={`
        inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
        bg-white/80 backdrop-blur-sm border border-gray-200 rounded-md 
        hover:bg-white hover:border-yellow-300 focus:outline-none focus:ring-2 
        focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-200
        ${className}
      `}
      aria-label="Toggle language"
    >
      <GlobeAltIcon className="w-4 h-4 mr-1" />
      <span className="font-semibold">
        {language.toUpperCase()}
      </span>
    </button>
  )
}
