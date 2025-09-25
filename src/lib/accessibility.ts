// Accessibility utilities for WCAG 2.1 AA compliance

// Announce messages to screen readers
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  if (typeof window === 'undefined') return

  const announcer = document.createElement('div')
  announcer.setAttribute('aria-live', priority)
  announcer.setAttribute('aria-atomic', 'true')
  announcer.className = 'sr-only absolute -left-10000 w-1 h-1 overflow-hidden'
  announcer.textContent = message
  
  document.body.appendChild(announcer)
  
  // Clean up after announcement
  setTimeout(() => {
    if (document.body.contains(announcer)) {
      document.body.removeChild(announcer)
    }
  }, 1000)
}

// Focus management utilities
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>
  
  const firstFocusable = focusableElements[0]
  const lastFocusable = focusableElements[focusableElements.length - 1]
  
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          event.preventDefault()
          lastFocusable.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          event.preventDefault()
          firstFocusable.focus()
        }
      }
    }
  }
  
  element.addEventListener('keydown', handleKeyDown)
  
  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown)
  }
}

// Check color contrast ratio (simplified)
export function hasGoodContrast(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  // This is a simplified check - in production, use a proper color contrast library
  const requiredRatio = level === 'AA' ? 4.5 : 7
  
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
  
  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }
  
  const fg = hexToRgb(foreground)
  const bg = hexToRgb(background)
  
  if (!fg || !bg) return false
  
  const fgLum = getLuminance(fg.r, fg.g, fg.b)
  const bgLum = getLuminance(bg.r, bg.g, bg.b)
  
  const ratio = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05)
  
  return ratio >= requiredRatio
}

// Keyboard navigation helpers
export function handleArrowNavigation(
  event: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  onIndexChange: (index: number) => void
): void {
  let newIndex = currentIndex
  
  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      event.preventDefault()
      newIndex = (currentIndex + 1) % items.length
      break
    case 'ArrowUp':
    case 'ArrowLeft':
      event.preventDefault()
      newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1
      break
    case 'Home':
      event.preventDefault()
      newIndex = 0
      break
    case 'End':
      event.preventDefault()
      newIndex = items.length - 1
      break
    default:
      return
  }
  
  onIndexChange(newIndex)
  items[newIndex]?.focus()
}

// Skip link functionality
export function createSkipLink(targetId: string, text: string): HTMLElement {
  const skipLink = document.createElement('a')
  skipLink.href = `#${targetId}`
  skipLink.textContent = text
  skipLink.className = `
    sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
    bg-yellow-400 text-gray-900 px-4 py-2 rounded-md font-medium 
    z-50 focus:outline-none focus:ring-2 focus:ring-yellow-500
  `
  
  skipLink.addEventListener('click', (event) => {
    event.preventDefault()
    const target = document.getElementById(targetId)
    if (target) {
      target.focus()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
  
  return skipLink
}

// Form validation accessibility
export function announceFormErrors(errors: string[], language: 'uk' | 'en'): void {
  if (errors.length === 0) return
  
  const errorCount = errors.length
  const errorMessage = language === 'uk' 
    ? `Знайдено ${errorCount} ${errorCount === 1 ? 'помилку' : 'помилок'} у формі: ${errors.join(', ')}`
    : `Found ${errorCount} ${errorCount === 1 ? 'error' : 'errors'} in form: ${errors.join(', ')}`
  
  announceToScreenReader(errorMessage, 'assertive')
}

// Reduced motion detection
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// High contrast detection
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false
  
  return window.matchMedia('(prefers-contrast: high)').matches
}

// Focus visible utility
export function addFocusVisiblePolyfill(): void {
  if (typeof window === 'undefined') return
  
  let hadKeyboardEvent = true
  
  const keyboardThrottleTimeout = 100
  let keyboardThrottleTimeoutID = 0
  
  const pointerEvents = ['mousedown', 'pointerdown', 'touchstart']
  const keyboardEvents = ['keydown']
  
  function onPointerDown() {
    hadKeyboardEvent = false
  }
  
  function onKeyDown(event: KeyboardEvent) {
    if (event.metaKey || event.altKey || event.ctrlKey) {
      return
    }
    
    hadKeyboardEvent = true
    
    clearTimeout(keyboardThrottleTimeoutID)
    keyboardThrottleTimeoutID = window.setTimeout(() => {
      hadKeyboardEvent = false
    }, keyboardThrottleTimeout)
  }
  
  function onFocus(event: FocusEvent) {
    const target = event.target as HTMLElement
    if (hadKeyboardEvent || target.matches(':focus-visible')) {
      target.classList.add('focus-visible')
    }
  }
  
  function onBlur(event: FocusEvent) {
    const target = event.target as HTMLElement
    target.classList.remove('focus-visible')
  }
  
  // Add event listeners
  pointerEvents.forEach(eventName => {
    document.addEventListener(eventName, onPointerDown, true)
  })
  
  keyboardEvents.forEach(eventName => {
    document.addEventListener(eventName, onKeyDown, true)
  })
  
  document.addEventListener('focus', onFocus, true)
  document.addEventListener('blur', onBlur, true)
}
