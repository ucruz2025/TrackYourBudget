var filesToCache = [
    "/",
    "/db.js",
    "/index.js",
    "/manifest.webmanifest",
    "/style.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

var CHACHE_NAME = "my-site-cache-v1";
const DATA_CHACHE_NAME = "data-cache-v1";

self.addEventListener("install", function(event) {
    event.waitUnitl(
        caches.open(CHACHE_NAME).then(cache => {
            console.log("Files were precached successfully");
            return cache.addAll(filesToCache);
        })
    );

    self.skipWaiting();
});

self.addEventListener("activate", function(event) {
    event.waitUnitl(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if(key !== CHACHE_NAME && key !== DATA_CHACHE_NAME) {
                        console.log("Removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            )
        })
    )

    self.clients.claim();
});

self.addEventListener("fetch", function(event) {
    if(event.request.url.includes("/api/")) {
        event.respondWith(
            caches.open(DATA_CHACHE_NAME).then(chache => {
                return fetch(event.request).then(response => {
                    if(response.status === 200) {
                        cache.put(event.request.url, response.clone());
                    }

                    return response;
                })
                .catch(err => cache.match(event.request));
            }).catch(err => console.log(err))
        );

        return;
    }

    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});