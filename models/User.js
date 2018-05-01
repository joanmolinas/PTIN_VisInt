let mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
	username: { type:String, required:true, unique: true},
	password: { type:String, required:true },
	token: String,
	languaje: {
		type: Number,
		min: 1,
		max: 3,
	},
	preferences: {
		language: Number
	}
}, { collection: 'users' });

module.exports = mongoose.model('users', userSchema);
