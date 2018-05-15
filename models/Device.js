let mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate');

var deviceSchema = new mongoose.Schema({
	name: {type:String, required:true},
	active: { type:Boolean, required:true },
	type: {
		type: Number,
		required: true,
		min: 1,
		max: 100,
	},
	token: String,
	creationDate: Date,
	modificationDate: Date,
	lastInfo: {}
}, { collection: 'devices' });
deviceSchema.plugin(mongoosePaginate);

module.exports = mongoose.model( 'devices' , deviceSchema);