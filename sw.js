const CACHE = 'bayanihub-v42';
const ASSETS = [
  './',
  './index.html',
  './assets/gcash-qr.svg',
  './campaign.html',
  './help.html',
  './assets/bayanihub-cover.svg',
  './submit.html',
  './dashboard.html',
  './how.html',
  './privacy.html',
  './sponsor.html',
  './login.html',
  './admin.html',
  './logout.html',
  './js/data.js',
  './js/app.js',
  './js/revenue.js',
  './js/payments.js',
  './payment-return.html',
  './js/supabase.js',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const pathname = new URL(e.request.url).pathname;
  // The staff control center must always load the latest cloud-admin code.
  if (pathname.endsWith('/admin.html') || pathname.endsWith('/logout.html') || pathname.endsWith('/js/supabase.js')) return;
  const isHtml = e.request.mode === 'navigate' || e.request.headers.get('accept')?.includes('text/html');
  e.respondWith(
    (isHtml
      ? fetch(e.request, { cache: 'no-store' }).then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
          return res;
        }).catch(() => caches.match(e.request))
      : caches.match(e.request).then(cached =>
          cached || fetch(e.request).then(res => {
            const clone = res.clone();
            caches.open(CACHE).then(cache => cache.put(e.request, clone));
            return res;
          })
        )
    ).catch(() => caches.match(e.request))
  );
});
