const SHELL_CACHE = 'exchange-shell-0ad0e43f573f';
const ASSETS = [".","index.html","favicon.svg","qr-code.svg","manifest.webmanifest","./characters/muse/o01.webp","./characters/muse/o02.webp","./characters/muse/o03.webp","./characters/muse/o04.webp","./characters/muse/o05.webp","./characters/muse/o06.webp","./characters/muse/o07.webp","./characters/muse/o08.webp","./characters/muse/o09.webp","./characters/aqours/u01.webp","./characters/aqours/u02.webp","./characters/aqours/u03.webp","./characters/aqours/u04.webp","./characters/aqours/u05.webp","./characters/aqours/u06.webp","./characters/aqours/u07.webp","./characters/aqours/u08.webp","./characters/aqours/u09.webp","./characters/nijigasaki/n01.webp","./characters/nijigasaki/n02.webp","./characters/nijigasaki/n03.webp","./characters/nijigasaki/n04.webp","./characters/nijigasaki/n05.webp","./characters/nijigasaki/n06.webp","./characters/nijigasaki/n07.webp","./characters/nijigasaki/n08.webp","./characters/nijigasaki/n09.webp","./characters/nijigasaki/n10.webp","./characters/nijigasaki/n11.webp","./characters/nijigasaki/n12.webp","./characters/nijigasaki/n13.webp","./characters/liella/y01.webp","./characters/liella/y02.webp","./characters/liella/y03.webp","./characters/liella/y04.webp","./characters/liella/y05.webp","./characters/liella/y06.webp","./characters/liella/y07.webp","./characters/liella/y08.webp","./characters/liella/y09.webp","./characters/liella/y10.webp","./characters/liella/y11.webp","./characters/hasunosora/h01.webp","./characters/hasunosora/h02.webp","./characters/hasunosora/h03.webp","./characters/hasunosora/h04.webp","./characters/hasunosora/h05.webp","./characters/hasunosora/h06.webp","./characters/hasunosora/h07.webp","./characters/hasunosora/h08.webp","./characters/hasunosora/h09.webp","./characters/hasunosora/h10.webp","./characters/hasunosora/h11.webp","./characters/ikizulive/bb01.webp","./characters/ikizulive/bb02.webp","./characters/ikizulive/bb03.webp","./characters/ikizulive/bb04.webp","./characters/ikizulive/bb05.webp","./characters/ikizulive/bb06.webp","./characters/ikizulive/bb07.webp","./characters/ikizulive/bb08.webp","./characters/ikizulive/bb09.webp","./characters/ikizulive/bb10.webp","./characters/musical/m01.webp","./characters/musical/m02.webp","./characters/musical/m03.webp","./characters/musical/m04.webp","./characters/musical/m05.webp","./characters/musical/m06.webp","./characters/musical/m07.webp","./characters/musical/m08.webp","./characters/musical/m09.webp","./characters/musical/m10.webp","./characters/yohane/yohane01.webp","./characters/yohane/yohane02.webp","./characters/yohane/yohane03.webp","./characters/yohane/yohane04.webp","./characters/yohane/yohane05.webp","./characters/yohane/yohane06.webp","./characters/yohane/yohane07.webp","./characters/yohane/yohane08.webp","./characters/yohane/yohane09.webp","./characters/yohane/yohane10.webp","assets/index-9kFGj2nS.js","assets/index-Dsq-uh2J.css"];
const scope = self.registration.scope;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL_CACHE).then(cache => cache.addAll(ASSETS.map(path => new URL(path, scope).href))));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('exchange-shell-') && key !== SHELL_CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(scope)) return;
  event.respondWith((async () => {
    const cache = await caches.open(SHELL_CACHE);
    // 应用壳内容固定；忽略静态服务器的 Vary: Origin，兼容模块脚本的跨源请求模式。
    const cached = await cache.match(event.request, { ignoreSearch: event.request.mode === 'navigate', ignoreVary: true });
    if (cached) return cached;
    try {
      return await fetch(event.request);
    } catch (error) {
      if (event.request.mode === 'navigate') {
        const shell = await cache.match(new URL('index.html', scope).href, { ignoreVary: true });
        if (shell) return shell;
      }
      throw error;
    }
  })());
});
