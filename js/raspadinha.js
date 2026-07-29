/* ==========================================================
   RASPADINHA DA AMIZADE
   Canvas da Raspadinha
========================================================== */

import { realizarSorteio } from "./firebase-raspadinha.js";
import { abrirModalPremio } from "./modal-premio.js";
import { tocarSom, pararSom } from "./sounds.js";

/* ==========================================================
   ELEMENTOS
========================================================== */

const modal = document.getElementById("modal");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const imagemPremio = document.getElementById("imagemPremio");
const textoPremio = document.getElementById("textoPremio");

const btnFechar = document.getElementById("fechar");

/* ==========================================================
   VARIÁVEIS
========================================================== */

let largura = 320;
let altura = 320;

let raspando = false;
let resultado = null;
let revelado = false;

/* ==========================================================
   INICIAR
========================================================== */

export async function iniciarRaspadinha() {

    modal.classList.remove("hidden");

    canvas.width = largura;
    canvas.height = altura;

    desenharCamada();

    configurarEventos();

    revelado = false;

    resultado = await realizarSorteio();

}

/* ==========================================================
   CAMADA CINZA
========================================================== */

function desenharCamada() {

    ctx.globalCompositeOperation = "source-over";

    ctx.fillStyle = "#A9A9A9";

    ctx.fillRect(0, 0, largura, altura);

    ctx.fillStyle = "#666";

    ctx.font = "bold 28px Arial";

    ctx.textAlign = "center";

    ctx.fillText(

        "RASPE AQUI",

        largura / 2,

        altura / 2

    );

}

/* ==========================================================
   EVENTOS
========================================================== */

function configurarEventos() {

    canvas.addEventListener("mousedown", iniciar);

    canvas.addEventListener("mousemove", mover);

    window.addEventListener("mouseup", parar);

    canvas.addEventListener("touchstart", iniciarTouch);

    canvas.addEventListener("touchmove", moverTouch);

    window.addEventListener("touchend", parar);

}

/* ==========================================================
   MOUSE
========================================================== */

function iniciar(e) {

    raspando = true;

    tocarSom("raspar");

    raspar(e.offsetX, e.offsetY);

}

function mover(e) {

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

    const p = posicaoTouch(e);

    raspar(p.x, p.y);

}

function moverTouch(e) {

    e.preventDefault();

    if (!raspando) return;

    const p = posicaoTouch(e);

    raspar(p.x, p.y);

}

/* ==========================================================
   PARAR
========================================================== */

function parar() {

    raspando = false;

    pararSom("raspar");

}
