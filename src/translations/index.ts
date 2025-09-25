import { ua } from './ua'
import { en } from './en'
import { Language } from '@/lib/utils'

export const translations = {
  ua,
  en
}

export type TranslationKey = keyof typeof ua

// Helper function to get nested translation value
export function getTranslation(translations: typeof ua, key: string): string {
  const keys = key.split('.')
  let value: any = translations
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return key // Return key if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key
}

// Translation function
export function t(key: string, language: Language): string {
  return getTranslation(translations[language], key)
}

export { ua, en }
