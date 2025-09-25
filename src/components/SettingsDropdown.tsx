'use client'

import React, { useState } from 'react'
import { 
  CogIcon, 
  ChevronDownIcon, 
  GlobeAltIcon,
  SunIcon,
  MoonIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Language, languageNames } from '@/lib/utils'

interface SettingsDropdownProps {
  className?: string
  variant?: 'header' | 'mobile'
}

export function SettingsDropdown({ className = '', variant = 'header' }: SettingsDropdownProps) {
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    
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

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    // Theme switching temporarily disabled
    console.log(`Theme switching disabled. Attempted to switch to: ${newTheme}`)

    // Show user that feature is coming soon
    const announcement = 'Theme switching coming soon'
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
    mobile: 'w-full'
  }

  const buttonClasses = {
    header: 'inline-flex items-center justify-center w-10 h-10 text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white hover:border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-200',
    mobile: 'w-full inline-flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200'
  }

  const dropdownClasses = {
    header: 'absolute right-0 z-50 mt-2 w-64 origin-top-right bg-gradient-to-b from-white/95 via-slate-50/95 to-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in slide-in-from-top-2 duration-300',
    mobile: 'absolute left-0 right-0 z-50 mt-2 origin-top bg-white border border-gray-200 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in slide-in-from-top-2 duration-300'
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
        aria-label={t('nav.settings') || 'Settings'}
        id="settings-dropdown-button"
      >
        {variant === 'header' ? (
          <CogIcon className="w-5 h-5" />
        ) : (
          <>
            <CogIcon className="w-4 h-4 mr-2" />
            <span className="truncate">
              {t('nav.settings') || 'Settings'}
            </span>
            <ChevronDownIcon 
              className={`ml-2 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </>
        )}
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
            aria-labelledby="settings-dropdown-button"
          >
            <div className="py-2">
              {/* Language Section */}
              <div className="px-4 py-2">
                <div className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  <GlobeAltIcon className="w-3 h-3 mr-2" />
                  {t('nav.language') || 'Language'}
                </div>
                <div className="space-y-1">
                  {(['ua', 'en'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`
                        w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-150 flex items-center justify-between
                        ${language === lang
                          ? 'bg-yellow-50 text-yellow-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                      role="menuitem"
                      aria-current={language === lang ? 'true' : 'false'}
                      aria-label={`${t('nav.language')}: ${languageNames[lang].native}`}
                    >
                      <span>{languageNames[lang].native}</span>
                      {language === lang && (
                        <CheckIcon className="w-4 h-4 text-yellow-600" aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-2" />

              {/* Theme Section */}
              <div className="px-4 py-2">
                <div className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  <SunIcon className="w-3 h-3 mr-2" />
                  {t('nav.theme') || 'Theme'}
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`
                      w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-150 flex items-center justify-between
                      ${theme === 'light'
                        ? 'bg-yellow-50 text-yellow-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                    role="menuitem"
                    aria-current={theme === 'light' ? 'true' : 'false'}
                  >
                    <div className="flex items-center">
                      <SunIcon className="w-4 h-4 mr-2" />
                      <span>{t('theme.light') || 'Light'}</span>
                    </div>
                    {theme === 'light' && (
                      <CheckIcon className="w-4 h-4 text-yellow-600" aria-hidden="true" />
                    )}
                  </button>
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-150 flex items-center justify-between text-gray-400 cursor-not-allowed opacity-50"
                    role="menuitem"
                    aria-current="false"
                    disabled={true}
                    title="Coming soon"
                  >
                    <div className="flex items-center">
                      <MoonIcon className="w-4 h-4 mr-2" />
                      <span>{t('theme.dark') || 'Dark'} (Coming Soon)</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-2" />

              {/* Future Settings Section */}
              <div className="px-4 py-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {t('nav.preferences') || 'Preferences'}
                </div>
                <div className="text-xs text-gray-500 italic py-2">
                  {t('nav.comingSoon') || 'More options coming soon...'}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
