import { useLanguage } from '@/contexts/LanguageContext'
import {
  formatNumber,
  formatCurrency,
  formatDate,
  formatPercentage,
  parseLocalizedNumber,
  getCurrencySymbol,
  formatLargeNumber,
  localeConfig
} from '@/lib/locale'

export function useLocale() {
  const { language } = useLanguage()
  
  return {
    // Current locale configuration
    config: localeConfig[language],
    
    // Formatting functions bound to current language
    formatNumber: (
      value: number,
      options?: {
        minimumFractionDigits?: number
        maximumFractionDigits?: number
        useGrouping?: boolean
      }
    ) => formatNumber(value, language, options),
    
    formatCurrency: (
      value: number,
      currency?: 'UAH' | 'USD' | 'EUR'
    ) => formatCurrency(value, language, currency),
    
    formatDate: (
      date: Date,
      options?: {
        dateStyle?: 'full' | 'long' | 'medium' | 'short'
        timeStyle?: 'full' | 'long' | 'medium' | 'short'
        includeTime?: boolean
      }
    ) => formatDate(date, language, options),
    
    formatPercentage: (
      value: number,
      options?: {
        minimumFractionDigits?: number
        maximumFractionDigits?: number
      }
    ) => formatPercentage(value, language, options),
    
    formatLargeNumber: (value: number) => formatLargeNumber(value, language),
    
    parseNumber: (value: string) => parseLocalizedNumber(value, language),
    
    getCurrencySymbol: (currency?: 'UAH' | 'USD' | 'EUR') => 
      getCurrencySymbol(language, currency),
    
    // Current language
    language
  }
}
