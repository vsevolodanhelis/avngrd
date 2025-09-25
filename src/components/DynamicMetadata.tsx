'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export function DynamicMetadata() {
  const { language, t } = useLanguage()

  useEffect(() => {
    // Safe fallbacks if translations are missing
    const title = t('site.title') && t('site.title') !== 'site.title' ? t('site.title') : 'Авангард Банк'
    const description = t('site.description') && t('site.description') !== 'site.description' ? t('site.description') : 'Офіційний сайт Авангард Банк.'

    // Update document title
    document.title = title
    
    // Update HTML lang attribute
    document.documentElement.lang = language === 'ua' ? 'uk' : language
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    } else {
      const newMetaDescription = document.createElement('meta')
      newMetaDescription.name = 'description'
      newMetaDescription.content = description
      document.head.appendChild(newMetaDescription)
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', t('site.keywords'))
    } else {
      const newMetaKeywords = document.createElement('meta')
      newMetaKeywords.name = 'keywords'
      newMetaKeywords.content = t('site.keywords')
      document.head.appendChild(newMetaKeywords)
    }
    
    // Ensure PWA manifest is linked
    const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null
    if (!manifestLink) {
      const link = document.createElement('link')
      link.rel = 'manifest'
      link.href = '/manifest.json'
      document.head.appendChild(link)
    }

    // Update Open Graph meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', title)
    } else {
      const newOgTitle = document.createElement('meta')
      newOgTitle.setAttribute('property', 'og:title')
      newOgTitle.content = title
      document.head.appendChild(newOgTitle)
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', description)
    } else {
      const newOgDescription = document.createElement('meta')
      newOgDescription.setAttribute('property', 'og:description')
      newOgDescription.content = description
      document.head.appendChild(newOgDescription)
    }
    
    // Update Twitter Card meta tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title)
    } else {
      const newTwitterTitle = document.createElement('meta')
      newTwitterTitle.name = 'twitter:title'
      newTwitterTitle.content = title
      document.head.appendChild(newTwitterTitle)
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description)
    } else {
      const newTwitterDescription = document.createElement('meta')
      newTwitterDescription.name = 'twitter:description'
      newTwitterDescription.content = description
      document.head.appendChild(newTwitterDescription)
    }
    
  }, [language, t])

  return null // This component doesn't render anything
}
