/* ==========================================================
   RASPADINHA DA AMIZADE
   Modal do Ganhador
========================================================== */

import {

    salvarVencedor

} from "./firebase-raspadinha.js";

import {

    tocarSom

} from "./sounds.js";

/* ==========================================================
   ELEMENTOS
========================================================== */

const modal = document.getElementById("modalParticipante");

const imgPremio = document.getElementById("imgPremio");

const txtPremio = document.getElementById("nomePremio");

const txtMensagem = document.getElementById("mensagemPremio");

const btnSalvar = document.getElementById("btnSalvar");

const btnCancelar = document.getElementById("btnCancelar");

const nome = document.getElementById("nome");

const cpf = document.getElementById("cpf");

const telefone = document.getElementById("telefone");

let premioAtual = null;

/* ==========================================================
   ABRIR
========================================================== */

export function abrirModalPremio(premio){

    premioAtual = premio;

    imgPremio.src = premio.imagem;

    txtPremio.textContent = premio.nome;

    txtMensagem.textContent =

        "Parabéns! Você foi contemplado.";

    nome.value = "";

    cpf.value = "";

    telefone.value = "";

    modal.classList.remove("hidden");

    tocarSom("aplausos");

}

/* ==========================================================
   FECHAR
========================================================== */

export function fecharModalPremio(){

    modal.classList.add("hidden");

}

/* ==========================================================
   SALVAR
========================================================== */

btnSalvar.addEventListener(

    "click",

    async ()=>{

        if(

            nome.value.trim()==="" ||

            cpf.value.trim()==="" ||

            telefone.value.trim()===""

        ){

            alert("Preencha todos os campos.");

            return;

        }

        await salvarVencedor(

            {

                nome:nome.value,

                cpf:cpf.value,

                telefone:telefone.value

            },

            premioAtual

        );

        tocarSom("notificacoes");

        alert("Dados enviados com sucesso!");

        fecharModalPremio();

    }

);

/* ==========================================================
   CANCELAR
========================================================== */

btnCancelar.addEventListener(

    "click",

    ()=>{

        fecharModalPremio();

    }

);
