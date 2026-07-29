// ===========================================
// PARTICIPANTES
// ===========================================

import {
    adicionar,
    buscar
} from "./firebase-raspadinha.js";

// ===========================================

let participanteAtual = null;

// ===========================================

export function iniciarParticipantes() {

    const botao = document.getElementById("btnParticipar");

    botao.addEventListener("click", abrirFormulario);

}

// ===========================================

async function abrirFormulario() {

    const nome = prompt("Nome completo:");

    if (!nome) return;

    const telefone = prompt("Telefone:");

    if (!telefone) return;

    const cpf = prompt("CPF:");

    if (!cpf) return;

    const participante = {

        nome: nome.trim(),

        telefone: telefone.trim(),

        cpf: cpf.trim(),

        dataCadastro: Date.now(),

        status: "pendente"

    };

    const valido = await validarParticipante(participante);

    if (!valido) return;

    participante.id = await adicionar(
        "participantes",
        participante
    );

    participanteAtual = participante;

    document.dispatchEvent(

        new CustomEvent("participante-pronto", {

            detail: participante

        })

    );

}

// ===========================================

async function validarParticipante(p) {

    const cpfExistente = await buscar(

        "participantes",

        "cpf",

        p.cpf

    );

    if (cpfExistente) {

        alert("CPF já cadastrado.");

        return false;

    }

    const telefoneExistente = await buscar(

        "participantes",

        "telefone",

        p.telefone

    );

    if (telefoneExistente) {

        alert("Telefone já cadastrado.");

        return false;

    }

    return true;

}

// ===========================================

export function obterParticipanteAtual() {

    return participanteAtual;

}
