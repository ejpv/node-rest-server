const express = require('express');
const Producto = require('../models/producto');
const { verificarToken } = require('../middlewares/autentication');
const Categoria = require('../models/categoria');
const app = express();


// buscar productos
app.get('/producto/buscar/:termino', verificarToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({nombre: regex})
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });
});

// obtener todos los usuarios
app.get('/producto', verificarToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate({
            path: 'usuario',
            model: 'usuario'
        })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });
});

// obtener un producto
app.get('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate({
            path: 'usuario',
            model: 'usuario'
        })
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no es válido'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

// ingresar un producto regresa el nuevo producto
app.post('/producto', verificarToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// editar un producto
app.put('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Producto no existe'
                }
            });
        }

        if (body.categoria) {
            Categoria.findById(body.categoria, (err, categoriaDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                if (!categoriaDB) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'La categoría no existe'
                        }
                    });
                }
                productoDB.categoria = body.categoria;
            });
        }


        if (body.precioUni) {
            productoDB.precioUni = body.precioUni;
        }

        if (body.disponible) {
            productoDB.disponible = body.disponible;
        }

        if (body.descripcion != undefined) {
            console.log(body.descripcion);
            productoDB.descripcion = body.descripcion;
        }

        if (body.nombre) {
            productoDB.nombre = body.nombre;
        }

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });
        });
    });
});

// eliminar un producto
app.delete('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Producto no existe'
                }
            });
        }

        productoDB.disponible = false;
        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto Borrado'
            });
        });
    });
});


module.exports = app;