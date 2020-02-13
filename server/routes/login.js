const express = require('express');
const Usuario = require('./../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.post('/login', (req, res) => {
    let {email, password} = req.body;

    Usuario.findOne({email}, (err, usuarioDB) => {
        if (err) return res.status(500).json({ok: false, err});

        if(!usuarioDB)
        {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        if(!bcrypt.compareSync(password, usuarioDB.password))
        {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }
        
        // > npm i jsonwebtoken --save
        // params - payload, secret (seed), Expires In 
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.TOKEN_CADUCA });
      
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });    
});

module.exports = app;