const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');

//default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    //validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo no permitido, solo se permiten tipos ' + tiposValidos
            }
        });
    }


    let archivo = req.files.archivo;
    let nameCortado = archivo.name.split('.');
    let extension = nameCortado[nameCortado.length - 1];
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Archivo no permitido, solo se permiten extensiones ' + extensionesValidas
                   }
            });
    }

    //cambiar nombre de imagen
    let nombreImagen = `${ id }-${ new Date().getMilliseconds() }.${extension}`

    archivo.mv(`uploads/${tipo}/${nombreImagen}`, err => {
        if (err) {
            return res.status().json({
                ok: false,
                err
            });
        }
        //ahasta aquí ya está cargada la imagen
        res.json({
            ok: true,
            message: 'Imagen subida correctamente'
        })
    });
});

module.exports = app;