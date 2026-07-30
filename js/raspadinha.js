/* ==========================================================
   RASPADINHA DA AMIZADE
   Gerenciador de Prêmios
========================================================== */

import { getDB } from "./firebase.js";

import {

    ref,

    onValue

} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

/* ==========================================================
   ELEMENTOS
========================================================== */

const imgFerro =
    document.querySelector(".card:first-child img");

const imgLiquidificador =
    document.querySelector(".card:last-child img");

const tituloFerro =
    document.querySelector(".card:first-child h2");

const tituloLiquidificador =
    document.querySelector(".card:last-child h2");

/* ==========================================================
   DADOS
========================================================== */

let premios = {};

/* ==========================================================
   CARREGAR PRÊMIOS
========================================================== */

export function carregarPremios() {

    const db = getDB();

    const premiosRef = ref(db, "premios");

    onValue(premiosRef, (snapshot) => {

        premios = snapshot.val() || {};

        atualizarTela();

    });

}

/* ==========================================================
   ATUALIZAR TELA
========================================================== */

function atualizarTela() {

    if (premios.ferro) {

        tituloFerro.textContent =
            premios.ferro.nome;

        imgFerro.src =
            premios.ferro.imagem;

    }

    if (premios.liquidificador) {

        tituloLiquidificador.textContent =
            premios.liquidificador.nome;

        imgLiquidificador.src =
            premios.liquidificador.imagem;

    }

}

/* ==========================================================
   ESTOQUE DOS PRÊMIOS
========================================================== */

function atualizarEstoque() {

    atualizarCard(
        document.querySelector(".card:first-child"),
        premios.ferro
    );

    atualizarCard(
        document.querySelector(".card:last-child"),
        premios.liquidificador
    );

}

function atualizarCard(card, premio) {

    if (!card || !premio) return;

    if (premio.quantidade <= 0) {

        card.classList.add("esgotado");

        const titulo = card.querySelector("h2");

        if (titulo) {

            titulo.textContent = "ESGOTADO";

        }

    } else {

        card.classList.remove("esgotado");

    }

}

/* ==========================================================
   CONSULTAS
========================================================== */

export function obterPremio(id) {

    return premios[id] || null;

}

export function temPremiosDisponiveis() {

    return Object.values(premios)

        .some(premio => premio.quantidade > 0);

}

/* ==========================================================
   LISTA
========================================================== */

export function listarPremios() {

    return premios;

}

/* ==========================================================
   ATUALIZAÇÃO
========================================================== */

function atualizarTela() {

    if (premios.ferro) {

        tituloFerro.textContent =
            premios.ferro.nome;

        imgFerro.src =
            premios.ferro.imagem;

    }

    if (premios.liquidificador) {

        tituloLiquidificador.textContent =
            premios.liquidificador.nome;

        imgLiquidificador.src =
            premios.liquidificador.imagem;

    }

    atualizarEstoque();

}

/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

carregarPremios();
