const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const { json } = require('express');
require('./config/config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// configuración de las rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB,
    { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        console.log('*** Intentando conectar ***');
        console.log('Resultado: ');
        if (err) throw err;
        console.log('DB online');
    });

app.listen(process.env.PORT, () => {
    console.log("Escuchando en el puerto 3000");
});