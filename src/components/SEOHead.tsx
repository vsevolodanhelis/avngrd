'use client'

import Head from 'next/head'
import { useLanguage } from '@/contexts/LanguageContext'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  ogType?: 'website' | 'article' | 'product'
  canonicalUrl?: string
  noIndex?: boolean
  structuredData?: object
  alternateLanguages?: { [key: string]: string }
}

export function SEOHead({
  title,
  description,
  keywords = [],
  ogImage = '/images/og-default.jpg',
  ogType = 'website',
  canonicalUrl,
  noIndex = false,
  structuredData,
  alternateLanguages = {}
}: SEOHeadProps) {
  const { t } = useLanguage()
  const currentLanguage = 'uk' // Default to Ukrainian

  // Default values with translations
  const defaultTitle = t('seo.defaultTitle') || 'Авангард Банк - Надійний банківський партнер'
  const defaultDescription = t('seo.defaultDescription') || 'Авангард Банк пропонує широкий спектр банківських послуг для корпоративних та приватних клієнтів. Депозити, кредити, платіжні послуги.'
  const defaultKeywords = [
    'авангард банк',
    'банківські послуги',
    'депозити',
    'кредити',
    'платіжні послуги',
    'корпоративний банкінг',
    'приватний банкінг',
    'україна'
  ]

  const finalTitle = title ? `${title} | ${defaultTitle}` : defaultTitle
  const finalDescription = description || defaultDescription
  const finalKeywords = [...defaultKeywords, ...keywords].join(', ')

  // Generate structured data for organization
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "BankOrCreditUnion",
    "name": "JSC BANK AVANGARD",
    "alternateName": "Авангард Банк",
    "url": "https://avgd.ua",
    "logo": "https://avgd.ua/logo.png",
    "description": finalDescription,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "вул. Банкова, 1",
      "addressLocality": "Київ",
      "addressCountry": "UA"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+380-44-123-4567",
      "contactType": "customer service",
      "availableLanguage": ["uk", "ru", "en"]
    },
    "sameAs": [
      "https://www.facebook.com/avangardbank",
      "https://www.linkedin.com/company/avangard-bank"
    ]
  }

  const combinedStructuredData = structuredData 
    ? [organizationStructuredData, structuredData]
    : organizationStructuredData

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content="JSC BANK AVANGARD" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="language" content={currentLanguage} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!noIndex && <meta name="robots" content="index, follow" />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Авангард Банк" />
      <meta property="og:locale" content={currentLanguage === 'uk' ? 'uk_UA' : 'ru_RU'} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Alternate Languages */}
      {Object.entries(alternateLanguages).map(([lang, url]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(combinedStructuredData)
        }}
      />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch for performance */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#fdeb0a" />
      <meta name="msapplication-TileColor" content="#fdeb0a" />
      
      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
    </Head>
  )
}

// Hook for dynamic SEO updates
export function useSEO() {
  const updateTitle = (title: string) => {
    if (typeof document !== 'undefined') {
      document.title = title
    }
  }

  const updateMetaDescription = (description: string) => {
    if (typeof document !== 'undefined') {
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', description)
      }
    }
  }

  const updateCanonical = (url: string) => {
    if (typeof document !== 'undefined') {
      let canonical = document.querySelector('link[rel="canonical"]')
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        document.head.appendChild(canonical)
      }
      canonical.setAttribute('href', url)
    }
  }

  return {
    updateTitle,
    updateMetaDescription,
    updateCanonical
  }
}
