express = require('express')
url = require('url');
Device = require('../models/Device')
DeviceInformation = require('../models/Device-Information')
router = express.Router()
socket = require("../handlers/socket-handler")
tokenMiddleware = require('../handlers/token-service')

router.get('/:id', function(req, res, next){
    let query = url.parse(req.url, true).query
    let dict = {}
    let filter = ''
    if (query.fields) {
        let arr = query.fields.replace("[",'').replace("]",'').split(',') //TODO: Improve it, this is a shit
        filter = arr.join('')
    }

    Promise.all([
        Device.findById(req.params.id, "-token").select(filter),
        DeviceInformation.findOne({'id_device': req.params.id}, {'info': {'$slice': -1}})
    ]).then(([device, information]) => {
        if (information) { device.lastInfo = information.info[0] }
        res.send(device)
    }).catch(e => {
        console.log(e);
    })
})

router.get('/', function(req, res, next){
    let query = url.parse(req.url, true).query
    let size = parseInt(query.size || 20)
    delete query.size
    if (query.name) {
        let regexp = new RegExp("^"+ query.name, "i");
        query.name = regexp
    }
    let filter = ''
    if (query.fields) {
        let arr = query.fields.replace("[",'').replace("]",'').split(',') //TODO: Improve it, this is a shit
        filter = arr.join('')
        delete query.fields
    }
    let response = []

    let prom = Device.find(query).sort({modificationDate: -1}).limit(size).select(filter)
    .then(doc => {
        let count = 0
        if (doc.length == 0) { res.send([]) }

        doc.forEach(u => {
            DeviceInformation.findOne({'id_device': u._id}, {'info': {'$slice': -1}})
            .then(info => {
                if(info) u.lastInfo = info.info
                response.push(u)

                // TODO: Improve this shit, wait to finish all promises
                if (++count == doc.length) res.send(response)
            })
            .catch(e => {
                console.log(e)
            })
        })
    })
    .catch(e => {
      res.send({"status": "400"})
  })
})

router.post('/', function(req, res, next) {
    let name = req.body.name
    let creationDate = new Date()
    let modificationDate = new Date()
    let type = req.body.type

    if (!name || !type) {
        res.send({'statuss': 400})
        return
    }

    let device = new Device({
        name: name,
        active: true,
        type: type,
        creationDate: creationDate,
        modificationDate: modificationDate
    })

    let token = service.createToken(device)
    device.token = token

    device.save()
    .then(device => {
        res.send({"status": 201, "id": device._id, "token": device.token})
        socket.deviceWasUpdated()
    }).catch(e => {
        res.send({"status": 400})
    })
})

router.put('/:id', tokenMiddleware.ensureDeviceAuthenticated, function(req, res, body) {
    if (!req.body) {
        res.send({"status": 400})
    }

    let modificationDate = new Date()
    req.body.date = modificationDate

    Device.findByIdAndUpdate(req.params.id,{
        $set: {
            modificationDate: modificationDate
        }
    })
    .then(device => {
        DeviceInformation.findOneAndUpdate({'id_device': device._id}, {
            $push: {
                info: req.body
            }
        })
        .then(doc => {
            if (!doc) {
                // Schema create cause didn't exists before
                let schema = new DeviceInformation({ id_device: req.params.id, info: [ req.body ] })

                schema.save()
                .then(doc => {
                    res.send({'status': 201})
                    socket.deviceWasUpdated()
                })
                .catch(e => {
                    res.send({'status': 400})
                })
            } else {
                res.send({'status': 200})
                socket.deviceWasUpdated()
            }
        })
        .catch(e => {
            res.send({'status': 400})
        })
    })
    .catch(e => {
        res.send({'status': 500})

    })
})

router.get('/delete/:id', function(req, res, next){
  Device.findByIdAndRemove(req.params.id)
  .then(doc => {
      res.send({'status': 200})
  })
  .catch(e => {
      res.send({'status': 400})
  })
})

module.exports = router
