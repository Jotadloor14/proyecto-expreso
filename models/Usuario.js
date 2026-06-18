const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ['CHOFER', 'ADMIN'], default: 'CHOFER' },
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
