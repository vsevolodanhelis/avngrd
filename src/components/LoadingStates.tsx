'use client'

import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'yellow' | 'blue' | 'gray'
  className?: string
}

// Aggregated loading states used by dynamic imports
export const ChatWidget = function ChatWidgetLoading() {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="bg-white/90 backdrop-blur shadow-lg rounded-xl p-4 flex items-center space-x-3 border border-gray-200">
        <LoadingSpinner size="md" color="yellow" />
        <span className="text-sm text-gray-700">Завантаження чату…</span>
      </div>
    </div>
  )
}

export const Dropdown = function DropdownLoading() {
  return (
    <div className="p-4 min-w-[200px]">
      <div className="space-y-2">
        <Skeleton width="80%" />
        <Skeleton width="70%" />
        <Skeleton width="60%" />
      </div>
    </div>
  )
}

export const Header = function HeaderLoading() {
  return <HeaderSkeleton />
}

export const Generic = function GenericLoading() {
  return <LoadingPage />
}

export const LoadingStates = { ChatWidget, Dropdown, Header, Generic }

export function LoadingSpinner({ 
  size = 'md', 
  color = 'yellow', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const colorClasses = {
    yellow: 'text-yellow-500',
    blue: 'text-blue-500',
    gray: 'text-gray-500'
  }

  return (
    <div className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave'
}

export function Skeleton({ 
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse'
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 rounded'
  
  const variantClasses = {
    text: 'h-4 w-full',
    rectangular: 'w-full h-32',
    circular: 'rounded-full w-12 h-12'
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'
  }

  const style = {
    width: width || undefined,
    height: height || undefined
  }

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <Skeleton variant="rectangular" height={200} />
      <div className="space-y-2">
        <Skeleton width="75%" />
        <Skeleton width="50%" />
        <Skeleton width="90%" />
      </div>
      <div className="flex space-x-2">
        <Skeleton variant="circular" />
        <div className="flex-1 space-y-1">
          <Skeleton width="40%" />
          <Skeleton width="60%" />
        </div>
      </div>
    </div>
  )
}

export function HeaderSkeleton() {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Skeleton variant="rectangular" width={120} height={40} />
            <div className="hidden md:flex space-x-6">
              <Skeleton width={80} height={20} />
              <Skeleton width={100} height={20} />
              <Skeleton width={90} height={20} />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton width={60} height={20} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} width={`${100 / columns}%`} height={20} />
          ))}
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} width={`${100 / columns}%`} height={16} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface LoadingPageProps {
  message?: string
  showSpinner?: boolean
}

export function LoadingPage({ message, showSpinner = true }: LoadingPageProps) {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {showSpinner && (
          <div className="mb-4 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {message || t('common.loading') || 'Завантаження...'}
        </h2>
        <p className="text-sm text-gray-600">
          {t('common.pleaseWait') || 'Будь ласка, зачекайте...'}
        </p>
      </div>
    </div>
  )
}

// Higher-order component for adding loading states
export function withLoading<P extends object>(
  Component: React.ComponentType<P>,
  LoadingComponent: React.ComponentType = LoadingPage
) {
  return function WithLoadingComponent(props: P & { isLoading?: boolean }) {
    const { isLoading, ...componentProps } = props
    
    if (isLoading) {
      return <LoadingComponent />
    }
    
    return <Component {...(componentProps as P)} />
  }
}
