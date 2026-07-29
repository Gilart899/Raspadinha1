/* ==========================================================
   RASPADINHA DA AMIZADE
   APP PRINCIPAL
========================================================== */

import { abrirModalParticipante } from "./modal-premio.js";

import { iniciarRaspadinha } from "./raspadinha.js";

import { tocarSom } from "./sounds.js";

import { iniciarEfeitos } from "./effects.js";

/* ==========================================================
   ELEMENTOS
========================================================== */

const btnParticipar = document.getElementById("btnParticipar");

const modal = document.getElementById("modal");

const btnFechar = document.getElementById("fechar");

const loading = document.getElementById("loading");

/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

document.addEventListener("DOMContentLoaded", iniciarApp);

function iniciarApp(){

    esconderLoading();

    iniciarEfeitos();

    configurarEventos();

}

/* ==========================================================
   EVENTOS
========================================================== */

function configurarEventos(){

    btnParticipar.addEventListener(

        "click",

        iniciarFluxo

    );

    btnFechar.addEventListener(

        "click",

        fecharModal

    );

}

/* ==========================================================
   FLUXO
========================================================== */

async function iniciarFluxo(){

    tocarSom("abertura");

    const participante = await abrirModalParticipante();

    if(!participante){

        return;

    }

    abrirModal();

    iniciarRaspadinha(participante);

}

/* ==========================================================
   MODAL
========================================================== */

function abrirModal(){

    modal.classList.remove("hidden");

}

function fecharModal(){

    tocarSom("retorna");

    modal.classList.add("hidden");

}

/* ==========================================================
   LOADING
========================================================== */

function esconderLoading(){

    loading.style.display="none";

}

/* ==========================================================
   EXPORTAÇÃO
========================================================== */

export {

    abrirModal,

    fecharModal

};
