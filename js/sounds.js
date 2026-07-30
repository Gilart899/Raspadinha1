/* ==========================================================
   RASPADINHA DA AMIZADE
   Controle de Sons
========================================================== */

const sons = {

    abertura: new Audio("./sounds/abertura.mp3"),

    raspar: new Audio("./sounds/raspar.mp3"),

    aplausos: new Audio("./sounds/aplausos.mp3"),

    alarme: new Audio("./sounds/alarme.mp3"),

    notificacoes: new Audio("./sounds/notificacoes.mp3"),

    retorna: new Audio("./sounds/retorna.mp3")

};

/* ==========================================================
   CONFIGURAÇÃO
========================================================== */

Object.values(sons).forEach(audio => {

    audio.preload = "auto";

    audio.volume = 1;

});

/* Loop da raspagem */

sons.raspar.loop = true;

/* ==========================================================
   TOCAR SOM
========================================================== */

export function tocarSom(nome) {

    const audio = sons[nome];

    if (!audio) return;

    audio.currentTime = 0;

    audio.play().catch(() => {});

}

/* ==========================================================
   PARAR SOM
========================================================== */

export function pararSom(nome) {

    const audio = sons[nome];

    if (!audio) return;

    audio.pause();

    audio.currentTime = 0;

}

/* ==========================================================
   VOLUME
========================================================== */

export function definirVolume(nome, volume) {

    const audio = sons[nome];

    if (!audio) return;

    audio.volume = Math.max(0, Math.min(1, volume));

}

/* ==========================================================
   PARAR TODOS
========================================================== */

export function pararTodos() {

    Object.values(sons).forEach(audio => {

        audio.pause();

        audio.currentTime = 0;

    });

}

/* ==========================================================
   SONS PRONTOS
========================================================== */

export function somAbertura() {

    tocarSom("abertura");

}

export function somVitoria() {

    tocarSom("aplausos");

}

export function somDerrota() {

    tocarSom("alarme");

}

export function somNotificacao() {

    tocarSom("notificacoes");

}

export function somFechar() {

    tocarSom("retorna");

}

/* ==========================================================
   MUTE
========================================================== */

let mutado = false;

export function ativarMute() {

    mutado = true;

    Object.values(sons).forEach(audio => {

        audio.muted = true;

    });

}

export function desativarMute() {

    mutado = false;

    Object.values(sons).forEach(audio => {

        audio.muted = false;

    });

}

export function estaMutado() {

    return mutado;

}
