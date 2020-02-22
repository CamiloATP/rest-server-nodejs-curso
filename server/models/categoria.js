const mongoose = require('mongoose');


const categoriaSchema = new mongoose.Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'Se require la descripción']
    },
    usuario: {
        type: mongoose.Types.ObjectId,
        ref: 'Usuario'
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema);