express = require('express')
url = require('url');
Device = require('../models/Device')
router = express.Router()

router.get('/:id', function(req, res, next){
    Device.findById(req.params.id)
    .then(doc => {
        res.send(doc)
    })
    .catch(e => {
        res.send({"status": "400"})
    })
})

router.get('/', function(req, res, next){
    let query = url.parse(req.url, true).query

    if (query.name) {
        let regexp = new RegExp("^"+ query.name, "i");
        query.name = regexp
    }

    console.log(query)

    Device.find(query)
    .then(doc => {
      res.send(doc)
    }).then(e => {
      res.send({"status": "400"})
    })
})

router.post('/', function(req, res, next) {
    let name = req.body.name
    let latitude = req.body.latitude
    let longitude = req.body.longitude
    let creationDate = new Date()
    let modificationDate = new Date()

    if (!name || !latitude || !longitude) {
        res.send({'status': '400'})
        return
    }

    let device = new Device({
        name: name,
        latitude: latitude,
        longitude: longitude,
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
    let lat = req.body.latitude
    let long = req.body.longitude
    let modificationDate = new Date()

    if (!lat || !long) {
        res.send({'status': '400'})
        return
    }

    Device.findByIdAndUpdate(req.params.id, {
        $set: {
            latitude: lat,
            longitude: long,
            modificationDate: modificationDate
        }
    })
    .then(doc => {
        res.send({'status': '200'})
    })
    .catch(e => {
        res.send({'status': '400'})
    })
})

router.get('/delete/:id', function(req, res, next){
  Device.findByIdAndRemove(req.params.id)
  .then(doc => {
      res.send({'status': '200'})
  })
  .catch(e => {
      res.send({'status': '400'})
  })
})

module.exports = router
