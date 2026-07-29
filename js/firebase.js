/* ==========================================================
   RASPADINHA DA AMIZADE
   Firebase
========================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getDatabase
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

/* ==========================================================
   CONFIGURAÇÃO
========================================================== */

const firebaseConfig = {

    apiKey: "SUA_API_KEY",

    authDomain: "raspadinha-b8271.firebaseapp.com",

    databaseURL: "https://raspadinha-b8271-default-rtdb.firebaseio.com",

    projectId: "raspadinha-b8271",

    storageBucket: "raspadinha-b8271.appspot.com",

    messagingSenderId: "SEU_MESSAGING_SENDER_ID",

    appId: "SEU_APP_ID"

};

/* ==========================================================
   APP
========================================================== */

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

/* ==========================================================
   EXPORTAÇÕES
========================================================== */

export function getDB() {

    return database;

}

export { app };
