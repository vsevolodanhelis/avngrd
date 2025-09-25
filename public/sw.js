// Service Worker for offline caching and performance optimization

const VERSION = 'v3'
const STATIC_CACHE = `static-${VERSION}`
const RUNTIME_CACHE = `runtime-${VERSION}`
const HTML_CACHE = `html-${VERSION}`
const DYNAMIC_CACHE = 'dynamic-v1'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/offline.html',
  // Add your critical CSS and JS files here
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => 
              ![STATIC_CACHE, RUNTIME_CACHE, HTML_CACHE, DYNAMIC_CACHE].includes(cacheName)
            )
            .map((cacheName) => caches.delete(cacheName))
        )
      })
      .then(() => self.clients.claim())
  )
})

// Network timeout helper
const NETWORK_TIMEOUT_MS = 3000
const raceNetworkWithTimeout = (request) => {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), NETWORK_TIMEOUT_MS))
  ])
}

// Fetch event - strategic caching
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Handle static assets
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request)
        .then((response) => response || fetch(request))
    )
    return
  }

  // Images and fonts: cache-first with runtime cache
  if (request.destination === 'image' || url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg') || url.pathname.endsWith('.jpeg') || url.pathname.endsWith('.webp') || url.pathname.endsWith('.avif') || url.pathname.startsWith('/fonts/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((response) => {
          const copy = response.clone()
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy))
          return response
        })
      })
    )
    return
  }

  // HTML navigation requests: stale-while-revalidate with network timeout and offline fallback
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      (async () => {
        try {
          // Try network quickly
          const network = await raceNetworkWithTimeout(request)
          const copy = network.clone()
          caches.open(HTML_CACHE).then((cache) => cache.put(request, copy))
          return network
        } catch (_) {
          // Fallback to cache, then offline page
          const cached = await caches.match(request)
          return cached || caches.match('/offline.html')
        }
      })()
    )
    return
  }

  // API: network-first with cache fallback (short-lived)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() => caches.match(request))
    )
    return
  }

  // Default: cache, then network and store
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) return response

        return fetch(request)
          .then((network) => {
            if (!network || network.status !== 200 || network.type !== 'basic') return network
            const copy = network.clone()
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy))
            return network
          })
          .catch(() => undefined)
      })
  )
})

// Background Sync (stub for failed POSTs)
self.addEventListener('sync', (event) => {
  if (event.tag === 'retry-posts') {
    event.waitUntil((async () => {
      // Implement retry logic using IndexedDB queue if needed
      // Placeholder: no-op
      return true
    })())
  }
})
