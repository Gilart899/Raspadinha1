/* ==========================================================
   RASPADINHA DA AMIZADE
   Efeitos Visuais
========================================================== */

const trevos = document.getElementById("trevos");
const confetes = document.getElementById("confetes");

/* ==========================================================
   TREVOS
========================================================== */

export function iniciarTrevos() {

    setInterval(criarTrevo, 800);

}

function criarTrevo() {

    const trevo = document.createElement("div");

    trevo.className = "trevo";

    trevo.style.left = Math.random() * 100 + "%";

    trevo.style.animationDuration =
        (4 + Math.random() * 6) + "s";

    trevo.style.opacity =
        0.4 + Math.random() * 0.6;

    trevos.appendChild(trevo);

    setTimeout(() => {

        trevo.remove();

    }, 10000);

}

/* ==========================================================
   CONFETES
========================================================== */

export function soltarConfetes() {

    for (let i = 0; i < 120; i++) {

        criarConfete();

    }

}

function criarConfete() {

    const confete = document.createElement("div");

    confete.className = "confete";

    confete.style.left = Math.random() * 100 + "%";

    confete.style.animationDuration =
        (2 + Math.random() * 3) + "s";

    confete.style.animationDelay =
        (Math.random()) + "s";

    confete.style.transform =
        `rotate(${Math.random()*360}deg)`;

    confetes.appendChild(confete);

    setTimeout(() => {

        confete.remove();

    }, 6000);

}

/* ==========================================================
   PARTÍCULAS DE BRILHO
========================================================== */

export function criarBrilho(x, y) {

    const brilho = document.createElement("div");

    brilho.className = "brilho";

    brilho.style.left = x + "px";

    brilho.style.top = y + "px";

    document.body.appendChild(brilho);

    setTimeout(() => {

        brilho.remove();

    }, 1200);

}

/* ==========================================================
   DESTAQUE DO PRÊMIO
========================================================== */

export function destacarPremio() {

    const premio = document.getElementById("premio");

    if (!premio) return;

    premio.classList.add("premio-vencedor");

    setTimeout(() => {

        premio.classList.remove("premio-vencedor");

    }, 3000);

}

/* ==========================================================
   LIMPAR CONFETES
========================================================== */

export function limparConfetes() {

    confetes.innerHTML = "";

}

/* ==========================================================
   LIMPAR TREVOS
========================================================== */

export function limparTrevos() {

    trevos.innerHTML = "";

}

/* ==========================================================
   LIMPAR TODOS OS EFEITOS
========================================================== */

export function limparEfeitos() {

    limparConfetes();

    limparTrevos();

}

/* ==========================================================
   VITÓRIA
========================================================== */

export function efeitoVitoria() {

    soltarConfetes();

    destacarPremio();

}

/* ==========================================================
   DERROTA
========================================================== */

export function efeitoDerrota() {

    document.body.classList.add("efeito-perdeu");

    setTimeout(() => {

        document.body.classList.remove("efeito-perdeu");

    }, 1200);

}
