/* ==========================================================
   RASPADINHA DA AMIZADE
   Firebase Service
========================================================== */

import { getDB } from "./firebase.js";

import {

    ref,

    child,

    get,

    push,

    set,

    runTransaction,

    serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

const db = getDB();

/* ==========================================================
   PARTICIPANTE
========================================================== */

export async function buscarParticipante(cpf){

    const snap = await get(

        child(ref(db),"participantes/" + cpf)

    );

    return snap.exists() ? snap.val() : null;

}

/* ==========================================================
   VERIFICAR TENTATIVA
========================================================== */

export async function jaJogou(cpf){

    const snap = await get(

       ref(db, `participantes/${cpf}`)

    );

    return snap.exists();

}

/* ==========================================================
   REGISTRAR TENTATIVA
========================================================== */

export async function registrarTentativa(participante){

 await set(novo, {
    nome: participante.nome,
    cpf: participante.cpf,
    telefone: participante.telefone,

    premio: premio.nome,
    premioId: premioId,

    data: serverTimestamp()
});

    );

}

/* ==========================================================
   LISTAR PRÊMIOS
========================================================== */

export async function carregarPremios(){

    const snap = await get(

        ref(db,"premios")

    );

    if(!snap.exists()) return {};

    return snap.val();

}

/* ==========================================================
   SALVAR VENCEDOR
========================================================== */

export async function salvarVencedor(participante,premio){

    const novo = push(

        ref(db,"vencedores")

    );

    await set(novo,{

        nome:participante.nome,

        cpf:participante.cpf,

        telefone:participante.telefone,

        premio:premio.nome,

        data:serverTimestamp()

    });

}

/* ==========================================================
   LOG
========================================================== */

export async function registrarLog(texto){

    const novo = push(

        ref(db,"logs")

    );

    await set(novo,{

        mensagem:texto,

        data:serverTimestamp()

    });

}

/* ==========================================================
   SORTEIO TRANSACIONAL
========================================================== */

export async function realizarSorteio(participante){

    const premiosRef = ref(db,"premios");

    const resultado = await runTransaction(

        premiosRef,

        (premios)=>{

            if(!premios) return premios;

            const disponiveis =

                Object.entries(premios)

                .filter(

                    ([id,p])=>p.quantidade>0

                );

            if(disponiveis.length===0){

                return premios;

            }

            const indice =

                Math.floor(

                    Math.random()*disponiveis.length

                );

            const [idPremio] =

                disponiveis[indice];

            premios[idPremio].quantidade--;

            premios.__resultado=idPremio;

            return premios;

        }

    );

    if(!resultado.committed){

        return{

            ganhou:false

        };

    }

    const dados = resultado.snapshot.val();

    const premioId = dados.__resultado;

    delete dados.__resultado;

    if(!premioId){

        await registrarTentativa(participante);

        return{

            ganhou:false

        };

    }

    const premio = dados[premioId];

    await salvarVencedor(

        participante,

        premio

    );

    return{

        ganhou:true,

        premio

    };

}
