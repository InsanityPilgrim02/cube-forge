/* Cube Forge service worker.
   The page is served from the offline copy; updates are fetched into this cache by the page itself
   (Settings -> Look for updates), so the installed app never changes underneath you.
   Keep CACHE and INDEX in step with APP_CACHE / INDEX_URL in index.html. */
const CACHE = 'cube-forge-app';
const INDEX = './index.html';
const SHELL = [INDEX, './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  // One missing file (e.g. an icon) must not abort the whole install.
  e.waitUntil(caches.open(CACHE)
    .then(c => Promise.allSettled(SHELL.map(u => c.add(u))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    // Only clear this app's own old caches (current + earlier Cube Forge names); never other apps on the same origin.
    .then(keys => Promise.all(keys.filter(k => k !== CACHE && /^(cube-forge|mtg-cube-pack-gen)/.test(k)).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  // Never touch third-party APIs (Scryfall, Cube Cobra) or the page's own no-store update checks.
  if (req.method !== 'GET' || url.origin !== self.location.origin || req.cache === 'no-store') return;

  if (req.mode === 'navigate') {
    e.respondWith(caches.match(INDEX).then(hit => hit || fetch(req)));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
