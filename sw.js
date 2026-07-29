/* =====================================================
   RASPADINHA PREMIADA
   Service Worker
   Versão 1.0.0
===================================================== */

const CACHE_NAME = "raspadinha-v1.0.0";

const ARQUIVOS = [

    "./",

    "./index.html",

    "./manifest.json",

    "./css/style.css",
    "./css/animations.css",

    "./js/app.js",
    "./js/config.js",
    "./js/firebase.js",
    "./js/firebase-raspadinha.js",
    "./js/participantes.js",
    "./js/premios.js",
    "./js/modal-premio.js",
    "./js/raspadinha.js",
    "./js/sorteio.js",
    "./js/effects.js",
    "./js/sounds.js",
    "./js/utils.js",

    "./img/logo.png",
    "./img/ferro.png",
    "./img/liquidificador.png",
    "./img/trevo.png",
    "./img/perdeu.png",

    "./sounds/click.mp3",
    "./sounds/raspar.mp3",
    "./sounds/vitoria.mp3",
    "./sounds/perdeu.mp3",

    "./icons/favicon.png",
    "./icons/icon-192.png",
    "./icons/icon-512.png"

];

/* =====================================================
   INSTALAÇÃO
===================================================== */

self.addEventListener("install", event => {

    console.log("Service Worker instalado.");

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(cache => cache.addAll(ARQUIVOS))

    );

    self.skipWaiting();

});

/* =====================================================
   ATIVAÇÃO
===================================================== */

self.addEventListener("activate", event => {

    console.log("Service Worker ativado.");

    event.waitUntil(

        caches.keys()

            .then(keys =>

                Promise.all(

                    keys.map(key => {

                        if (key !== CACHE_NAME) {

                            return caches.delete(key);

                        }

                    })

                )

            )

    );

    self.clients.claim();

});

/* =====================================================
   FETCH
===================================================== */

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    event.respondWith(

        caches.match(event.request)

            .then(cache => {

                if (cache) {

                    return cache;

                }

                return fetch(event.request)

                    .then(response => {

                        const copia = response.clone();

                        caches.open(CACHE_NAME)

                            .then(cache => {

                                cache.put(event.request, copia);

                            });

                        return response;

                    });

            })

            .catch(() => {

                return caches.match("./index.html");

            })

    );

});

/* =====================================================
   MENSAGENS
===================================================== */

self.addEventListener("message", event => {

    if (event.data === "SKIP_WAITING") {

        self.skipWaiting();

    }

});
