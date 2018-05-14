let mongoose = require('mongoose')

var deviceSchema = new mongoose.Schema({
	name: {type:String, required:true},
	active: { type:Boolean, required:true },
	enabled: Boolean,
	deleted: Boolean,
	type: {
		type: Number,
		required: true,
		min: 1,
		max: 100,
	},
	token: String,
	creationDate: Date,
	modificationDate: Date,
	lastInfo: {},
	additionalInfo: {}
}, { collection: 'devices' });

module.exports = mongoose.model( 'devices' , deviceSchema);