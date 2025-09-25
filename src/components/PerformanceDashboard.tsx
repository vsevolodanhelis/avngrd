'use client'

import { useWebVitals, useCustomMetrics } from '@/hooks/usePerformanceMonitor'
import { useState, useEffect } from 'react'

interface PerformanceDashboardProps {
  enabled?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export function PerformanceDashboard({ 
  enabled = process.env.NODE_ENV === 'development',
  position = 'bottom-right' 
}: PerformanceDashboardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { metrics } = useWebVitals({ enabled })
  const { startMeasure, endMeasure } = useCustomMetrics()

  useEffect(() => {
    // Toggle visibility with Ctrl+Shift+P
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!enabled || !isVisible) {
    return null
  }

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  }

  const getMetricColor = (value: number | null, thresholds: [number, number]) => {
    if (value === null) return 'text-gray-400'
    if (value <= thresholds[0]) return 'text-green-500'
    if (value <= thresholds[1]) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50 bg-black/90 text-white p-4 rounded-lg shadow-lg backdrop-blur-sm max-w-sm`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold">Performance Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white text-xs"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-gray-300">LCP:</span>
            <span className={`ml-1 font-mono ${getMetricColor(metrics.LCP, [2500, 4000])}`}>
              {metrics.LCP ? `${metrics.LCP.toFixed(0)}ms` : '—'}
            </span>
          </div>
          <div>
            <span className="text-gray-300">FID:</span>
            <span className={`ml-1 font-mono ${getMetricColor(metrics.FID, [100, 300])}`}>
              {metrics.FID ? `${metrics.FID.toFixed(0)}ms` : '—'}
            </span>
          </div>
          <div>
            <span className="text-gray-300">CLS:</span>
            <span className={`ml-1 font-mono ${getMetricColor(metrics.CLS ? metrics.CLS * 1000 : null, [100, 250])}`}>
              {metrics.CLS ? metrics.CLS.toFixed(3) : '—'}
            </span>
          </div>
          <div>
            <span className="text-gray-300">FCP:</span>
            <span className={`ml-1 font-mono ${getMetricColor(metrics.FCP, [1800, 3000])}`}>
              {metrics.FCP ? `${metrics.FCP.toFixed(0)}ms` : '—'}
            </span>
          </div>
          <div>
            <span className="text-gray-300">TTFB:</span>
            <span className={`ml-1 font-mono ${getMetricColor(metrics.TTFB, [800, 1800])}`}>
              {metrics.TTFB ? `${metrics.TTFB.toFixed(0)}ms` : '—'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-600 text-xs text-gray-400">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  )
}
