import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Language types
export type Language = 'ua' | 'en'

// Locale configuration
export const locales: Language[] = ['ua', 'en']
export const defaultLocale: Language = 'ua'

// Language display names
export const languageNames: Record<Language, { native: string; english: string }> = {
  ua: { native: 'Українська', english: 'Ukrainian' },
  en: { native: 'English', english: 'English' }
}

// Locale-specific formatting utilities
export const formatters = {
  number: {
    uk: new Intl.NumberFormat('uk-UA', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }),
    en: new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })
  },
  currency: {
    uk: {
      UAH: new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency: 'UAH',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }),
      USD: new Intl.NumberFormat('uk-UA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      EUR: new Intl.NumberFormat('uk-UA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    en: {
      UAH: new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }),
      USD: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      EUR: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }
  },
  date: {
    uk: new Intl.DateTimeFormat('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    en: new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

// Currency symbols
export const currencySymbols = {
  UAH: '₴',
  USD: '$',
  EUR: '€'
}

// Format number according to locale
export function formatNumber(value: number, locale: Language): string {
  return formatters.number[locale].format(value)
}

// Format currency according to locale
export function formatCurrency(value: number, currency: 'UAH' | 'USD' | 'EUR', locale: Language): string {
  if (currency === 'UAH' && locale === 'uk') {
    return formatters.currency[locale][currency].format(value)
  }
  if (currency === 'USD' && locale === 'en') {
    return formatters.currency[locale][currency].format(value)
  }
  if (currency === 'EUR' && locale === 'en') {
    return formatters.currency[locale][currency].format(value)
  }

  // For other combinations, use manual formatting
  const formattedNumber = formatters.currency[locale][currency].format(Math.abs(value))
  return `${formattedNumber} ${currencySymbols[currency]}`
}

// Format date according to locale
export function formatDate(date: Date, locale: Language): string {
  return formatters.date[locale].format(date)
}

// Banking Section Types
export interface BankingSection {
  id: string
  title: string
  description: string
  icon: string
  href: string
  color: 'yellow' | 'blue' | 'green' | 'purple' | 'orange' | 'teal'
  featured?: boolean
}

// Banking Sections Data
export const bankingSections: BankingSection[] = [
  {
    id: 'about',
    title: 'Про банк',
    description: 'Інформація про банк, наша місія та цінності',
    icon: 'BuildingOfficeIcon',
    href: '/about',
    color: 'yellow',
    featured: true
  },
  {
    id: 'products',
    title: 'Продукти і послуги',
    description: 'Повний каталог банківських продуктів та послуг',
    icon: 'CreditCardIcon',
    href: '/products',
    color: 'blue'
  },
  {
    id: 'news',
    title: 'Новини',
    description: 'Останні новини та оновлення банку',
    icon: 'NewspaperIcon',
    href: '/news',
    color: 'teal'
  },
  {
    id: 'fx-forward',
    title: 'FX Forward',
    description: 'Сучасні інструменти хеджування валютних ризиків',
    icon: 'ChartBarIcon',
    href: '/fx-forward',
    color: 'green'
  },
  {
    id: 'terms',
    title: 'Типові умови',
    description: 'Надання банківських послуг та договори',
    icon: 'DocumentTextIcon',
    href: '/terms',
    color: 'orange'
  },
  {
    id: 'contacts',
    title: 'Контакти',
    description: 'Контактна інформація та розташування відділень',
    icon: 'PhoneIcon',
    href: '/contacts',
    color: 'purple'
  }
]

// Color mappings for sections
export const sectionColors = {
  yellow: {
    bg: 'bg-bank-yellow/10',
    border: 'border-bank-yellow/20',
    icon: 'bg-bank-yellow text-bank-text',
    hover: 'hover:border-bank-yellow/40',
    shadow: 'hover:shadow-bank-yellow/20'
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'bg-blue-500 text-white',
    hover: 'hover:border-blue-300',
    shadow: 'hover:shadow-blue-500/20'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'bg-green-500 text-white',
    hover: 'hover:border-green-300',
    shadow: 'hover:shadow-green-500/20'
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'bg-purple-500 text-white',
    hover: 'hover:border-purple-300',
    shadow: 'hover:shadow-purple-500/20'
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: 'bg-orange-500 text-white',
    hover: 'hover:border-orange-300',
    shadow: 'hover:shadow-orange-500/20'
  },
  teal: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    icon: 'bg-teal-500 text-white',
    hover: 'hover:border-teal-300',
    shadow: 'hover:shadow-teal-500/20'
  }
}
