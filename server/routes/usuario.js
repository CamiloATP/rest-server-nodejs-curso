const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificarToken, verificarAdminRole } = require('./../middlewares/autenticacion');

const app = express();

const Usuario = require('./../models/usuario');

app.get('/usuario', verificarToken, (req, res) => {
	let desde = Number(req.query.desde) || 0;
	let limite = Number(req.query.limite) || 5;

	Usuario.find({estado: true}, 'nombre email role estado google img')
	.skip(desde)
	.limit(limite)
	.exec((err, usuarios) => {
		if(err){
			return res.status(400).json({
				ok: false,
				err
			});
		}
		
		// >> count is deprecated
		Usuario.countDocuments({estado: true}, (err, cantidad) => {
			res.json({ok: true, usuarios, cantidad});
		})

	});
});

app.post('/usuario', [verificarToken, verificarAdminRole], (req, res) => {
	let {nombre, email, password, role} = req.body;

	// Crear Hash
	password = bcrypt.hashSync(password, 10);

	let usuario = new Usuario({nombre, email, password, role});

	usuario.save((err, usuarioDB) => {
		if(err) {
			return res.status(400).json({ok: false, err});
		}
		
		res.json({ok: true, persona: usuarioDB});		
	});
});

// Para validar filtrar los datos del objeto
// > npm install underscore --save
app.put('/usuario/:id', [verificarToken, verificarAdminRole], (req, res) => {
	const { id } = req.params;
	// Filtrando el objeto
	const body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

	Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {

		if(err){
			return res.status(400).json({ok: false, err});
		}

		res.json({ok: true, persona: usuarioDB});
	});
});

app.delete('/usuario/:id', [verificarToken, verificarAdminRole],(req, res) => {
	// let {id} = req.params;

	// Usuario.findByIdAndRemove(id, (err, usuario) => {
	// 	if(err) return res.status(400).json({ok: false, err});

	// 	if(!usuario) 
	// 	{
	// 		return res.status(400).json({
	// 			ok: false, 
	// 			message: 'Usuario no encontrado'
	// 		});
	// 	}

	// 	res.json({ok: true, usuario});
	// });

	const { id } = req.params;

	Usuario.findByIdAndUpdate(id, {estado: false}, {new: true}, (err, usuarioDB) => {

		if(err){
			return res.status(400).json({ok: false, err});
		}

		res.json({ok: true, persona: usuarioDB});
	});
});

module.exports = app;