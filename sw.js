/* ==========================================================
   RASPADINHA DA AMIZADE
   Service Worker
========================================================== */

const CACHE_NAME = "raspadinha-amizade-v1.0.0";

const FILES_TO_CACHE = [

    "./",

    "./index.html",

    "./manifest.json",

    "./css/style.css",
    "./css/animations.css",

    "./js/app.js",
    "./js/firebase.js",
    "./js/firebase-raspadinha.js",
    "./js/modal-premio.js",
    "./js/participantes.js",
    "./js/premios.js",
    "./js/raspadinha.js",
    "./js/sorteio.js",
    "./js/effects.js",
    "./js/sounds.js",
    "./js/utils.js",

    "./img/logo.png",
    "./img/ferro.png",
    "./img/liquidificador.png",

    "./icons/favicon.png",
    "./icons/icon-192.png",
    "./icons/icon-512.png",

    "./sounds/abertura.mp3",
    "./sounds/alarme.mp3",
    "./sounds/aplausos.mp3",
    "./sounds/notificacoes.mp3",
    "./sounds/raspar.mp3",
    "./sounds/retorna.mp3"

];

/* ==========================================================
   INSTALAÇÃO
========================================================== */

self.addEventListener("install", (event) => {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then((cache) => cache.addAll(FILES_TO_CACHE))

    );

    self.skipWaiting();

});

/* ==========================================================
   ATIVAÇÃO
========================================================== */

self.addEventListener("activate", (event) => {

    event.waitUntil(

        caches.keys().then((keys) => {

            return Promise.all(

                keys.map((key) => {

                    if (key !== CACHE_NAME) {

                        return caches.delete(key);

                    }

                })

            );

        })

    );

    self.clients.claim();

});

/* ==========================================================
   FETCH
========================================================== */

self.addEventListener("fetch", (event) => {

    if (event.request.method !== "GET") {

        return;

    }

    event.respondWith(

        caches.match(event.request)

            .then((response) => {

                if (response) {

                    return response;

                }

                return fetch(event.request)

                    .then((networkResponse) => {

                        const copia = networkResponse.clone();

                        caches.open(CACHE_NAME)

                            .then((cache) => {

                                cache.put(event.request, copia);

                            });

                        return networkResponse;

                    });

            })

            .catch(() => {

                return caches.match("./index.html");

            })

    );

});
