
/* ==========================================================
   RASPADINHA DA AMIZADE
   raspadinha.js
========================================================== */

import { realizarSorteio } from "./firebase-raspadinha.js";
import { abrirModalPremio } from "./modal-premio.js";

import {
    tocarSom,
    pararSom,
    somAbertura,
    somVitoria,
    somDerrota
} from "./sounds.js";

import {
    efeitoVitoria,
    efeitoDerrota
} from "./effects.js";

/* ==========================================================
   ELEMENTOS
========================================================== */

const btnParticipar = document.getElementById("btnParticipar");

const modal = document.getElementById("modal");

const btnFechar = document.getElementById("fechar");

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d", {

    willReadFrequently: true

});

const imagemPremio =
    document.getElementById("imagemPremio");

const textoPremio =
    document.getElementById("textoPremio");

/* ==========================================================
   CONFIGURAÇÃO
========================================================== */

const LARGURA = 320;

const ALTURA = 320;

const RAIO = 22;

const PORCENTAGEM_REVELAR = 60;

/* ==========================================================
   ESTADO
========================================================== */

let raspando = false;

let revelado = false;

let resultado = null;

/* ==========================================================
   INICIAR
========================================================== */

btnParticipar.addEventListener(

    "click",

    abrirRaspadinha

);

btnFechar.addEventListener(

    "click",

    fecharRaspadinha

);

/* ==========================================================
   ABRIR
========================================================== */

async function abrirRaspadinha() {

    modal.classList.remove("hidden");

    somAbertura();

    prepararCanvas();

    resultado = await realizarSorteio();

}

/* ==========================================================
   FECHAR
========================================================== */

function fecharRaspadinha() {

    pararSom("raspar");

    modal.classList.add("hidden");

    limparCanvas();

}

/* ==========================================================
   PREPARAR CANVAS
========================================================== */

function prepararCanvas() {

    canvas.width = LARGURA;

    canvas.height = ALTURA;

    ctx.clearRect(

        0,

        0,

        LARGURA,

        ALTURA

    );

    ctx.globalCompositeOperation = "source-over";

    ctx.fillStyle = "#A8A8A8";

    ctx.fillRect(

        0,

        0,

        LARGURA,

        ALTURA

    );

    ctx.fillStyle = "#555";

    ctx.font = "bold 26px Arial";

    ctx.textAlign = "center";

    ctx.fillText(

        "RASPE AQUI",

        LARGURA / 2,

        ALTURA / 2

    );

    revelarPremio();

    configurarEventos();

}

/* ==========================================================
   EVENTOS
========================================================== */

function configurarEventos() {

    canvas.onmousedown = iniciarMouse;
    canvas.onmousemove = moverMouse;
    window.onmouseup = pararRaspagem;

    canvas.ontouchstart = iniciarTouch;
    canvas.ontouchmove = moverTouch;
    canvas.ontouchend = pararRaspagem;

}

/* ==========================================================
   MOUSE
========================================================== */

function iniciarMouse(e) {

    raspando = true;

    tocarSom("raspar");

    raspar(e.offsetX, e.offsetY);

}

function moverMouse(e) {

    if (!raspando) return;

    raspar(e.offsetX, e.offsetY);

}

/* ==========================================================
   TOUCH
========================================================== */

function iniciarTouch(e) {

    e.preventDefault();

    raspando = true;

    tocarSom("raspar");

    const p = obterPosicaoTouch(e);

    raspar(p.x, p.y);

}

function moverTouch(e) {

    e.preventDefault();

    if (!raspando) return;

    const p = obterPosicaoTouch(e);

    raspar(p.x, p.y);

}

function obterPosicaoTouch(e) {

    const rect = canvas.getBoundingClientRect();

    return {

        x: e.touches[0].clientX - rect.left,

        y: e.touches[0].clientY - rect.top

    };

}

/* ==========================================================
   PARAR
========================================================== */

function pararRaspagem() {

    raspando = false;

    pararSom("raspar");

}

/* ==========================================================
   RASPAR
========================================================== */

function raspar(x, y) {

    if (revelado) return;

    ctx.globalCompositeOperation = "destination-out";

    ctx.beginPath();

    ctx.arc(

        x,

        y,

        RAIO,

        0,

        Math.PI * 2

    );

    ctx.fill();

    verificarPorcentagem();

}

/* ==========================================================
   VERIFICAR PORCENTAGEM
========================================================== */

function verificarPorcentagem() {

    const pixels = ctx.getImageData(

        0,

        0,

        LARGURA,

        ALTURA

    ).data;

    let transparentes = 0;

    for (let i = 3; i < pixels.length; i += 4) {

        if (pixels[i] === 0) {

            transparentes++;

        }

    }

    const porcentagem =

        (transparentes / (LARGURA * ALTURA)) * 100;

    if (

        porcentagem >= PORCENTAGEM_REVELAR &&

        !revelado

    ) {

        revelado = true;

        revelarResultado();

    }

}

/* ==========================================================
   REVELAR PRÊMIO
========================================================== */

function revelarPremio() {

    imagemPremio.style.display = "none";

    textoPremio.textContent = "";

}

/* ==========================================================
   RESULTADO
========================================================== */

function revelarResultado() {

    if (!resultado) {

        mostrarDerrota();

        return;

    }

    if (resultado.ganhou) {

        mostrarVitoria(resultado);

    } else {

        mostrarDerrota();

    }

}

/* ==========================================================
   VITÓRIA
========================================================== */

function mostrarVitoria(premio) {

    imagemPremio.style.display = "block";

    imagemPremio.src = premio.imagem;

    imagemPremio.alt = premio.nome;

    textoPremio.textContent = premio.nome;

    somVitoria();

    efeitoVitoria();

    setTimeout(() => {

        abrirModalPremio({

            premio: premio.nome,

            imagem: premio.imagem

        });

    }, 1200);

}

/* ==========================================================
   DERROTA
========================================================== */

function mostrarDerrota() {

    imagemPremio.style.display = "block";

    imagemPremio.src = "./img/perdeu.png";

    imagemPremio.alt = "Não foi desta vez";

    textoPremio.textContent = "Não foi desta vez!";

    somDerrota();

    efeitoDerrota();

}

/* ==========================================================
   LIMPAR CANVAS
========================================================== */

function limparCanvas() {

    ctx.clearRect(

        0,

        0,

        LARGURA,

        ALTURA

    );

    imagemPremio.removeAttribute("src");

    imagemPremio.style.display = "none";

    textoPremio.textContent = "";

    revelado = false;

    raspando = false;

    resultado = null;

}

/* ==========================================================
   RESET
========================================================== */

export function resetarRaspadinha() {

    pararSom("raspar");

    raspando = false;

    revelado = false;

    resultado = null;

    imagemPremio.src = "";

    imagemPremio.style.display = "none";

    textoPremio.textContent = "";

    prepararCanvas();

}

/* ==========================================================
   FECHAR AUTOMÁTICO
========================================================== */

window.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        fecharRaspadinha();

    }

});

/* ==========================================================
   REINICIAR
========================================================== */

btnFechar.addEventListener("click", () => {

    fecharRaspadinha();

    setTimeout(() => {

        resetarRaspadinha();

    }, 300);

});

/* ==========================================================
   BLOQUEAR DUPLO CLIQUE
========================================================== */

let processando = false;

export async function iniciarNovaRaspagem() {

    if (processando) return;

    processando = true;

    try {

        await abrirRaspadinha();

    } finally {

        processando = false;

    }

}

/* ==========================================================
   EXPORTAÇÕES
========================================================== */

export {

    abrirRaspadinha,

    fecharRaspadinha

};
