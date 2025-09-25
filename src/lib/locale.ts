import { Language } from './utils'

// Locale configuration for formatting
export const localeConfig = {
  ua: {
    locale: 'uk-UA',
    currency: 'UAH',
    currencySymbol: '₴',
    numberFormat: {
      thousandsSeparator: '.',
      decimalSeparator: ',',
      decimalPlaces: 2
    },
    dateFormat: 'dd.MM.yyyy',
    timeFormat: 'HH:mm'
  },
  en: {
    locale: 'en-US',
    currency: 'USD',
    currencySymbol: '$',
    numberFormat: {
      thousandsSeparator: ',',
      decimalSeparator: '.',
      decimalPlaces: 2
    },
    dateFormat: 'MM/dd/yyyy',
    timeFormat: 'h:mm a'
  }
} as const

// Format numbers according to locale
export function formatNumber(
  value: number,
  language: Language,
  options?: {
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    useGrouping?: boolean
  }
): string {
  const config = localeConfig[language]
  
  try {
    return new Intl.NumberFormat(config.locale, {
      minimumFractionDigits: options?.minimumFractionDigits ?? 0,
      maximumFractionDigits: options?.maximumFractionDigits ?? 2,
      useGrouping: options?.useGrouping ?? true
    }).format(value)
  } catch (error) {
    // Fallback for unsupported locales
    const formatted = value.toFixed(options?.maximumFractionDigits ?? 2)
    if (language === 'uk') {
      // Ukrainian formatting: 1.000.000,50
      return formatted
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        .replace('.', ',')
    }
    return formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}

// Format currency according to locale
export function formatCurrency(
  value: number,
  language: Language,
  currency?: 'UAH' | 'USD' | 'EUR'
): string {
  const config = localeConfig[language]
  const currencyCode = currency || config.currency
  
  // Currency symbols mapping
  const currencySymbols = {
    UAH: '₴',
    USD: '$',
    EUR: '€'
  }
  
  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  } catch (error) {
    // Fallback formatting
    const symbol = currencySymbols[currencyCode as keyof typeof currencySymbols] || currencyCode
    const formatted = formatNumber(value, language, { maximumFractionDigits: 2 })
    
    if (language === 'uk') {
      return `${formatted} ${symbol}`
    }
    return `${symbol}${formatted}`
  }
}

// Format date according to locale
export function formatDate(
  date: Date,
  language: Language,
  options?: {
    dateStyle?: 'full' | 'long' | 'medium' | 'short'
    timeStyle?: 'full' | 'long' | 'medium' | 'short'
    includeTime?: boolean
  }
): string {
  const config = localeConfig[language]
  
  try {
    const formatOptions: Intl.DateTimeFormatOptions = {}
    
    if (options?.dateStyle) {
      formatOptions.dateStyle = options.dateStyle
    }
    
    if (options?.timeStyle && options?.includeTime) {
      formatOptions.timeStyle = options.timeStyle
    }
    
    if (!options?.dateStyle && !options?.timeStyle) {
      formatOptions.year = 'numeric'
      formatOptions.month = '2-digit'
      formatOptions.day = '2-digit'
      
      if (options?.includeTime) {
        formatOptions.hour = '2-digit'
        formatOptions.minute = '2-digit'
      }
    }
    
    return new Intl.DateTimeFormat(config.locale, formatOptions).format(date)
  } catch (error) {
    // Fallback formatting
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    
    if (language === 'uk') {
      return `${day}.${month}.${year}`
    }
    return `${month}/${day}/${year}`
  }
}

// Format percentage according to locale
export function formatPercentage(
  value: number,
  language: Language,
  options?: {
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  }
): string {
  const config = localeConfig[language]
  
  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'percent',
      minimumFractionDigits: options?.minimumFractionDigits ?? 1,
      maximumFractionDigits: options?.maximumFractionDigits ?? 2
    }).format(value / 100)
  } catch (error) {
    // Fallback formatting
    const formatted = formatNumber(value, language, {
      minimumFractionDigits: options?.minimumFractionDigits ?? 1,
      maximumFractionDigits: options?.maximumFractionDigits ?? 2
    })
    return `${formatted}%`
  }
}

// Parse number from localized string
export function parseLocalizedNumber(
  value: string,
  language: Language
): number {
  if (!value || typeof value !== 'string') return 0
  
  let cleanValue = value.trim()
  
  if (language === 'uk') {
    // Ukrainian format: 1.000.000,50
    // Replace thousands separators (dots) with empty string
    // Replace decimal separator (comma) with dot
    cleanValue = cleanValue
      .replace(/\./g, '') // Remove thousands separators
      .replace(',', '.') // Replace decimal separator
  } else {
    // English format: 1,000,000.50
    // Remove thousands separators (commas)
    cleanValue = cleanValue.replace(/,/g, '')
  }
  
  // Remove any non-numeric characters except decimal point and minus sign
  cleanValue = cleanValue.replace(/[^\d.-]/g, '')
  
  const parsed = parseFloat(cleanValue)
  return isNaN(parsed) ? 0 : parsed
}

// Get currency symbol for language/currency combination
export function getCurrencySymbol(
  language: Language,
  currency: 'UAH' | 'USD' | 'EUR' = 'UAH'
): string {
  const symbols = {
    UAH: '₴',
    USD: '$',
    EUR: '€'
  }
  
  return symbols[currency]
}

// Format large numbers with appropriate suffixes
export function formatLargeNumber(
  value: number,
  language: Language
): string {
  const suffixes = {
    uk: ['', 'тис.', 'млн', 'млрд', 'трлн'],
    en: ['', 'K', 'M', 'B', 'T']
  }
  
  if (value === 0) return '0'
  
  const tier = Math.log10(Math.abs(value)) / 3 | 0
  
  if (tier === 0) return formatNumber(value, language)
  
  const suffix = suffixes[language][tier] || ''
  const scale = Math.pow(10, tier * 3)
  const scaled = value / scale
  
  return `${formatNumber(scaled, language, { maximumFractionDigits: 1 })} ${suffix}`
}
