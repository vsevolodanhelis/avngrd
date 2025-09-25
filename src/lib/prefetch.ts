"use client"

import { useEffect } from "react"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

/**
 * Observe links within a root container and prefetch when they enter the viewport.
 * - Targets <a> with data-prefetch="true" or role="link" with href starting with '/'
 * - Uses rootMargin to start prefetching slightly before links enter view
 */
export function useSmartPrefetch(router: AppRouterInstance, options?: {
  root?: Element | null
  rootMargin?: string
  selector?: string
}) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const rootEl = (options?.root as Element | null) ?? (document as unknown as Element)
    const selector = options?.selector ?? 'a[data-prefetch="true"], a[href^="/"]'

    const links = Array.from(rootEl.querySelectorAll<HTMLAnchorElement>(selector))
      // avoid external and already-prefetched
      .filter((el) => {
        const href = el.getAttribute('href') || ''
        return href.startsWith('/') && !el.dataset.prefetched
      })

    if (links.length === 0) return

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLAnchorElement
          const href = el.getAttribute('href') || ''
          if (href.startsWith('/')) {
            try { router.prefetch(href) } catch {}
            el.dataset.prefetched = 'true'
          }
          io.unobserve(el)
        }
      }
    }, { root: null, rootMargin: options?.rootMargin ?? '200px', threshold: 0 })

    links.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [router, options?.root, options?.rootMargin, options?.selector])
}
