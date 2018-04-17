let mongoose = require('mongoose')

var deviceSchema = new mongoose.Schema({
	name: {type:String, required:true},
	active: { type:Boolean, required:true },
	type: {
		type: Number,
		required: true,
		min: 1,
		max: 100,
	},
	creationDate: Date,
	modificationDate: Date,
	lastInfo: {}
}, { collection: 'devices' });

module.exports = mongoose.model( 'devices' , deviceSchema);
