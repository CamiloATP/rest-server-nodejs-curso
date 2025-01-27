var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productoSchema = new Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre es necesario']
    },
    precioUni: { 
        type: Number, 
        required: [true, 'El precio únitario es necesario']
    },
    descripcion: { 
        type: String, 
        required: false
    },
    disponible: { 
        type: Boolean, 
        required: [true, 'El campo disponible es necesario'], 
        default: true 
    },
    categoria: { 
        type: Schema.Types.ObjectId, 
        ref: 'Categoria', 
        required: true
    },
    usuario: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario'
    },
    img: {
        type: String
    }
});

module.exports = mongoose.model('Producto', productoSchema);