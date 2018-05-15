express = require('express')
url = require('url');
Device = require('../models/Device')
DeviceInformation = require('../models/Device-Information')
router = express.Router()
socket = require("../handlers/socket-handler")
service = require("../handlers/token-service")
Notification = require('../models/Notification')
require("mongoose").Promise = require("bluebird");


router.get('/', function(req, res, next){
    Notification.find({}, function(err, notification) {
    	var notificationMap = {};
	
	notification.forEach(function(notification) {
		notificationMap[notification._id] = notification;
	});
	
	res.send(notificationMap);

	});
		  
});

router.post('/', function(req, res, next) {

    let type = req.body.type
    let date = new Date()
    let id_patient = req.body.id_patient
 
    // error
    if (!type || !id_patient) {
        res.send({'status': 400})
        return
    }

    let notification = new Notification({
	date: date,
        notification_seen: false
    })

    notification.id_patient = req.body.id_patient
    notification.type = req.body.type

    notification.save()
    .then(notification => {
        res.status(200).send({'id': notification._id,'id_patient': notification.id_patient})
        //socket.notificationWasUpdated()
    }).catch(e => {
        res.status(400).send("Error")
	return
    })
})

router.put('/:id', function(req, res, next) {

    Notification.findByIdAndUpdate(req.params.id,{

    $set: {
	notification_seen : true
    }
    
    }).then(u => {
        res.status(200).send({'message': 'Notification readed'})
    }).catch(e => {
        res.send({"status": 400})
	return
    })

})

module.exports = router
