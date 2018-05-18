let mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate');

var notificationSchema = new mongoose.Schema({
	notification_seen: {type:Boolean, required:true},
	date: Date,
	features: {
		type: String,
		id_patient: String
	}
}, { collection: 'notifications' });
notificationSchema.plugin(mongoosePaginate);
module.exports = mongoose.model( 'notifications' , notificationSchema);
