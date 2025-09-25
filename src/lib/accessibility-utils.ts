// Enhanced accessibility utilities and WCAG compliance helpers

export interface AccessibilityConfig {
  enableHighContrast?: boolean
  enableReducedMotion?: boolean
  fontSize?: 'small' | 'medium' | 'large' | 'extra-large'
  focusVisible?: boolean
}

// WCAG 2.1 AA compliance checker
export class AccessibilityChecker {
  private static instance: AccessibilityChecker
  
  static getInstance(): AccessibilityChecker {
    if (!AccessibilityChecker.instance) {
      AccessibilityChecker.instance = new AccessibilityChecker()
    }
    return AccessibilityChecker.instance
  }

  // Check if element has proper ARIA labels
  checkAriaLabels(element: HTMLElement): string[] {
    const issues: string[] = []
    
    // Interactive elements should have accessible names
    const interactiveElements = ['button', 'a', 'input', 'select', 'textarea']
    if (interactiveElements.includes(element.tagName.toLowerCase())) {
      const hasLabel = element.getAttribute('aria-label') || 
                      element.getAttribute('aria-labelledby') ||
                      element.textContent?.trim() ||
                      (element as HTMLInputElement).labels?.length

      if (!hasLabel) {
        issues.push(`${element.tagName} element lacks accessible name`)
      }
    }

    // Images should have alt text
    if (element.tagName.toLowerCase() === 'img') {
      const alt = element.getAttribute('alt')
      if (alt === null) {
        issues.push('Image missing alt attribute')
      }
    }

    return issues
  }

  // Check color contrast ratio
  calculateContrastRatio(foreground: string, background: string): number {
    const getLuminance = (color: string): number => {
      const rgb = this.hexToRgb(color)
      if (!rgb) return 0

      const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })

      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const l1 = getLuminance(foreground)
    const l2 = getLuminance(background)
    
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  // Check keyboard navigation
  checkKeyboardNavigation(container: HTMLElement): string[] {
    const issues: string[] = []
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    focusableElements.forEach((element, index) => {
      const tabIndex = element.getAttribute('tabindex')
      
      // Check for positive tabindex (anti-pattern)
      if (tabIndex && parseInt(tabIndex) > 0) {
        issues.push(`Element has positive tabindex (${tabIndex}), use 0 or -1 instead`)
      }

      // Check if interactive elements are keyboard accessible
      if (element.tagName.toLowerCase() === 'div' && element.getAttribute('role') === 'button') {
        if (!element.getAttribute('tabindex')) {
          issues.push('Custom button (div with role="button") missing tabindex="0"')
        }
      }
    })

    return issues
  }
}

// Accessibility preferences manager
export class AccessibilityPreferences {
  private static readonly STORAGE_KEY = 'accessibility-preferences'
  
  static getPreferences(): AccessibilityConfig {
    if (typeof window === 'undefined') return {}
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  }

  static setPreferences(config: AccessibilityConfig): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config))
      this.applyPreferences(config)
    } catch (error) {
      console.warn('Failed to save accessibility preferences:', error)
    }
  }

  static applyPreferences(config: AccessibilityConfig): void {
    if (typeof document === 'undefined') return

    const root = document.documentElement

    // High contrast mode
    if (config.enableHighContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Reduced motion
    if (config.enableReducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }

    // Font size
    if (config.fontSize) {
      root.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large')
      root.classList.add(`font-${config.fontSize}`)
    }

    // Focus visible
    if (config.focusVisible) {
      root.classList.add('focus-visible-enabled')
    } else {
      root.classList.remove('focus-visible-enabled')
    }
  }

  static initializeFromSystemPreferences(): void {
    if (typeof window === 'undefined') return

    const config: AccessibilityConfig = {}

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      config.enableReducedMotion = true
    }

    // Check for high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      config.enableHighContrast = true
    }

    this.setPreferences({ ...this.getPreferences(), ...config })
  }
}

// Skip link component helper
export function createSkipLink(targetId: string, text: string = 'Skip to main content'): HTMLElement {
  const skipLink = document.createElement('a')
  skipLink.href = `#${targetId}`
  skipLink.textContent = text
  skipLink.className = 'skip-link'
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    z-index: 1000;
    border-radius: 4px;
    transition: top 0.3s;
  `
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px'
  })
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px'
  })

  return skipLink
}

// Live region announcer
export class LiveRegionAnnouncer {
  private politeRegion: HTMLElement | null = null
  private assertiveRegion: HTMLElement | null = null

  constructor() {
    this.createRegions()
  }

  private createRegions(): void {
    if (typeof document === 'undefined') return

    // Polite announcements
    this.politeRegion = document.createElement('div')
    this.politeRegion.setAttribute('aria-live', 'polite')
    this.politeRegion.setAttribute('aria-atomic', 'true')
    this.politeRegion.className = 'sr-only'
    this.politeRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;'

    // Assertive announcements
    this.assertiveRegion = document.createElement('div')
    this.assertiveRegion.setAttribute('aria-live', 'assertive')
    this.assertiveRegion.setAttribute('aria-atomic', 'true')
    this.assertiveRegion.className = 'sr-only'
    this.assertiveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;'

    document.body.appendChild(this.politeRegion)
    document.body.appendChild(this.assertiveRegion)
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const region = priority === 'polite' ? this.politeRegion : this.assertiveRegion
    
    if (region) {
      region.textContent = ''
      setTimeout(() => {
        if (region) region.textContent = message
      }, 100)
    }
  }

  destroy(): void {
    if (this.politeRegion?.parentNode) {
      this.politeRegion.parentNode.removeChild(this.politeRegion)
    }
    if (this.assertiveRegion?.parentNode) {
      this.assertiveRegion.parentNode.removeChild(this.assertiveRegion)
    }
  }
}
