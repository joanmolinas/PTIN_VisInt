/**
 * This router file contains api routes.
 */

var express = require('express');
var router = express.Router();

/**
 *  GET - Nombre de un usuario por "nombre"
 */
router.get('/user/:nombre', function(req, res, next) {
  let user = require('../models/User')

  user.find({'nombre': req.params.nombre}, "" ,function(err, users_doc){
    res.json(users_doc)
  })

});

/**
 * @author ncarmona
 * @description Displays a add device form. Crida a un formulari semblant al de la web Postman
 * @version S1
 */
router.get('/device/addform', function(req, res, next){

  res.render('add-device')

})

/**
 * @author ncarmona
 * @description Adds a device in the database.
 * @version S1
 * @returns a JSON response with a satus code and a message.
 */
router.post('/device/add', function(req, res, next){
  let device = require('../models/Device')

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
router.get('/device/delete/:id', function(req, res, next){
  let device = require('../models/Device')

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

/**
 * @author ncarmona
 * @description Count how many devices exists on database.
 * @version S1
 * @returns a JSON response with an integer indicating how many devices exists on database.
 */
router.get('/device/count', function(req, res, next){
  let device = require('../models/Device')
  
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
router.get('/device/getall', function(req, res, next){
  let device = require('../models/Device')

  device.find({}, "" ,function(err, devices_doc){
    res.json(devices_doc)
  })

})

/**
 * @author ncarmona
 * @description Get a device by ID
 * @version S1
 * @returns a JSON response with device date otherwhise null.
 */
router.get('/device/getByID/:id', function(req, res, next){
  let device = require('../models/Device')

  device.findById(req.params.id, "" ,function(err, users_doc){
    res.json(users_doc)
  })

})

module.exports = router;
