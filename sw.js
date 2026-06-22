const CACHE_NAME = 'meu-remedio-v3';
const fromScope = (path) => new URL(path, self.registration.scope).toString();
const APP_SHELL = [
  fromScope('./'),
  fromScope('./index.html'),
  fromScope('./manifest.webmanifest'),
  fromScope('./icons/icon.svg'),
  fromScope('./icons/icon-192.png'),
  fromScope('./icons/icon-512.png'),
  fromScope('./icons/apple-touch-icon.png')
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(APP_SHELL);

      const indexResponse = await fetch(fromScope('./index.html'), { cache: 'reload' });
      const indexHtml = await indexResponse.text();
      const assetUrls = Array.from(indexHtml.matchAll(/(?:src|href)="([^"]+)"/g))
        .map((match) => match[1])
        .filter((url) => url.includes('/assets/') || url.startsWith('./assets/') || url.startsWith('assets/'))
        .map((url) => new URL(url, self.registration.scope).toString());

      await Promise.all(assetUrls.map((url) => cache.add(url)));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => caches.match(fromScope('./index.html')));
    })
  );
});
