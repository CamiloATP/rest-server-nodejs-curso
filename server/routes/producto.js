const express = require('express');
let Producto = require('./../models/producto');

let {verificarToken, verificarAdminRole} = require('./../middlewares/autenticacion');

let app = express();

// Obtener productos
app.get('/producto', verificarToken, (req, res) => {
    let desde = Number(req.query.desde) || 0;
	let limite = Number(req.query.limite) || 5;

	Producto.find({disponible: true})
	.sort('nombre')
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
	.skip(desde)
	.limit(limite)
	.exec((err, productos) => {
		if(err) return res.status(400).json({ok: false, err});
		
		// >> count is deprecated
		Producto.countDocuments({}, (err, cantidad) => {
            if(err) return res.status(400).json({ok: false, err});
			res.json({ok: true, productos, cantidad});
		});
	});
});

// Obtener producto por ID
app.get('/producto/:id', verificarToken, (req, res) => {
    const { id } = req.params;

    Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, producto) => {

		if(err) return res.status(400).json({ok: false, err});

		if(!producto) 
		{
			return res.status(400).json({
				ok: false, 
				message: 'Producto no encontrado'
			});
		}

		res.json({ok: true, producto});
	});
});

// Buscar productos por NOMBRE
app.get('/producto/buscar/:q', verificarToken, (req, res) => {
    let desde = Number(req.query.desde) || 0;
	let limite = Number(req.query.limite) || 5;
    let { q } = req.params;
    
    let regex = new RegExp(q, 'i');

    Producto.find({nombre: regex})
    .populate('categoria', 'descripcion')
    .skip(desde)
	.limit(limite)
    .exec((err, productos) => {
        if(err) return res.status(404).json({ok: false, err});

        res.json({ok: true, productos});
    });
});

// Crear producto
app.post('/producto', [verificarToken, verificarAdminRole], (req, res) => {
    // UserID
    const usuario = req.usuario._id
    
    let {nombre, precioUni, descripcion, disponible, categoria} = req.body;

	let producto = new Producto({
        nombre, 
        precioUni, 
        descripcion, 
        disponible, 
        categoria, 
        usuario
    });

	producto.save((err, producto) => {
        if(err) return res.status(500).json({ok: false, err});
        
        if(!producto) return res.status(400).json({ok: false, err});
		
		res.json({ok: true, producto});		
	});
});

// Actualizar producto
app.put('/producto/:id', [verificarToken, verificarAdminRole], (req, res) => {
    let { id } = req.params; // <-- ID Producto
    let {nombre, precioUni, descripcion, disponible, categoria} = req.body;

    const producto = {
        nombre, 
        precioUni, 
        descripcion, 
        disponible, 
        categoria
    };
    
    const options = {
        new: true, 
        runValidators: true
    }

	Producto.findByIdAndUpdate(id, producto, options, (err, producto) => {

		if(err) return res.status(400).json({ok: false, err});

		res.json({ok: true, producto});
	});
});

// Delete producto
app.delete('/producto/:id', (req, res) => {
    const { id } = req.params; // <-- ID Producto
	Producto.findByIdAndUpdate(id, {disponible: false}, {new: true}, (err, producto) => {
		if(err) return res.status(400).json({ok: false, err});
		res.json({ok: true, producto, message: 'Producto borrado!'});
	});
});

module.exports = app;