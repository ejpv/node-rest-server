const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');

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
    let nameCortado = archivo.name.split('-');
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
    let nombreImagen = `${id}-${new Date().getMilliseconds()}.${extension}`

    archivo.mv(`uploads/${tipo}/${nombreImagen}`, err => {
        if (err) {
            return res.status().json({
                ok: false,
                err
            });
        }
        //ahasta aquí ya está cargada la imagen
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreImagen);
        } else {
            imagenProducto(id, res, nombreImagen);
        }

    });
});

function imagenUsuario(id, res, nombreImagen) {
    Usuario.findById(id, (err, usuarioDb) => {
        if (err) {
            borrarImagen(nombreImagen, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDb) {
            borrarImagen(nombreImagen, 'usuarios');
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El usuario no Existe'
                }
            });
        }

        borrarImagen(usuarioDb.img, 'usuarios');

        usuarioDb.img = nombreImagen;

        usuarioDb.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                message: 'Imagen subida correctamente',
                img: nombreImagen
            })

        })

    })
}

function imagenProducto() {
    Producto.findById(id, (err, productoDb) => {
        if (err) {
            borrarImagen(nombreImagen, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDb) {
            borrarImagen(nombreImagen, 'productos');
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El producto no Existe'
                }
            });
        }

        borrarImagen(productoDb.img, 'productos');

        productoDb.img = nombreImagen;

        usuarioDb.save((err, productoGuardado) => {

            res.json({
                ok: true,
                usuario: productoGuardado,
                message: 'Imagen subida correctamente',
                img: nombreImagen
            })

        })

    })
}

function borrarImagen(nombreImagen, tipo,) {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;