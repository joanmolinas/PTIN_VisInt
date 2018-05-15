express = require('express')
url = require('url');
Device = require('../models/Device')
DeviceInformation = require('../models/Device-Information')
router = express.Router()
socket = require("../handlers/socket-handler")
service = require("../handlers/token-service")
Notification = require('../models/Notification')
require("mongoose").Promise = require("bluebird");

router.get('/:id_patient', function(req, res, next) {
    Notification.findById(req.params.id_patient)
    .then(doc => {
        res.send(doc)
    })
    .catch(e => {
        res.send({"status": "400"})
    })
});

router.get('/', function(req, res, next){
    //res.send('hola')
    let query = url.parse(req.url, true).query
    let dict = {}
    let filter = ''
    /*if (query.fields) {
        let arr = query.fields.replace("[",'').replace("]",'').split(',')
        filter = arr.join('')
    }*/



    /*Promise.all([
        Notification.findById(req.params.id_patient).select(filter),
        //DeviceInformation.findOne({'id_device': req.params.id}, {'info': {'$slice': -1}})
    ]).then(([notification, information]) => {
        //if (information) { device.lastInfo = information.info[0] }
        res.send(notification)
    }).catch(e => {
        console.log(e);
    }) */
})

router.post('/send_notifications', function(req, res, next) {

    let type = req.body.type
    let date = new Date()
    let id_patient = req.body.id_patient
 
    // error
    if (!type || !id_patient) {
        res.send({'status': 400})
        return
    }

    let notification = new Notification({
        id_patient: id_patient,
        type: type,
        date: date,
    })

    notification.save()
    .then(notification => {
        res.send({"status": 201, "id_patient": notification.id_patient})
        //socket.notificationWasUpdated()
    }).catch(e => {
        res.send({"status": 400})
    })
})

router.put('/:id_patient', async function(req, res, next) {
    let notification_seen = req.body.notification_seen

    if (!notification_seen) {
        res.status(400).send({ 'message': 'ERROR: Notification seen missing' })
        return
    }

    Notification.findByIdAndUpdate(req.params.id_patient,{
        $set: {
            preferences: req.body
        }
    }).then(u => {
        res.status(200).send({'message': 'Notification status changed'})
    }).catch(e => {
        res.send({"status": 400})
    })

})

module.exports = router
