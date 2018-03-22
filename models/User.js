let mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
	nombre: String,
	email: String,
	clave: String,
	activo: Boolean,
	num_comentarios: Number
}, {collection: 'usuarios'});

let user = module.exports = mongoose.model('usuarios', userSchema);
