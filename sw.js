const CACHE = 'pool-heat-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './fixed-window.js',
  './icon-192.svg',
  './icon-512.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(async response => {
          let html = await response.text();
          if (!html.includes('fixed-window.js')) {
            html = html.replace('</body>', '<script src="./fixed-window.js"></script></body>');
          }
          return new Response(html, {
            status: response.status,
            statusText: response.statusText,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          });
        })
        .catch(async () => {
          const cached = await caches.match('./index.html');
          if (!cached) return Response.error();
          let html = await cached.text();
          if (!html.includes('fixed-window.js')) {
            html = html.replace('</body>', '<script src="./fixed-window.js"></script></body>');
          }
          return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        })
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
