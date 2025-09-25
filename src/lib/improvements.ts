/**
 * Frontend Improvements Library
 * Collection of utility functions and helpers for enhanced user experience
 * Created for internship logbook documentation
 */

// Date and time utilities
export const dateUtils = {
  formatDate: (date: Date, locale: string = 'uk-UA'): string => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  },

  formatCurrency: (amount: number, currency: string = 'UAH', locale: string = 'uk-UA'): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount)
  },

  isBusinessDay: (date: Date): boolean => {
    const day = date.getDay()
    return day !== 0 && day !== 6 // Not Sunday (0) or Saturday (6)
  },

  addBusinessDays: (date: Date, days: number): Date => {
    const result = new Date(date)
    let addedDays = 0
    
    while (addedDays < days) {
      result.setDate(result.getDate() + 1)
      if (dateUtils.isBusinessDay(result)) {
        addedDays++
      }
    }
    
    return result
  }
}

// Form validation utilities
export const validationUtils = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  isValidPhone: (phone: string): boolean => {
    // Ukrainian phone number validation
    const phoneRegex = /^(\+380|380|0)[0-9]{9}$/
    return phoneRegex.test(phone.replace(/[\s-()]/g, ''))
  },

  isValidIBAN: (iban: string): boolean => {
    // Basic IBAN validation for Ukrainian banks
    const cleanIban = iban.replace(/\s/g, '').toUpperCase()
    return /^UA\d{27}$/.test(cleanIban)
  },

  validateRequired: (value: string | number | null | undefined): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0
    }
    return value !== null && value !== undefined
  },

  validateMinLength: (value: string, minLength: number): boolean => {
    return value.length >= minLength
  },

  validateMaxLength: (value: string, maxLength: number): boolean => {
    return value.length <= maxLength
  }
}

// Local storage utilities with error handling
export const storageUtils = {
  setItem: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
      return false
    }
  },

  getItem: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn('Failed to read from localStorage:', error)
      return defaultValue
    }
  },

  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error)
      return false
    }
  },

  clear: (): boolean => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.warn('Failed to clear localStorage:', error)
      return false
    }
  }
}

// URL and routing utilities
export const urlUtils = {
  buildUrl: (base: string, params: Record<string, string | number>): string => {
    const url = new URL(base)
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value))
    })
    return url.toString()
  },

  parseQueryParams: (search: string): Record<string, string> => {
    const params = new URLSearchParams(search)
    const result: Record<string, string> = {}
    params.forEach((value, key) => {
      result[key] = value
    })
    return result
  },

  isExternalUrl: (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname !== window.location.hostname
    } catch {
      return false
    }
  }
}

// Performance utilities
export const performanceUtils = {
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },

  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  },

  memoize: <T extends (...args: any[]) => any>(func: T): T => {
    const cache = new Map()
    return ((...args: Parameters<T>) => {
      const key = JSON.stringify(args)
      if (cache.has(key)) {
        return cache.get(key)
      }
      const result = func(...args)
      cache.set(key, result)
      return result
    }) as T
  }
}

// Banking-specific utilities
export const bankingUtils = {
  calculateDepositReturn: (
    principal: number,
    rate: number,
    termDays: number,
    isCompound: boolean = false
  ): { gross: number; tax: number; net: number } => {
    const annualRate = rate / 100
    const termYears = termDays / 365
    
    let gross: number
    if (isCompound) {
      gross = principal * Math.pow(1 + annualRate, termYears) - principal
    } else {
      gross = principal * annualRate * termYears
    }
    
    // Ukrainian tax rate for deposit income (19.5% = 18% income tax + 1.5% military tax)
    const taxRate = 0.195
    const tax = gross * taxRate
    const net = gross - tax
    
    return {
      gross: Math.round(gross * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      net: Math.round(net * 100) / 100
    }
  },

  formatAccountNumber: (accountNumber: string): string => {
    // Format Ukrainian bank account number (26 digits)
    return accountNumber.replace(/(\d{2})(\d{6})(\d{18})/, '$1 $2 $3')
  },

  validateAccountNumber: (accountNumber: string): boolean => {
    const cleaned = accountNumber.replace(/\s/g, '')
    return /^\d{26}$/.test(cleaned)
  }
}

// Accessibility utilities
export const a11yUtils = {
  announceToScreenReader: (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  },

  trapFocus: (element: HTMLElement): (() => void) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    element.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      element.removeEventListener('keydown', handleTabKey)
    }
  }
}

// Error handling utilities
export const errorUtils = {
  createErrorMessage: (error: unknown): string => {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === 'string') {
      return error
    }
    return 'An unexpected error occurred'
  },

  logError: (error: unknown, context?: string): void => {
    const message = errorUtils.createErrorMessage(error)
    const logData = {
      message,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    console.error('Application Error:', logData)
    
    // In production, you would send this to your error tracking service
    // Example: Sentry.captureException(error, { extra: logData })
  }
}
