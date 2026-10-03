// Carnation service worker: offline cache + Android "Share" target.
const VERSION = "carnation-v2";
const SHARE_CACHE = "carnation-share";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./lib/vision_bundle.mjs",
  "./lib/wasm/vision_wasm_internal.js",
  "./lib/wasm/vision_wasm_internal.wasm",
  "./models/selfie_multiclass.part0.b64.txt",
  "./models/selfie_multiclass.part1.b64.txt",
  "./samples/green.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== SHARE_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Image shared from another app: keep it, then open the page that will pick it up.
  if (event.request.method === "POST" && url.pathname.endsWith("/share-target")) {
    event.respondWith((async () => {
      const form = await event.request.formData();
      const file = form.get("image");
      if (file) {
        const cache = await caches.open(SHARE_CACHE);
        await cache.put("shared-image", new Response(file, { headers: { "Content-Type": file.type || "image/jpeg" } }));
      }
      return Response.redirect(new URL("./?shared=1", self.registration.scope).href, 303);
    })());
    return;
  }

  if (event.request.method !== "GET" || url.origin !== location.origin) return;
  // The page itself: network first so updates arrive, cached copy when offline.
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }
  // Library, model, icons: cache first (large files that rarely change).
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((hit) => hit || fetch(event.request))
  );
});
