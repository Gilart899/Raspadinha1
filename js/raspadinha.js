/* ==========================================================
   RASPADINHA DA AMIZADE
   raspadinha.js
   Versão compatível Firebase
========================================================== */


/* ==========================================================
   FIREBASE
========================================================== */

import {

    processarRaspadinha

} from "./firebase-raspadinha.js";



/* ==========================================================
   MODAL
========================================================== */

import {

    abrirModalPremio

} from "./modal-premio.js";



/* ==========================================================
   SONS
========================================================== */

import {

    tocarSom,
    pararSom,
    somAbertura,
    somVitoria,
    somDerrota

} from "./sounds.js";



/* ==========================================================
   EFEITOS
========================================================== */

import {

    efeitoVitoria,
    efeitoDerrota

} from "./effects.js";



/* ==========================================================
   ELEMENTOS
========================================================== */

const btnParticipar =

    document.getElementById(
        "btnParticipar"
    );


const modal =

    document.getElementById(
        "modal"
    );


const btnFechar =

    document.getElementById(
        "fechar"
    );


const canvas =

    document.getElementById(
        "canvas"
    );


const ctx =

    canvas.getContext(
        "2d",
        {
            willReadFrequently:true
        }
    );


const imagemPremio =

    document.getElementById(
        "imagemPremio"
    );


const textoPremio =

    document.getElementById(
        "textoPremio"
    );



/* ==========================================================
   CONFIGURAÇÃO CANVAS
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

let participanteAtual = null;

let processando = false;



/* ==========================================================
   EVENTOS INICIAIS
========================================================== */

if(btnParticipar){

    btnParticipar.addEventListener(

        "click",

        abrirRaspadinha

    );

}


if(btnFechar){

    btnFechar.addEventListener(

        "click",

        fecharRaspadinha

    );

}

/* ==========================================================
   ABRIR RASPADINHA
========================================================== */

async function abrirRaspadinha(){


    if(processando){

        return;

    }


    processando = true;



    try{


        /*
            Aqui vamos buscar os dados
            do participante.

            Por enquanto estamos usando
            o formulário da página.

            O HTML precisa ter:

            input id="cpf"

        */


        const campoCPF =

            document.getElementById(
                "cpf"
            );



        if(!campoCPF){


            console.error(

                "Campo CPF não encontrado."

            );


            return;


        }



        const cpf =

            campoCPF.value

            .replace(/\D/g,"");



        if(!cpf){


            alert(

                "Digite seu CPF."

            );


            return;


        }



        const campoNome =

            document.getElementById(
                "nome"
            );



        const campoTelefone =

            document.getElementById(
                "telefone"
            );



        participanteAtual = {


            cpf,


            nome:

                campoNome ?

                campoNome.value :

                "",



            telefone:

                campoTelefone ?

                campoTelefone.value :

                ""



        };




        /*
            Executa Firebase

            Aqui:

            - verifica se já raspou
            - sorteia
            - salva tentativa
            - salva vencedor

        */


        resultado =

            await processarRaspadinha(

                participanteAtual

            );



        if(!resultado.sucesso){


            alert(

                resultado.mensagem

            );


            return;


        }



        modal.classList.remove(
            "hidden"
        );



        somAbertura();



        prepararCanvas();



    }catch(erro){


        console.error(

            "Erro ao iniciar raspadinha:",

            erro

        );


        alert(

            "Erro ao iniciar raspadinha."

        );


    }finally{


        processando = false;


    }



}



/* ==========================================================
   FECHAR RASPADINHA
========================================================== */

function fecharRaspadinha(){



    pararSom(
        "raspar"
    );



    if(modal){


        modal.classList.add(
            "hidden"
        );


    }



    limparCanvas();



}

/* ==========================================================
   PREPARAR CANVAS
========================================================== */

function prepararCanvas(){


    canvas.width = LARGURA;

    canvas.height = ALTURA;



    ctx.clearRect(

        0,

        0,

        LARGURA,

        ALTURA

    );



    ctx.globalCompositeOperation =

        "source-over";



    /*
        Fundo da camada raspável
    */


    ctx.fillStyle = "#A8A8A8";


    ctx.fillRect(

        0,

        0,

        LARGURA,

        ALTURA

    );



    ctx.fillStyle = "#555";


    ctx.font =

        "bold 26px Arial";



    ctx.textAlign =

        "center";



    ctx.fillText(

        "RASPE AQUI",

        LARGURA / 2,

        ALTURA / 2

    );



    configurarEventos();


}



/* ==========================================================
   CONFIGURAR EVENTOS
========================================================== */

function configurarEventos(){



    canvas.onmousedown =

        iniciarMouse;



    canvas.onmousemove =

        moverMouse;



    window.onmouseup =

        pararRaspagem;




    canvas.ontouchstart =

        iniciarTouch;



    canvas.ontouchmove =

        moverTouch;



    canvas.ontouchend =

        pararRaspagem;



}



/* ==========================================================
   MOUSE
========================================================== */

function iniciarMouse(e){


    if(revelado){

        return;

    }



    raspando = true;



    tocarSom(
        "raspar"
    );



    raspar(

        e.offsetX,

        e.offsetY

    );



}



function moverMouse(e){



    if(!raspando){

        return;

    }



    raspar(

        e.offsetX,

        e.offsetY

    );


}



/* ==========================================================
   TOUCH
========================================================== */

function iniciarTouch(e){


    e.preventDefault();



    if(revelado){

        return;

    }



    raspando = true;



    tocarSom(
        "raspar"
    );



    const posicao =

        obterPosicaoTouch(e);



    raspar(

        posicao.x,

        posicao.y

    );


}



function moverTouch(e){


    e.preventDefault();



    if(!raspando){

        return;

    }



    const posicao =

        obterPosicaoTouch(e);



    raspar(

        posicao.x,

        posicao.y

    );


}



function obterPosicaoTouch(e){



    const rect =

        canvas.getBoundingClientRect();



    return {


        x:

        e.touches[0].clientX

        - rect.left,



        y:

        e.touches[0].clientY

        - rect.top



    };


}



/* ==========================================================
   PARAR RASPAGEM
========================================================== */

function pararRaspagem(){



    raspando = false;



    pararSom(

        "raspar"

    );


}



/* ==========================================================
   EXECUTAR RASPAGEM
========================================================== */

function raspar(x,y){



    if(revelado){

        return;

    }



    ctx.globalCompositeOperation =

        "destination-out";



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
   VERIFICAR ÁREA REVELADA
========================================================== */

function verificarPorcentagem(){



    const pixels =

        ctx.getImageData(

            0,

            0,

            LARGURA,

            ALTURA

        ).data;



    let transparentes = 0;



    for(

        let i = 3;

        i < pixels.length;

        i += 4

    ){


        if(pixels[i] === 0){


            transparentes++;


        }


    }



    const porcentagem =


        (

            transparentes /

            (LARGURA * ALTURA)

        )

        * 100;



    if(

        porcentagem >= PORCENTAGEM_REVELAR

        &&

        !revelado

    ){


        revelado = true;


        revelarResultado();


    }



}

/* ==========================================================
   REVELAR RESULTADO
========================================================== */

function revelarResultado(){


    if(!resultado){


        mostrarDerrota();


        return;


    }



    if(resultado.ganhou){


        mostrarVitoria(

            resultado.premio

        );


    }else{


        mostrarDerrota();


    }



}



/* ==========================================================
   VITÓRIA
========================================================== */

function mostrarVitoria(premio){



    imagemPremio.style.display =

        "block";



    imagemPremio.src =

        premio.imagem ||

        "./img/premio.png";



    imagemPremio.alt =

        premio.nome;



    textoPremio.textContent =

        premio.nome;



    somVitoria();



    efeitoVitoria();



    setTimeout(()=>{



        abrirModalPremio({



            premio:

                premio.nome,



            imagem:

                premio.imagem



        });



    },1200);



}



/* ==========================================================
   DERROTA
========================================================== */

function mostrarDerrota(){



    imagemPremio.style.display =

        "block";



    imagemPremio.src =

        "./img/perdeu.png";



    imagemPremio.alt =

        "Não foi desta vez";



    textoPremio.textContent =

        "Não foi desta vez!";



    somDerrota();



    efeitoDerrota();



}



/* ==========================================================
   LIMPAR CANVAS
========================================================== */

function limparCanvas(){



    if(!ctx){

        return;

    }



    ctx.clearRect(

        0,

        0,

        LARGURA,

        ALTURA

    );



    imagemPremio.removeAttribute(

        "src"

    );



    imagemPremio.style.display =

        "none";



    textoPremio.textContent = "";



    revelado = false;



    raspando = false;



    resultado = null;



    participanteAtual = null;



}



/* ==========================================================
   RESET MANUAL
========================================================== */

export function resetarRaspadinha(){



    pararSom(

        "raspar"

    );



    limparCanvas();



    prepararCanvas();



}



/* ==========================================================
   TECLA ESC FECHA
========================================================== */

window.addEventListener(

    "keydown",

    (evento)=>{



        if(evento.key === "Escape"){


            fecharRaspadinha();


        }



    }

);



/* ==========================================================
   EXPORTAÇÕES
========================================================== */

export {

    abrirRaspadinha,

    fecharRaspadinha

};
