let mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate');

var userSchema = new mongoose.Schema({
	username: { type:String, required:true, unique: true},
	password: { type:String, required:true },
	token: String,
	preferences: {
		language: Number
	}
}, { collection: 'users' });
userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('users', userSchema);
