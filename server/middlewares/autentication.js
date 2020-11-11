const jwt = require('jsonwebtoken');
// ======================
//  Verificar Token
// ======================

let verificarToken = (req, res, next) => {

    let token = req.get('token');
    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

};

// ======================
//  Verificar Admin Rol
// ======================

let verificarAdmin_Rol = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.rol === 'USER_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    } else {
        next();
    }

};

// ======================
//  Verificar Token img por url
// ======================

let verificarTokenImg = (req, res, next) => {
    let token = req.query.token;
    //en el url debe estar "?token=123123..."
    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}
module.exports = {
    verificarToken,
    verificarAdmin_Rol,
    verificarTokenImg
}