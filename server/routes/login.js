const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();

// logeo de un usuario
app.post('/login', function (req, res) {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //buscando el email
        if (!usuarioDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o Contraseña Incorrecto'
                }
            });
        }

        //comparar contraseña encriptandola y comparando la encriptación
        if (!bcrypt.compareSync(body.password, usuarioDb.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o Contraseña Incorrecto'
                }
            });
        }

        //generar token
        //let token = jwt.sign({ usuario: usuarioDb }, process.env.SEED_TOKEN, process.env.CADUCIDAD_TOKEN);
        let token = jwt.sign({
            usuario: usuarioDb
          }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN});

        //respuesta
        res.json({
            ok: true,
            usuario: usuarioDb,
            token
        });
    });
});


module.exports = app;