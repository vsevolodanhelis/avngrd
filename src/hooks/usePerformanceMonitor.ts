'use client'

import { useEffect, useRef, useCallback } from 'react'
import { onCLS, onFID, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals'

interface PerformanceMetrics {
  renderTime: number
  componentName: string
  timestamp: number
}

interface UsePerformanceMonitorOptions {
  enabled?: boolean
  threshold?: number // ms
  onSlowRender?: (metrics: PerformanceMetrics) => void
}

/**
 * Custom hook for monitoring component render performance
 * Useful for identifying performance bottlenecks during development
 */
export function usePerformanceMonitor(
  componentName: string,
  options: UsePerformanceMonitorOptions = {}
) {
  const {
    enabled = process.env.NODE_ENV === 'development',
    threshold = 16, // 16ms = 60fps
    onSlowRender
  } = options

  const renderStartTime = useRef<number>(0)
  const renderCount = useRef<number>(0)
  const totalRenderTime = useRef<number>(0)

  // Start timing before render
  const startTiming = useCallback(() => {
    if (!enabled) return
    renderStartTime.current = performance.now()
  }, [enabled])

  // End timing after render
  const endTiming = useCallback(() => {
    if (!enabled || renderStartTime.current === 0) return

    const renderTime = performance.now() - renderStartTime.current
    renderCount.current += 1
    totalRenderTime.current += renderTime

    const metrics: PerformanceMetrics = {
      renderTime,
      componentName,
      timestamp: Date.now()
    }

    // Log slow renders
    if (renderTime > threshold) {
      console.warn(
        `🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`,
        metrics
      )
      onSlowRender?.(metrics)
    }

    // Log performance stats every 100 renders
    if (renderCount.current % 100 === 0) {
      const avgRenderTime = totalRenderTime.current / renderCount.current
      console.log(
        `📊 ${componentName} Performance Stats:`,
        {
          totalRenders: renderCount.current,
          averageRenderTime: `${avgRenderTime.toFixed(2)}ms`,
          totalTime: `${totalRenderTime.current.toFixed(2)}ms`
        }
      )
    }

    renderStartTime.current = 0
  }, [enabled, threshold, componentName, onSlowRender])

  // Measure render time
  useEffect(() => {
    startTiming()
    return endTiming
  })

  return {
    renderCount: renderCount.current,
    averageRenderTime: renderCount.current > 0 
      ? totalRenderTime.current / renderCount.current 
      : 0
  }
}

interface WebVitalsMetrics {
  CLS: number | null
  FID: number | null
  FCP: number | null
  LCP: number | null
  TTFB: number | null
}

interface UseWebVitalsOptions {
  enabled?: boolean
  reportToAnalytics?: (metric: Metric) => void
  logToConsole?: boolean
}

/**
 * Enhanced hook for monitoring Web Vitals and Core Web Vitals
 * Uses the official web-vitals library for accurate measurements
 */
export function useWebVitals(options: UseWebVitalsOptions = {}) {
  const {
    enabled = true,
    reportToAnalytics,
    logToConsole = process.env.NODE_ENV === 'development'
  } = options

  const metricsRef = useRef<WebVitalsMetrics>({
    CLS: null,
    FID: null,
    FCP: null,
    LCP: null,
    TTFB: null
  })

  const handleMetric = useCallback((metric: Metric) => {
    const { name, value, rating } = metric
    
    // Update metrics ref
    metricsRef.current = {
      ...metricsRef.current,
      [name]: value
    }

    if (logToConsole) {
      const emoji = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '❌'
      console.log(`${emoji} ${name}:`, {
        value: `${value.toFixed(2)}ms`,
        rating,
        delta: metric.delta,
        id: metric.id
      })
    }

    // Report to analytics if provided
    reportToAnalytics?.(metric)

    // RUM: sample and send to GA4 or custom endpoint
    try {
      if (typeof window !== 'undefined') {
        // Respect Do Not Track
        const dnt = (navigator as any).doNotTrack === '1' || (window as any).doNotTrack === '1'
        if (dnt) return

        // 10% sampling by default (can override via env)
        const sampleRate = Number(process.env.NEXT_PUBLIC_RUM_SAMPLE_RATE || 0.1)
        if (Math.random() > sampleRate) return

        const payload = {
          id: metric.id,
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          navigationType: (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.type,
          url: location.pathname,
          ua: navigator.userAgent,
          ts: Date.now(),
        }

        const ga4 = (window as any).gtag && process.env.NEXT_PUBLIC_GA4_ID
        if (ga4) {
          // Lightweight GA4 event
          try {
            (window as any).gtag('event', metric.name, {
              value: metric.value,
              metric_id: metric.id,
              metric_rating: metric.rating,
              non_interaction: true,
            })
          } catch {}
        }

        const endpoint = process.env.NEXT_PUBLIC_RUM_ENDPOINT
        if (endpoint) {
          const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
          if (navigator.sendBeacon) {
            navigator.sendBeacon(endpoint, blob)
          } else {
            fetch(endpoint, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {})
          }
        }
      }
    } catch {}
  }, [logToConsole, reportToAnalytics])

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    // Measure all Core Web Vitals
    onCLS(handleMetric)
    onFID(handleMetric)
    onFCP(handleMetric)
    onLCP(handleMetric)
    onTTFB(handleMetric)

  }, [enabled, handleMetric])

  return {
    metrics: metricsRef.current,
    getMetric: (name: keyof WebVitalsMetrics) => metricsRef.current[name]
  }
}

/**
 * Hook for measuring custom performance metrics
 */
export function useCustomMetrics() {
  const startMeasure = useCallback((name: string) => {
    if (typeof window !== 'undefined') {
      performance.mark(`${name}-start`)
    }
  }, [])

  const endMeasure = useCallback((name: string) => {
    if (typeof window !== 'undefined') {
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)
      
      const measure = performance.getEntriesByName(name, 'measure')[0]
      if (measure) {
        console.log(`⏱️ ${name}:`, measure.duration.toFixed(2) + 'ms')
      }
    }
  }, [])

  return { startMeasure, endMeasure }
}
