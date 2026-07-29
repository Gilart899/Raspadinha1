// ===========================================
// PRÊMIOS
// ===========================================

import {
    ler,
    atualizar
} from "./firebase-raspadinha.js";

let premios = {};

// ===========================================

export async function carregarPremios() {

    const dados = await ler("premios");

    premios = dados || {};

    return premios;

}

// ===========================================

export function obterPremios() {

    return premios;

}

// ===========================================

export function obterPremio(id) {

    return premios[id] || null;

}

// ===========================================

export function listarDisponiveis() {

    return Object.entries(premios)
        .filter(([_, premio]) => premio.quantidade > 0)
        .map(([id, premio]) => ({
            id,
            ...premio
        }));

}

// ===========================================

export async function diminuirEstoque(id) {

    if (!premios[id]) {
        throw new Error(`Prêmio '${id}' não encontrado.`);
    }

    if (premios[id].quantidade <= 0) {
        return false;
    }

    premios[id].quantidade--;

    await atualizar(`premios/${id}`, {
        quantidade: premios[id].quantidade
    });

    return true;

}

// ===========================================

export async function atualizarPremio(id, dados) {

    if (!premios[id]) {

        premios[id] = {};

    }

    premios[id] = {
        ...premios[id],
        ...dados
    };

    await atualizar(`premios/${id}`, dados);

}

// ===========================================

export function premioDisponivel(id) {

    return !!(
        premios[id] &&
        premios[id].quantidade > 0
    );

}
