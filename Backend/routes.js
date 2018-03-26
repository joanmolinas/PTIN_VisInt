module.exports = function(app){

	var Device = require('./device');

	// POST
	addDevice = function (req, res) {
		console.log('POST');
		console.log(req.body);

		var device = new Device({
			id: req.body.id,
			name: req.body.name,
			latitude: req.body.latitude,
			longitude: req.body.longitude,
			creationDate: req.body.creationDate,
			modificationDate: req.body.modificationDate
		});

		Device.save(function(err) {
			if(!err) console.log('Device Saved!');
			else console.log('ERROR: ' +err);
		});
		res.send(device);
	};
}