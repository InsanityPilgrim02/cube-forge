// Cube Forge service worker.
// Serves the app from its offline copy and NEVER looks for updates by itself: the page's Settings > "Look for updates"
// button downloads a newer copy into this cache when the user asks. Requests the page marks as no-store go straight to the network.
// Keep this file unchanged between releases (browsers re-check it on their own, and unchanged bytes mean nothing happens).
const CACHE = 'cube-forge-app';   // must match APP_CACHE in index.html
const INDEX = new URL('index.html', self.registration.scope).href;
const PRECACHE = [INDEX, new URL('manifest.webmanifest', self.registration.scope).href, new URL('apple-touch-icon.png', self.registration.scope).href];

// a redirected response can't be served to a page navigation, so store a clean copy instead
const clean = async res => res.redirected ? new Response(await res.blob(), { status: 200, headers: res.headers }) : res;

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(PRECACHE.map(u =>
    fetch(u).then(clean).then(r => r.ok && c.put(u, r)).catch(() => {})))));
});

self.addEventListener('activate', e => e.waitUntil((async () => {
  // only this app's own earlier caches; never another app's on the same origin
  for (const k of await caches.keys()) if (k !== CACHE && /^(cube-forge|mtg-cube-pack-gen)/.test(k)) await caches.delete(k);
  await self.clients.claim();
})()));

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;       // Scryfall / Cube Cobra always use the network
  if (req.cache === 'no-store' || req.cache === 'reload') return;                // update checks bypass the offline copy
  e.respondWith((async () => {
    const cache = await caches.open(CACHE), nav = req.mode === 'navigate', key = nav ? INDEX : req;
    const hit = await cache.match(key);
    if (hit) return hit;                                                          // offline copy first, always
    try {
      const res = await fetch(req);
      if (res.ok) cache.put(key, (await clean(res.clone())));
      return res;
    } catch (err) {
      return (nav && await cache.match(INDEX)) || Response.error();
    }
  })());
});
