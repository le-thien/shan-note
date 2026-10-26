// Service Worker cho ứng dụng Nét (Hỗ trợ chạy Offline & Cài đặt PWA)
const CACHE_NAME = 'net-app-v20';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './graph_widget.js',
  './hhkg3d.js',
  './fx580.js',
  './favicon.svg',
  './manifest.json',
  './fonts/ClassWizXDisplay-Regular.woff2',
  './fonts/ClassWizXDisplay-Regular.woff',
  './fonts/ClassWizXDisplay-Regular.ttf'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Chỉ xử lý các yêu cầu GET trong cùng nguồn gốc
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isCoreAsset = event.request.mode === 'navigate' ||
                      event.request.destination === 'document' ||
                      url.pathname.endsWith('.html') ||
                      url.pathname.endsWith('.css') ||
                      url.pathname.endsWith('.js');

  // Với tài nguyên cốt lõi (HTML, CSS, JS): luôn ưu tiên mạng (Network-First) để giao diện luôn mới nhất
  if (isCoreAsset) {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        }
        return networkResponse;
      }).catch(() => caches.match(event.request) || caches.match('./index.html'))
    );
    return;
  }

  // Với các tài nguyên tĩnh khác: Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
