let mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
	email: String,
	password: String
}, { collection: 'users' });

let user = module.exports = mongoose.model('users', userSchema);
