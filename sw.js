/* Service worker — caches the app shell for offline / installable use.
   Scryfall and Cube Cobra network requests are never cached here. */
const CACHE_NAME = 'mtg-cube-pack-gen-v3';
const APP_SHELL = [
  './',
  './index.html',
  './mtg-cube-pack-generator.html',
  './manifest.webmanifest',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  './sw.js'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_SHELL);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never intercept third-party APIs (Scryfall, Cube Cobra, etc.)
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (res) {
        if (res && res.ok && url.protocol.startsWith('http')) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(req, clone);
          });
        }
        return res;
      }).catch(function () {
        if (req.mode === 'navigate') {
          return caches.match('./mtg-cube-pack-generator.html').then(function (page) {
            return page || caches.match('./index.html');
          });
        }
        return cached;
      });
    })
  );
});
