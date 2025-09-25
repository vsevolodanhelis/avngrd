'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { DynamicMetadata } from '@/components/DynamicMetadata'
import { SiteHeader } from '@/components/SiteHeader'
import { AboutNavigation } from '@/components/AboutNavigation'
import {
  BuildingOfficeIcon,
  StarIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  ScaleIcon,
  UserGroupIcon,
  Bars3Icon
} from '@heroicons/react/24/outline'
import { useState, useRef, useEffect } from 'react'

export default function AboutPage() {
  const { t } = useLanguage()
  const [activeSection, setActiveSection] = useState('services')
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId]
    if (element) {
      const headerOffset = 100
      const elementPosition = element.offsetTop
      const offsetPosition = elementPosition - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      setActiveSection(sectionId)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150

      const sections = Object.keys(sectionRefs.current)
      for (const sectionId of sections) {
        const element = sectionRefs.current[sectionId]
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-white dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900">
      <DynamicMetadata />

      {/* Site Header */}
      <SiteHeader />

      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BuildingOfficeIcon className="w-16 h-16 text-yellow-100 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('about.title')}
            </h1>
            <p className="text-xl text-yellow-100 dark:text-yellow-200 max-w-3xl mx-auto">
              {t('about.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsMobileNavOpen(true)}
          className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white p-4 rounded-full shadow-lg transition-colors"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Navigation */}
      <AboutNavigation
        activeSection={activeSection}
        onSectionClick={scrollToSection}
        isMobile={true}
        isOpen={isMobileNavOpen}
        onToggle={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex gap-8">
          {/* Left Navigation - Hidden on mobile */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <AboutNavigation
              activeSection={activeSection}
              onSectionClick={scrollToSection}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Services Overview */}
            <div
              ref={(el) => { sectionRefs.current['services'] = el }}
              className="mb-16 scroll-mt-24"
            >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-lg p-8 border border-blue-200 dark:border-blue-700">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {t('about.services')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t('about.servicesOverview') || 'Огляд основних напрямків обслуговування'}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-blue-200 dark:border-blue-700">
                <GlobeAltIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="font-medium text-gray-800 dark:text-gray-200">{t('about.markets.currency')}</p>
              </div>
              <div className="text-center p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-blue-200 dark:border-blue-700">
                <DocumentTextIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="font-medium text-gray-800 dark:text-gray-200">{t('about.markets.money')}</p>
              </div>
              <div className="text-center p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-blue-200 dark:border-blue-700">
                <ShieldCheckIcon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="font-medium text-gray-800 dark:text-gray-200">{t('about.markets.bonds')}</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mt-6 text-center">{t('about.operations')}</p>
          </div>
        </div>

        {/* Reliability Section */}
        <div
          ref={(el) => { sectionRefs.current['reliability'] = el }}
          className="mb-16 scroll-mt-24"
        >
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-lg p-8 border border-green-200 dark:border-green-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <StarIcon className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
              {t('about.reliability.title')}
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t('about.reliability.rating')}</p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t('about.reliability.bonds')}</p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('about.reliability.outlook')}</p>
            </div>
          </div>
        </div>

        {/* Ownership */}
        <div
          ref={(el) => { sectionRefs.current['ownership'] = el }}
          className="mb-16 scroll-mt-24"
        >
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl shadow-lg p-8 border border-purple-200 dark:border-purple-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <UserGroupIcon className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
              {t('about.participation.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">{t('about.ownership')}</p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{t('about.participation.association')}</p>
            <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
              <p className="font-medium text-gray-800 dark:text-gray-200 mb-3">{t('about.participation.certification')}</p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <ShieldCheckIcon className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-2" />
                  {t('about.participation.iso9001')}
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <ShieldCheckIcon className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-2" />
                  {t('about.participation.iso27001')}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Financial Reporting */}
        <div
          ref={(el) => { sectionRefs.current['reporting'] = el }}
          className="mb-16 scroll-mt-24"
        >
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl shadow-lg p-8 border border-orange-200 dark:border-orange-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <DocumentTextIcon className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-3" />
              {t('about.reporting.title')}
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t('about.reporting.ifrs')}</p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t('about.reporting.audit')}</p>
            </div>
          </div>
        </div>

        {/* Infrastructure */}
        <div
          ref={(el) => { sectionRefs.current['infrastructure'] = el }}
          className="mb-16 scroll-mt-24"
        >
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl shadow-lg p-8 border border-teal-200 dark:border-teal-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <GlobeAltIcon className="w-6 h-6 text-teal-600 dark:text-teal-400 mr-3" />
              {t('about.infrastructure.title')}
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t('about.infrastructure.correspondent')}</p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t('about.infrastructure.swift')}</p>
            </div>
          </div>
        </div>

        {/* Credit History */}
        <div
          ref={(el) => { sectionRefs.current['creditHistory'] = el }}
          className="mb-16 scroll-mt-24"
        >
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/20 dark:to-gray-800/20 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-600">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <DocumentTextIcon className="w-6 h-6 text-slate-600 dark:text-slate-400 mr-3" />
              {t('about.creditHistory.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t('about.creditHistory.description')}</p>
          </div>
        </div>

        {/* Customer Service */}
        <div
          ref={(el) => { sectionRefs.current['service'] = el }}
          className="mb-16 scroll-mt-24"
        >
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl shadow-lg p-8 border border-pink-200 dark:border-pink-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <DevicePhoneMobileIcon className="w-6 h-6 text-pink-600 dark:text-pink-400 mr-3" />
              {t('about.service.title')}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-2">
                  <ClockIcon className="w-5 h-5 text-pink-600 dark:text-pink-400 mr-2" />
                  <p className="font-medium text-gray-800 dark:text-gray-200">{t('about.service.schedule')}</p>
                </div>
                <p className="text-gray-600 dark:text-gray-400 ml-7">{t('about.service.break')}</p>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{t('about.service.branches')}</p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{t('about.service.app')}</p>
                <a
                  href={t('about.service.website')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300 font-medium underline"
                >
                  {t('about.service.website')}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Regulation */}
        <div
          ref={(el) => { sectionRefs.current['regulation'] = el }}
          className="text-center scroll-mt-24"
        >
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl shadow-lg p-8 border border-yellow-200 dark:border-yellow-700 inline-block">
            <ScaleIcon className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
            <p className="text-gray-700 dark:text-gray-300 font-medium">{t('about.regulation')}</p>
          </div>
        </div>

          </div>
        </div>
      </div>
    </div>
  )
}
