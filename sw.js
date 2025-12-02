const CACHE_NAME = 'molove-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/components/Header.js',
  '/components/ProductCard.js',
  '/components/ProductDetail.js',
  '/utils/products.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});