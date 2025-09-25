'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { 
  BuildingOfficeIcon,
  StarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ScaleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

interface NavigationItem {
  id: string
  titleKey: string
  icon: React.ComponentType<any>
  subsections?: string[]
}

interface AboutNavigationProps {
  activeSection: string
  onSectionClick: (sectionId: string) => void
  isMobile?: boolean
  isOpen?: boolean
  onToggle?: () => void
}

export function AboutNavigation({ activeSection, onSectionClick, isMobile = false, isOpen = false, onToggle }: AboutNavigationProps) {
  const { t } = useLanguage()
  const [isSticky, setIsSticky] = useState(false)

  const navigationItems: NavigationItem[] = [
    {
      id: 'services',
      titleKey: 'about.services',
      icon: BuildingOfficeIcon
    },
    {
      id: 'reliability',
      titleKey: 'about.reliability.title',
      icon: StarIcon
    },
    {
      id: 'ownership',
      titleKey: 'about.participation.title',
      icon: UserGroupIcon
    },
    {
      id: 'reporting',
      titleKey: 'about.reporting.title',
      icon: DocumentTextIcon
    },
    {
      id: 'infrastructure',
      titleKey: 'about.infrastructure.title',
      icon: GlobeAltIcon
    },
    {
      id: 'creditHistory',
      titleKey: 'about.creditHistory.title',
      icon: DocumentTextIcon
    },
    {
      id: 'service',
      titleKey: 'about.service.title',
      icon: DevicePhoneMobileIcon
    },
    {
      id: 'regulation',
      titleKey: 'about.regulationTitle',
      icon: ScaleIcon
    }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsSticky(scrollTop > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (isMobile) {
    return (
      <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={onToggle}></div>
        <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-slate-800 shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center">
                <BuildingOfficeIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                {t('about.title')}
              </h3>
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <ChevronRightIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSectionClick(item.id)
                      onToggle?.()
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center group ${
                      isActive
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-600'
                        : 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-gray-700 dark:text-gray-300 hover:text-yellow-700 dark:hover:text-yellow-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-400'}`} />
                    <span className="text-sm font-medium flex-1 truncate">
                      {item.titleKey.startsWith('about.') ? t(item.titleKey) : item.titleKey}
                    </span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`transition-all duration-300 ${isSticky ? 'fixed top-4 left-4 z-50' : 'sticky top-4'}`}>
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-lg border border-yellow-200 dark:border-yellow-600 p-6 w-80">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <BuildingOfficeIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
          {t('about.title')}
        </h3>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionClick(item.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center group ${
                  isActive
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-600'
                    : 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-gray-700 dark:text-gray-300 hover:text-yellow-700 dark:hover:text-yellow-300'
                }`}
              >
                <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-400'}`} />
                <span className="text-sm font-medium flex-1 truncate">
                  {item.titleKey.startsWith('about.') ? t(item.titleKey) : item.titleKey}
                </span>
                <ChevronRightIcon className={`w-3 h-3 transition-transform ${isActive ? 'rotate-90 text-yellow-600 dark:text-yellow-400' : 'text-gray-400 dark:text-gray-500'}`} />
              </button>
            )
          })}
        </nav>
        
        <div className="mt-6 pt-4 border-t border-yellow-200 dark:border-yellow-600">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {t('about.title')} • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}
