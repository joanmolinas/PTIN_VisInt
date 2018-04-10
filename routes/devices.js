express = require('express')
url = require('url');
Device = require('../models/Device')
DeviceInformation = require('../models/Device-information')
router = express.Router()

router.get('/:id', function(req, res, next){
    Promise.all([
        Device.findById(req.params.id),
        DeviceInformation.findOne({'id_device': req.params.id}, {'info': {'$slice': -1}},)
    ]).then(([device, information]) => {
        device.lastInfo = information.info[0]
        res.send(device)
    }).catch(([eDevice, eInformation]) => {
        res.send('status': 400)
    })
})

router.get('/', function(req, res, next){
    let query = url.parse(req.url, true).query

    if (query.name) {
        let regexp = new RegExp("^"+ query.name, "i");
        query.name = regexp
    }

    Device.find(query)
    .then(doc => {
      res.send(doc)
    }).then(e => {
      res.send({"status": "400"})
    })
})

router.post('/', function(req, res, next) {
    let name = req.body.name
    let creationDate = new Date()
    let modificationDate = new Date()
    let type = req.body.type

    if (!name || !type) {
        res.send({'status': '400'})
        return
    }

    let device = new Device({
        name: name,
        active: true,
        type: type,
        creationDate: creationDate,
        modificationDate: modificationDate
    })

    device.save()
    .then(doc => {
        res.send(doc)
    }).catch(e => {
        res.send({"status": '400'})
    })
})

router.put('/:id', function(req, res, body) {
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
                })
                .catch(e => {
                    res.send({'status': 400})
                })
            } else {
                res.send({'status': 200})
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
