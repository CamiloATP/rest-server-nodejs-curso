const express = require('express');
let Categoria = require('./../models/categoria');

let {verificarToken, verificarAdminRole} = require('./../middlewares/autenticacion');

let app = express();

// Mostrar todas las categorías
app.get('/categoria', verificarToken, (req, res) => {
    let desde = Number(req.query.desde) || 0;
	let limite = Number(req.query.limite) || 5;

	Categoria.find({})
	.sort('descripcion')
	.populate('usuario', 'nombre email')
	.skip(desde)
	.limit(limite)
	.exec((err, categorias) => {
		if(err) return res.status(400).json({ok: false, err});
		
		// >> count is deprecated
		Categoria.countDocuments({}, (err, cantidad) => {
            if(err) return res.status(400).json({ok: false, err});
			res.json({ok: true, categorias, cantidad});
		});
	});
});

// Mostrar una categoría por ID
app.get('/categoria/:id', verificarToken, (req, res) => {
    const { id } = req.params;

	Categoria.findById(id, (err, categoria) => {

		if(err) return res.status(400).json({ok: false, err});

		if(!categoria) 
		{
			return res.status(400).json({
				ok: false, 
				message: 'Categoría no encontrada'
			});
		}

		res.json({ok: true, categoria});
	});
});

// Crear una nueva categoría
app.post('/categoria', [verificarToken, verificarAdminRole], (req, res) => {
    // UserID
    let usuario = req.usuario._id
    
    let {descripcion} = req.body;

	let categoria = new Categoria({descripcion, usuario});

	categoria.save((err, categoria) => {
        if(err) return res.status(500).json({ok: false, err});
        
        if(!categoria) return res.status(400).json({ok: false, err});
		
		res.json({ok: true, categoria});		
	});
});

// Actualizar la descripción de la categoría
app.put('/categoria/:id', [verificarToken, verificarAdminRole], (req, res) => {    
    const { id } = req.params;
    const {descripcion} = req.body;
    
    const options = {
        new: true, 
        runValidators: true
    }

	Categoria.findByIdAndUpdate(id, {descripcion}, options, (err, categoria) => {

		if(err) return res.status(400).json({ok: false, err});

		res.json({ok: true, categoria});
	});
});

// Eliminar categoría
app.delete('/categoria/:id', [verificarToken, verificarAdminRole], (req, res) => {
    let {id} = req.params;

	Categoria.findByIdAndRemove(id, (err, categoria) => {
		if(err) return res.status(400).json({ok: false, err});

		if(!categoria) 
		{
			return res.status(400).json({
				ok: false, 
				message: 'Categoría no encontrada'
			});
		}
		
		res.json({ok: true, categoria});
	});
});

module.exports = app;