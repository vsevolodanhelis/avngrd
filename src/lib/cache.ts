'use client'

// Advanced caching utilities for better performance

interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum cache size
  staleWhileRevalidate?: boolean
}

class MemoryCache<T = any> {
  private cache = new Map<string, { data: T; timestamp: number; ttl: number }>()
  private maxSize: number

  constructor(maxSize = 100) {
    this.maxSize = maxSize
  }

  set(key: string, data: T, ttl = 5 * 60 * 1000): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const first = this.cache.keys().next()
      const firstKey: string | undefined = first && !first.done ? first.value : undefined
      if (firstKey !== undefined) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) return null
    
    const isExpired = Date.now() - entry.timestamp > entry.ttl
    if (isExpired) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

// Global cache instances
export const apiCache = new MemoryCache(50)
export const componentCache = new MemoryCache(20)

// SWR-like data fetching with caching
export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { ttl = 5 * 60 * 1000, staleWhileRevalidate = true } = options
  
  // Check cache first
  const cached = apiCache.get(key)
  if (cached && !staleWhileRevalidate) {
    return cached
  }

  try {
    const data = await fetcher()
    apiCache.set(key, data, ttl)
    return data
  } catch (error) {
    // Return stale data if available
    if (cached) {
      console.warn(`Fetch failed for ${key}, returning stale data:`, error)
      return cached
    }
    throw error
  }
}

// Local storage cache with expiration
export const persistentCache = {
  set(key: string, data: any, ttl = 24 * 60 * 60 * 1000): void {
    if (typeof window === 'undefined') return
    
    const item = {
      data,
      timestamp: Date.now(),
      ttl
    }
    
    try {
      localStorage.setItem(key, JSON.stringify(item))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  },

  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null
    
    try {
      const item = localStorage.getItem(key)
      if (!item) return null
      
      const parsed = JSON.parse(item)
      const isExpired = Date.now() - parsed.timestamp > parsed.ttl
      
      if (isExpired) {
        localStorage.removeItem(key)
        return null
      }
      
      return parsed.data
    } catch (error) {
      console.warn('Failed to read from localStorage:', error)
      return null
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  },

  clear(): void {
    if (typeof window === 'undefined') return
    localStorage.clear()
  }
}

// Service Worker registration for offline caching
export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return
  }

  // In development, ensure no service workers remain to avoid caching and hydration issues
  if (process.env.NODE_ENV !== 'production') {
    navigator.serviceWorker.getRegistrations?.().then((regs) => {
      if (regs && regs.length) {
        console.log('[SW] Unregistering', regs.length, 'service worker(s) in development')
        for (const reg of regs) reg.unregister().catch(() => {})
      }
    }).catch(() => {})
    return
  }

  // Only register in production
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('SW registered: ', registration)
    } catch (error) {
      console.log('SW registration failed: ', error)
    }
  })
}
