/**
 * This router file contains api routes.
 */

var express = require('express')
var request = require('request')
var url = require('url');
let user = require('../models/User')
let device = require('../models/Device')

var router = express.Router()

/**
 *  GET - Nombre de un usuario por "nombre"
 */
router.get('/users/:id', function(req, res, next) {
  user.find({'id': req.params.nombre}, "" ,function(err, users_doc){
    res.json(users_doc)
  })

});

/**
 * @author ncarmona
 * @description Displays a add device form. Crida a un formulari semblant al de la web Postman
 * @version S1
 */
router.get('/devices/addform', function(req, res, next){
  res.render('add-device')
})

/**
 * @author ncarmona
 * @description Adds a device in the database.
 * @version S1
 * @returns a JSON response with a satus code and a message.
 */
router.post('/devices', function(req, res, next){
  var insertObject = {
    "name": req.body.name,
    "latitude": req.body.latitude,
    "longitude": req.body.longitude,
    "creationDate" : new Date()
  }

  device.insertMany(insertObject, function(err, result){
    if (err){
      console.log("Error.")
    }else {
      res.json({
        "status":"ok",
        "msg": "Added"
      })
    }
  })

})

/**
 * @author ncarmona
 * @description Remove devices by ID.
 * @version S1
 * @returns a JSON response with a satus code and a message.
 */
router.get('/devices/:id/delete', function(req, res, next){
  device.findByIdAndRemove(req.params.id, function(err, device_doc){
    if(err){
      res.json({
        "status": "err",
        "msg": "Device does not exists or can not be removed."
      })
    }else{
      res.json({
        "status": "ok",
        "msg": "Device deleted succefully."
      })
    }
  })
})

router.get('/devices/list', function (req, res, next) {
 // Getting all devices using api.
 request({
   url: "https://ptin2018.herokuapp.com/api/devices/",
   json: true
 }, function (error, response, body) {
   if (!error && response.statusCode === 200) {
     console.log(body)
     res.render('list-devices', {
       'content': body
     })
   }
 })
})


/**
 * @author ncarmona
 * @description Count how many devices exists on database.
 * @version S1
 * @returns a JSON response with an integer indicating how many devices exists on database.
 */
router.get('/devices/count', function(req, res, next){
  device.count({}, function(err, count){
    if(err){
      res.json({
        "status": "err",
        "msg": "Unable to count how many device exists."
      })
    }else{
      res.json({
        "count": count
      })
    }
  })
})

/**
 * @author ncarmona
 * @description Get all devices.
 * @version S1
 * @returns a JSON response with all devices data.
 * @todo Implement pagination
 */
router.get('/devices', function(req, res, next){
  var queryData = url.parse(req.url, true).query;
  device.find(queryData, "" ,function(err, devices_doc){
    res.json(devices_doc)
  })

})

/**
 * @author ncarmona
 * @description Get a device by ID
 * @version S1
 * @returns a JSON response with device date otherwhise null.
 */
router.get('/devices/:id', function(req, res, next){
  device.findById(req.params.id, "" ,function(err, users_doc){
    res.json(users_doc)
  })
})

module.exports = router;
