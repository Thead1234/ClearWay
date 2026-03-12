// Service Worker for Clear Way Breakdown Service
const CACHE_VERSION = 'v20240312';
const CACHE_NAME = `clearway-${CACHE_VERSION}`;
const urlsToCache = [
  '/',
  '/index.html',
  `/style.css?v=${CACHE_VERSION}`,
  `/script.js?v=${CACHE_VERSION}`,
  '/assets/logo.png',
  '/assets/hero-bg.jpg'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
