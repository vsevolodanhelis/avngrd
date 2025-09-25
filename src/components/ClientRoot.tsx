'use client'

import React, { useEffect } from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { PerformanceDashboard } from '@/components/PerformanceDashboard'
import { registerServiceWorker } from '@/lib/cache'
import { useWebVitals } from '@/hooks/usePerformanceMonitor'
import { ThirdPartyScripts } from '@/components/ThirdPartyScripts'
import InstallPrompt from '@/components/InstallPrompt'

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  // Monitor Web Vitals in dev
  useWebVitals()

  // Register Service Worker (only in production suggested, but safe guarded by SW availability)
  useEffect(() => {
    registerServiceWorker()
  }, [])

  // Dev-only accessibility checks with axe-core
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Lazy load to avoid impacting production bundles
      import('@axe-core/react').then((axe) => {
        // 1000ms debounce for fewer console logs
        axe.default(React, (window as any), 1000)
      }).catch(() => {})
    }
  }, [])

  return (
    <ThemeProvider>
      <ErrorBoundary>
        {children}
        <aside role="complementary" aria-label="Application helpers" className="contents">
          <ThirdPartyScripts />
          <InstallPrompt />
          {/* Toggle with Ctrl+Shift+P */}
          <PerformanceDashboard />
        </aside>
      </ErrorBoundary>
    </ThemeProvider>
  )
}
