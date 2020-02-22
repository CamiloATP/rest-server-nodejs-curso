const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

const usuarioSchema = new mongoose.Schema({
    nombre : {
        type: String,
        required: [true, 'Se require el nombre']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Se require el email']
    },
    password: {
        type: String,
        required: [true, 'Se require la constraseña']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() {
    let userObject = this.toObject();
    delete userObject.password
    return userObject;
};

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe ser único'});

module.exports = mongoose.model('Usuario', usuarioSchema);