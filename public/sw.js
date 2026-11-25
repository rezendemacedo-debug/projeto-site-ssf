/* Offline das páginas já visitadas. Rede primeiro, para horários e textos nunca ficarem velhos. */
const CACHE = "ssf-v1";
const MAX_PAGES = 80;
const MAX_ASSETS = 160;
const BASE = new URL(self.registration.scope).pathname;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll([BASE, `${BASE}parasha/`, `${BASE}calendario/`])).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith("ssf-") && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

const isAsset = (url) => url.includes("/_next/static/");

async function store(request, response) {
  if (!response.ok) return;
  const cache = await caches.open(CACHE);
  await cache.put(request, response);
  const keys = await cache.keys();
  const trim = (list, max) => Promise.all(list.slice(0, Math.max(0, list.length - max)).map((r) => cache.delete(r)));
  await trim(keys.filter((r) => isAsset(r.url)), MAX_ASSETS);
  await trim(keys.filter((r) => !isAsset(r.url)), MAX_PAGES);
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  // Vídeos, Sefaria, Kotel e outros sites seguem sem interferência.
  if (request.method !== "GET" || url.origin !== location.origin || !url.pathname.startsWith(BASE)) return;

  // Pré-carregamentos do Next não são páginas: sem rede, ele recarrega a página inteira.
  if (url.searchParams.has("_rsc") || url.pathname.endsWith(".txt")) return;

  if (isAsset(url.pathname)) {
    // Arquivos com hash no nome nunca mudam.
    event.respondWith(
      caches.match(request).then((hit) => hit ?? fetch(request).then((res) => {
        event.waitUntil(store(request, res.clone()));
        return res;
      })),
    );
    return;
  }
  event.respondWith(
    fetch(request)
      .then((res) => {
        event.waitUntil(store(request, res.clone()));
        return res;
      })
      .catch(async () => {
        const hit = await caches.match(request, { ignoreSearch: request.mode === "navigate" });
        if (hit) return hit;
        return (request.mode === "navigate" && (await caches.match(BASE))) || Response.error();
      }),
  );
});
