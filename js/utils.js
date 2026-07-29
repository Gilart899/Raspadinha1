// ===========================================
// UTILS
// ===========================================

// Remove tudo que não é número
export function somenteNumeros(valor = "") {

    return valor.replace(/\D/g, "");

}

// ===========================================
// CPF
// ===========================================

export function formatarCPF(cpf) {

    cpf = somenteNumeros(cpf);

    if (cpf.length !== 11) return cpf;

    return cpf.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        "$1.$2.$3-$4"
    );

}

// ===========================================

export function validarCPF(cpf) {

    cpf = somenteNumeros(cpf);

    if (cpf.length !== 11) {

        return false;

    }

    if (/^(\d)\1+$/.test(cpf)) {

        return false;

    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {

        soma += Number(cpf[i]) * (10 - i);

    }

    let resto = (soma * 10) % 11;

    if (resto === 10) resto = 0;

    if (resto !== Number(cpf[9])) {

        return false;

    }

    soma = 0;

    for (let i = 0; i < 10; i++) {

        soma += Number(cpf[i]) * (11 - i);

    }

    resto = (soma * 10) % 11;

    if (resto === 10) resto = 0;

    return resto === Number(cpf[10]);

}

// ===========================================
// TELEFONE
// ===========================================

export function formatarTelefone(telefone) {

    telefone = somenteNumeros(telefone);

    if (telefone.length === 11) {

        return telefone.replace(

            /(\d{2})(\d{5})(\d{4})/,

            "($1) $2-$3"

        );

    }

    return telefone;

}

// ===========================================
// DATA
// ===========================================

export function formatarData(data) {

    return new Date(data).toLocaleString("pt-BR");

}

// ===========================================
// ID
// ===========================================

export function gerarId() {

    return crypto.randomUUID();

}

// ===========================================
// RANDOM
// ===========================================

export function numeroAleatorio(min, max) {

    return Math.floor(

        Math.random() * (max - min + 1)

    ) + min;

}

// ===========================================
// MENSAGENS
// ===========================================

export function mostrarMensagem(texto) {

    alert(texto);

}
