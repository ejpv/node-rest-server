require("./credentials");
/*
============================
Puerto
============================
¨*/

process.env.PORT = process.env.PORT || 3000;


/*
============================
Entorno
============================
*/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/*
============================
Expiracion token
============================
60 segundos
60 minutos
24 horas
5 días
*/

process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD;

/*
============================
Semilla Token
============================
*/

process.env.SEED_TOKEN = process.env.SEED;

/*
============================
DB
============================
*/

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;