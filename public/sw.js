const CACHE_NAME = 'fintrack-v1'
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/expenses',
  '/branches',
  '/documents',
  '/settings',
  '/manifest.webmanifest',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
]

// Install - Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// Fetch - Serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return

  // Skip Supabase API requests
  if (event.request.url.includes('supabase')) return

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found
      if (response) {
        return response
      }

      // Otherwise fetch from network
      return fetch(event.request)
        .then((networkResponse) => {
          // Don't cache non-successful responses
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse
          }

          // Cache new responses
          const responseToCache = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return networkResponse
        })
        .catch(() => {
          // Return offline fallback for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/dashboard')
          }
        })
    })
  )
})
