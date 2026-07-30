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
    serverTimestamp,
    runTransaction

} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";


const db = getDB();


/* ==========================================================
   BUSCAR PARTICIPANTE
========================================================== */

export async function buscarParticipante(cpf){

    const participanteRef = ref(
        db,
        `participantes/${cpf}`
    );


    const snap = await get(participanteRef);


    if(!snap.exists()){

        return null;

    }


    return snap.val();

}



/* ==========================================================
   VERIFICAR SE JÁ RASPOU
========================================================== */

export async function jaJogou(cpf){


    const tentativaRef = ref(
        db,
        `raspadinhas/${cpf}`
    );


    const snap = await get(tentativaRef);


    return snap.exists();


}



/* ==========================================================
   REGISTRAR TENTATIVA
========================================================== */

export async function registrarTentativa(
    participante,
    resultado = {}
){


    const tentativaRef = push(

        ref(db,"raspadinhas")

    );


    await set(
        tentativaRef,
        {

            nome:
                participante.nome || "",


            cpf:
                participante.cpf || "",


            telefone:
                participante.telefone || "",


            ganhou:
                resultado.ganhou || false,


            premio:
                resultado.premio?.nome || null,


            premioId:
                resultado.premioId || null,


            data:
                serverTimestamp()

        }

    );


    return tentativaRef.key;


}

/* ==========================================================
   LISTAR PRÊMIOS
========================================================== */

export async function carregarPremios(){


    const premiosSnap = await get(

        ref(db,"premios")

    );


    if(!premiosSnap.exists()){

        return {};

    }


    return premiosSnap.val();


}



/* ==========================================================
   SORTEIO CONTROLADO
========================================================== */

export async function realizarSorteio(){


    const premiosRef = ref(

        db,
        "premios"

    );


    let premioSorteado = null;


    const resultado = await runTransaction(

        premiosRef,


        (premios)=>{


            if(!premios){

                return premios;

            }



            const disponiveis = Object.entries(premios)

                .filter(

                    ([,premio])=>{

                        return (

                            premio.quantidade > 0

                        );

                    }

                );



            if(disponiveis.length === 0){


                return premios;


            }



            const indice = Math.floor(

                Math.random() *

                disponiveis.length

            );



            const [idPremio,premio] =

                disponiveis[indice];



            premio.quantidade--;



            premioSorteado = {

                id:idPremio,

                ...premio

            };



            return premios;


        }

    );



    if(!resultado.committed){


        return {

            ganhou:false,

            premio:null

        };


    }



    if(!premioSorteado){


        return {

            ganhou:false,

            premio:null

        };


    }



    return {


        ganhou:true,


        premioId:

            premioSorteado.id,


        premio:

            premioSorteado



    };


}

/* ==========================================================
   SALVAR VENCEDOR
========================================================== */

export async function salvarVencedor(
    participante,
    premio,
    premioId
){


    const vencedorRef = push(

        ref(db,"vencedores")

    );



    await set(

        vencedorRef,

        {

            nome:
                participante.nome || "",


            cpf:
                participante.cpf || "",


            telefone:
                participante.telefone || "",


            premio:
                premio.nome || "",


            premioId:
                premioId,


            data:
                serverTimestamp()

        }

    );


    return vencedorRef.key;


}



/* ==========================================================
   REGISTRAR LOG
========================================================== */

export async function registrarLog(
    mensagem
){


    const logRef = push(

        ref(db,"logs")

    );



    await set(

        logRef,

        {

            mensagem,


            data:
                serverTimestamp()

        }

    );


}



/* ==========================================================
   PROCESSO COMPLETO DA RASPADINHA
========================================================== */

export async function processarRaspadinha(
    participante
){


    try{


        /*
            1 - Verifica se já participou
        */

        const jaParticipou = await jaJogou(

            participante.cpf

        );



        if(jaParticipou){


            return {

                sucesso:false,

                mensagem:
                    "Este participante já raspou."

            };


        }



        /*
            2 - Executa sorteio
        */


        const resultado = await realizarSorteio();



        /*
            3 - Salva tentativa
        */


        await registrarTentativa(

            participante,

            resultado

        );



        /*
            4 - Caso ganhou
        */


        if(resultado.ganhou){



            await salvarVencedor(

                participante,

                resultado.premio,

                resultado.premioId

            );



            await registrarLog(

                `Vencedor: ${participante.nome} - ${resultado.premio.nome}`

            );



            return {


                sucesso:true,


                ganhou:true,


                premio:

                    resultado.premio



            };


        }



        /*
            5 - Caso não ganhou
        */


        await registrarLog(

            `Participante ${participante.nome} não ganhou.`

        );



        return {


            sucesso:true,


            ganhou:false,


            premio:null



        };



    }catch(erro){



        console.error(

            "Erro na raspadinha:",

            erro

        );



        return {


            sucesso:false,


            mensagem:

                "Erro ao processar raspadinha."



        };


    }


}
