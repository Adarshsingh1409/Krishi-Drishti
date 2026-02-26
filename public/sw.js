const CACHE_NAME = 'krishi-drishti-v1';
const STATIC_CACHE = `${CACHE_NAME}-static`;
const DATA_CACHE = `${CACHE_NAME}-data`;
const IMAGE_CACHE = `${CACHE_NAME}-images`;
const API_CACHE = `${CACHE_NAME}-api`;

// URLs to cache on install
const STATIC_URLS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-384x384.png'
];

// API endpoints that can be cached
const CACHEABLE_URLS = [
  '/api/weather',
  '/api/tips',
  '/api/fertilizer',
  '/api/identify-plant',
  '/api/predict-disease'
];

// Static assets that should be cached
const STATIC_ASSETS = [
  '/*.js',
  '/*.css',
  '/*.json',
  '/*.png',
  '/*.jpg',
  '/*.jpeg',
  '/*.svg',
  '/*.ico'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.startsWith('krishi-drishti-') && !cacheName.includes(CACHE_NAME)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-HTTP requests
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(STATIC_CACHE).then(cache => {
        return cache || fetch(event.request);
      })
    );
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    if (CACHEABLE_URLS.some(cacheable => url.pathname.includes(cacheable))) {
      event.respondWith(
        caches.open(API_CACHE).then(cache => {
          return cache.match(event.request).then(cachedResponse => {
            // Return cached response immediately if available
            if (cachedResponse) {
              // Fetch fresh data in background
              fetch(event.request).then(freshResponse => {
                if (freshResponse.ok) {
                  cache.put(event.request, freshResponse.clone());
                }
              }).catch(() => {
                // Ignore network errors for background fetch
              });
              return cachedResponse;
            }
            
            // If no cached response, fetch from network
            return fetch(event.request).then(response => {
              if (response.ok) {
                // Clone the response before caching
                const responseToCache = response.clone();
                cache.put(event.request, responseToCache);
              }
              return response;
            }).catch(() => {
              // Return a custom offline response for API failures
              return new Response(JSON.stringify({
                error: 'Offline',
                message: 'No cached data available',
                timestamp: new Date().toISOString()
              }), {
                headers: { 'Content-Type': 'application/json' },
                status: 503,
                statusText: 'Service Unavailable'
              });
            });
          });
        })
      );
    } else {
      // For non-cacheable API endpoints, try network first, then cache
      event.respondWith(
        fetch(event.request).catch(() => {
          return caches.match(event.request);
        })
      );
    }
    return;
  }

  // Handle image requests with enhanced caching
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(cache => {
        return cache.match(event.request).then(response => {
          return response || fetch(event.request).then(networkResponse => {
            // Cache successful image responses
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Handle static assets (JS, CSS, etc.)
  if (STATIC_ASSETS.some(pattern => {
    if (pattern.startsWith('*.')) {
      return url.pathname.endsWith(pattern.substring(1));
    }
    return url.pathname === pattern;
  })) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(cache => {
        return cache.match(event.request).then(response => {
          return response || fetch(event.request).then(networkResponse => {
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-weather') {
    event.waitUntil(
      syncWeatherData()
    );
  }
  
  if (event.tag === 'sync-offline-data') {
    event.waitUntil(
      syncOfflineData()
    );
  }
});

// Message handling from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_WEATHER') {
    event.waitUntil(
      cacheWeatherData(event.data.data)
    );
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      clearAllCaches()
    );
  }
  
  if (event.data && event.data.type === 'GET_CACHE_INFO') {
    event.waitUntil(
      getCacheInfo().then(info => {
        event.ports[0].postMessage(info);
      })
    );
  }
});

// Helper function to sync weather data
async function syncWeatherData() {
  try {
    const response = await fetch('/api/weather');
    const data = await response.json();
    await cacheWeatherData(data);
  } catch (error) {
    console.error('Failed to sync weather data:', error);
  }
}

// Helper function to sync offline data
async function syncOfflineData() {
  try {
    // This would sync any pending offline operations
    // For now, just log the sync attempt
    console.log('Syncing offline data...');
  } catch (error) {
    console.error('Failed to sync offline data:', error);
  }
}

// Helper function to cache weather data
async function cacheWeatherData(data) {
  const cache = await caches.open(API_CACHE);
  await cache.put('/api/weather', new Response(JSON.stringify(data)));
}

// Helper function to clear specific cache
async function clearCache(cacheName) {
  const cache = await caches.open(cacheName);
  const requests = await cache.keys();
  await Promise.all(
    requests.map(request => cache.delete(request))
  );
}

// Helper function to clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => {
      if (cacheName.startsWith('krishi-drishti-')) {
        return caches.delete(cacheName);
      }
    })
  );
}

// Helper function to get cache information
async function getCacheInfo() {
  const cacheNames = await caches.keys();
  const cacheInfo = {};
  
  for (const cacheName of cacheNames) {
    if (cacheName.startsWith('krishi-drishti-')) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      cacheInfo[cacheName] = requests.length;
    }
  }
  
  return cacheInfo;
}

// Handle push notifications (if implemented)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: data.data || {}
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});