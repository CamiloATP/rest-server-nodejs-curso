const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('./../models/usuario');
const Producto = require('./../models/producto');
const path = require('path');
const fs = require('fs');

const app = express();

// Default options
app.use(fileUpload({useTempFiles : true}));

app.put('/upload/:tipo/:id', (req, res) => {

    let {id, tipo} = req.params;

    if(!req.files)
    {
        return res.status(400).json({
            ok: false, 
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    // Tipos permitidos
    let tipos = ['producto', 'usuario'];

    if(tipos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Error, los tipos permitidas son ${tipos.join(', ')}`,
                tipo
            }
        });
    }
    
    let archivo = req.files.archivo;
    
    let data = archivo.name.split('.');
    let extension = data[data.length - 1];
    
    // Extensiones permitidas
    let extensiones = ['png', 'jpg', 'gif', 'jpeg'];

    if(extensiones.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Error, las extensiones permitidas son ${extensiones.join(', ')}`,
                extension
            }
        });
    }

    // Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if(err) return res.status(500).json({ok: false, err});

        if(tipo === 'usuario'){
            // Actualizar img del usuario
            imagenUsuario(id, res, nombreArchivo);
        } else {
            // Actualizar img del producto
            imagenProducto(id, res, nombreArchivo);
        }
    });
});

const imagenUsuario = (id, res, nombreArchivo) => {
    Usuario.findById(id, (err, usuario) => {
        if(err) {
            borrarImagen(nombreArchivo, 'usuario');
            return res.status(500).json({ok: false, err});
        }

        if(!usuario) {
            borrarImagen(nombreArchivo, 'usuario');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        borrarImagen(usuario.img, 'usuario');
        
        // Se actualiza img
        usuario.img = nombreArchivo;

        usuario.save((err, usuario) => {
            if(err) return res.status(500).json({ok: false, err});

            res.json({
                ok: true,
                usuario
            });
        });
    });
}

const imagenProducto = (id, res, nombreArchivo) => {
    Producto.findById(id, (err, producto) => {
        if(err) {
            borrarImagen(nombreArchivo, 'producto');
            return res.status(500).json({ok: false, err});
        }

        if(!producto) {
            borrarImagen(nombreArchivo, 'producto');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        borrarImagen(producto.img, 'producto');
        
        // Se actualiza img
        producto.img = nombreArchivo;

        producto.save((err, producto) => {
            if(err) return res.status(500).json({ok: false, err});

            res.json({
                ok: true,
                producto
            });
        });
    });
}

const borrarImagen = (nombreArchivo, tipo) => {
    let pathImagen = path.resolve(__dirname, `./../../uploads/${tipo}/${nombreArchivo}`);
    if(fs.existsSync(pathImagen)) fs.unlinkSync(pathImagen);
}

// NOTE: Se debe agregar la verificación de token también acá

// > npm install express-fileupload --save

module.exports = app;