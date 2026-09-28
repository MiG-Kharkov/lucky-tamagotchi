// Offline cache. Game code is network-first, so versions don't get mixed after an update.
// Voice clips never change (the name is derived from the text), so they live in a separate cache and are served from it.
const CACHE = 'lucky-v14';
const AUDIO = 'lucky-audio-v1';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './css/style.css',
  './js/main.js', './js/state.js', './js/i18n.js', './js/dialogs.js', './js/art.js', './js/sound.js', './js/game.js', './js/voicekey.js', './js/content.js', './js/wardrobe.js', './js/config.js', './js/version.js',
  './js/antics.js', './js/missions.js', './js/ninja.js', './js/jokes.js', './js/english.js',
  './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png', './audio/manifest.json',
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' })));
    // Only missing clips are downloaded; if one fails, the game uses the built-in voice for it
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
  // Network first; from the cache when offline
  e.respondWith(fetch(e.request).then((res) => {
    if (res.ok) { const copy = res.clone(); e.waitUntil(caches.open(CACHE).then((c) => c.put(e.request, copy))); }
    return res;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
