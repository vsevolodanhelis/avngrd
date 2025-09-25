'use client'

import dynamic from 'next/dynamic'
import { ComponentType, Suspense } from 'react'
import { LoadingStates } from './LoadingStates'

// Dynamic imports with loading states
export const LazyAIChatWidget = dynamic(
  () => import('./AIChatWidget').then(mod => ({ default: mod.AIChatWidget })),
  {
    loading: () => <LoadingStates.ChatWidget />,
    ssr: false
  }
)

export const LazySettingsDropdown = dynamic(
  () => import('./SettingsDropdown').then(mod => ({ default: mod.SettingsDropdown })),
  {
    loading: () => <LoadingStates.Dropdown />,
    ssr: false
  }
)

export const LazySiteHeader = dynamic(
  () => import('./SiteHeader').then(mod => ({ default: mod.SiteHeader })),
  {
    loading: () => <LoadingStates.Header />,
    ssr: true // Keep SSR for header as it's critical for SEO
  }
)

// Higher-order component for lazy loading with error boundary
interface LazyWrapperProps {
  fallback?: ComponentType
  errorFallback?: ComponentType<{ error: Error; retry: () => void }>
}

export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyWrapperProps = {}
) {
  const LazyComponent = dynamic(importFn, {
    loading: () => (options.fallback ? <options.fallback /> : <LoadingStates.Generic />),
    ssr: false
  })

  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={options.fallback ? <options.fallback /> : <LoadingStates.Generic />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

// Preload function for critical components
export const preloadComponents = {
  aiChat: () => import('./AIChatWidget'),
  settings: () => import('./SettingsDropdown'),
  header: () => import('./SiteHeader')
}

// Hook for preloading components on user interaction
export function usePreloadOnHover() {
  const preloadOnHover = (componentKey: keyof typeof preloadComponents) => ({
    onMouseEnter: () => preloadComponents[componentKey](),
    onFocus: () => preloadComponents[componentKey]()
  })

  return { preloadOnHover }
}
