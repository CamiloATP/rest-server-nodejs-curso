const jwt = require('jsonwebtoken');

// =====================
// Verificar Token
// =====================
let verificarToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if(err) {
            return res.status(401).json({
                ok: false, 
                err: {
                    message: 'Token no válido'
                }
            });
        };

        // Dar acceso a la info del usuario en peticiones
        req.usuario = decoded.usuario;

        next();
    });
}

// =====================
// Verificar ADMIN_ROLE
// =====================
let verificarAdminRole = (req, res, next) => {
    let {usuario} = req;

    // console.log(usuario);

    if(usuario.role === 'USER_ROLE')
    {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

    next();
}

// =====================
// Verificar Token Img
// =====================
let verificarTokenImg = (req, res, next) => {
    let {token} = req.query;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if(err) {
            return res.status(401).json({
                ok: false, 
                err: {
                    message: 'Token no válido'
                }
            });
        };

        // Dar acceso a la info del usuario en peticiones
        req.usuario = decoded.usuario;

        next();
    });
}

module.exports = {
    verificarToken,
    verificarAdminRole,
    verificarTokenImg
}