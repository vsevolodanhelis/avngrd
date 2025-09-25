'use client'

import { useEffect, useCallback, useRef } from 'react'

interface UseKeyboardNavigationOptions {
  onEscape?: () => void
  onEnter?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onTab?: () => void
  enabled?: boolean
}

/**
 * Hook for handling keyboard navigation and accessibility
 */
export function useKeyboardNavigation(options: UseKeyboardNavigationOptions = {}) {
  const {
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    enabled = true
  } = options

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onEscape?.()
          break
        case 'Enter':
          onEnter?.()
          break
        case 'ArrowUp':
          event.preventDefault()
          onArrowUp?.()
          break
        case 'ArrowDown':
          event.preventDefault()
          onArrowDown?.()
          break
        case 'ArrowLeft':
          onArrowLeft?.()
          break
        case 'ArrowRight':
          onArrowRight?.()
          break
        case 'Tab':
          onTab?.()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [enabled, onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onTab])
}

/**
 * Hook for managing focus trap (useful for modals, dropdowns)
 */
export function useFocusTrap(isActive: boolean = true) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }

    // Focus first element when trap becomes active
    firstElement?.focus()

    document.addEventListener('keydown', handleTabKey)
    return () => document.removeEventListener('keydown', handleTabKey)
  }, [isActive])

  return containerRef
}

/**
 * Hook for announcing content changes to screen readers
 */
export function useScreenReaderAnnouncements() {
  const announcementRef = useRef<HTMLDivElement>(null)

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcementRef.current) {
      // Create announcement element if it doesn't exist
      const element = document.createElement('div')
      element.setAttribute('aria-live', priority)
      element.setAttribute('aria-atomic', 'true')
      element.className = 'sr-only'
      element.style.position = 'absolute'
      element.style.left = '-10000px'
      element.style.width = '1px'
      element.style.height = '1px'
      element.style.overflow = 'hidden'
      document.body.appendChild(element)
      announcementRef.current = element
    }

    // Clear previous message and set new one
    announcementRef.current.textContent = ''
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = message
      }
    }, 100)
  }, [])

  useEffect(() => {
    return () => {
      // Cleanup announcement element
      if (announcementRef.current && announcementRef.current.parentNode) {
        announcementRef.current.parentNode.removeChild(announcementRef.current)
      }
    }
  }, [])

  return { announce }
}

/**
 * Hook for detecting reduced motion preference
 */
export function useReducedMotion() {
  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.current = mediaQuery.matches

    const handleChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion.current = event.matches
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion.current
}

/**
 * Hook for managing ARIA attributes dynamically
 */
export function useAriaAttributes() {
  const setAriaLabel = useCallback((element: HTMLElement | null, label: string) => {
    if (element) {
      element.setAttribute('aria-label', label)
    }
  }, [])

  const setAriaDescribedBy = useCallback((element: HTMLElement | null, id: string) => {
    if (element) {
      element.setAttribute('aria-describedby', id)
    }
  }, [])

  const setAriaExpanded = useCallback((element: HTMLElement | null, expanded: boolean) => {
    if (element) {
      element.setAttribute('aria-expanded', expanded.toString())
    }
  }, [])

  const setAriaHidden = useCallback((element: HTMLElement | null, hidden: boolean) => {
    if (element) {
      element.setAttribute('aria-hidden', hidden.toString())
    }
  }, [])

  const setRole = useCallback((element: HTMLElement | null, role: string) => {
    if (element) {
      element.setAttribute('role', role)
    }
  }, [])

  return {
    setAriaLabel,
    setAriaDescribedBy,
    setAriaExpanded,
    setAriaHidden,
    setRole
  }
}

/**
 * Hook for color contrast checking (development only)
 */
export function useColorContrast() {
  const checkContrast = useCallback((foreground: string, background: string) => {
    if (process.env.NODE_ENV !== 'development') return

    // This is a simplified contrast checker
    // In production, you'd use a proper color contrast library
    const getLuminance = (color: string) => {
      // Simple RGB extraction (works for hex colors)
      const hex = color.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16) / 255
      const g = parseInt(hex.substr(2, 2), 16) / 255
      const b = parseInt(hex.substr(4, 2), 16) / 255

      const sRGB = [r, g, b].map(c => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })

      return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
    }

    try {
      const l1 = getLuminance(foreground)
      const l2 = getLuminance(background)
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)

      if (ratio < 4.5) {
        console.warn(`⚠️ Low color contrast detected: ${ratio.toFixed(2)}:1 (minimum recommended: 4.5:1)`)
      }

      return ratio
    } catch (error) {
      console.warn('Could not calculate color contrast:', error)
      return null
    }
  }, [])

  return { checkContrast }
}
