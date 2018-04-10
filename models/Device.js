let mongoose = require('mongoose')

var deviceSchema = new mongoose.Schema({
	name: String,
	latitude: Number,
	longitude: Number,
	type: Number,
	creationDate: Date,
	modificationDate: Date
}, { collection: 'devices' });

let user = module.exports = mongoose.model( 'devices' , deviceSchema);
