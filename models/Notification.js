let mongoose = require('mongoose')
let Schema = mongoose.Schema
let mongoosePaginate = require('mongoose-paginate');


var notificationSchema = new mongoose.Schema({
	requester: { type: Schema.Types.ObjectId, ref: "Device", required: true },
	date: { type: String, required: true },
	deviceAssociated: { type: Schema.Types.ObjectId, ref: "Device", required: true },
	readed: Boolean,
	typeOfAction: { type: Number, enum: [1, 2]}
}, { collection: 'notification'})
notificationSchema.plugin(mongoosePaginate);
module.exports = mongoose.model( 'notifications' , notificationSchema);
