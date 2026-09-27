// Офлайн-кеш. Код игры — «сначала сеть, потом кеш», чтобы после обновления не смешивались версии файлов.
// Записи голоса не меняются (имя = текст фразы), поэтому живут в отдельном кеше и берутся только из него.
const CACHE = 'lucky-v12';
const AUDIO = 'lucky-audio-v1';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './css/style.css',
  './js/main.js', './js/state.js', './js/i18n.js', './js/dialogs.js', './js/art.js', './js/sound.js', './js/game.js', './js/voicekey.js', './js/content.js', './js/wardrobe.js', './js/config.js',
  './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png', './audio/manifest.json',
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' })));
    // Докачиваем только недостающие записи; если какая-то не скачалась, игра скажет её встроенным голосом
    const a = await caches.open(AUDIO);
    const ids = await fetch('./audio/manifest.json', { cache: 'reload' }).then((r) => r.json()).catch(() => []);
    for (let i = 0; i < ids.length; i += 20) {
      await Promise.all(ids.slice(i, i + 20).map(async (id) => {
        const url = `./audio/${id}.mp3`;
        if (!(await a.match(url))) await a.add(url).catch(() => {});
      }));
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== AUDIO).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (/\/audio\/[0-9a-f]+\.mp3$/.test(url.pathname)) {
    e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(AUDIO).then((c) => c.put(e.request, copy)); }
      return res;
    })));
    return;
  }
  // Сначала сеть; без сети — из кеша
  e.respondWith(fetch(e.request).then((res) => {
    if (res.ok) { const copy = res.clone(); e.waitUntil(caches.open(CACHE).then((c) => c.put(e.request, copy))); }
    return res;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
