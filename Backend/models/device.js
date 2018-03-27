var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var device = new Schema({
	id: String,
	name: String,
	latitude: Number,
	longitude: Number,
	creationDate: Date,
	modificationDate: Date
});

module.exports = mongoose.model('Device', device);