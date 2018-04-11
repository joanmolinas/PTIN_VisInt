let mongoose = require('mongoose')

var deviceSchema = new mongoose.Schema({
	name: String,
	active: Boolean,
	type: Number,
	creationDate: Date,
	modificationDate: Date,
	lastInfo: {}
}, { collection: 'devices' });

module.exports = mongoose.model( 'devices' , deviceSchema);
