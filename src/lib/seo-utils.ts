// Enhanced SEO utilities and structured data generators

export interface PageSEOData {
  title: string
  description: string
  keywords: string[]
  canonicalUrl?: string
  ogImage?: string
  structuredData?: any
}

// Generate breadcrumb structured data
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  }
}

// Generate FAQ structured data
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}

// Generate article structured data
export function generateArticleSchema(article: {
  headline: string
  description: string
  author: string
  datePublished: string
  dateModified?: string
  image?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.headline,
    "description": article.description,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "datePublished": article.datePublished,
    "dateModified": article.dateModified || article.datePublished,
    "image": article.image,
    "publisher": {
      "@type": "Organization",
      "name": "JSC BANK AVANGARD",
      "logo": {
        "@type": "ImageObject",
        "url": "https://avgd.ua/logo.png"
      }
    }
  }
}

// Generate sitemap data
export function generateSitemapEntry(url: string, lastmod?: string, changefreq?: string, priority?: number) {
  return {
    loc: url,
    lastmod: lastmod || new Date().toISOString().split('T')[0],
    changefreq: changefreq || 'weekly',
    priority: priority || 0.8
  }
}
