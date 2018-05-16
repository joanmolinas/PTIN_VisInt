var express = require('express')
var router = express.Router()
var request = require('request')
let socket = require("../handlers/socket-handler")
let config = require('../config.json')

let env = config.environtment
let baseURL = env == 0 ? config.urls.production : config.urls.development
console.log(baseURL + '/api');


// Form to add a device
router.get('/addform', function(req, res, next){
  res.render('add-device')
})

// Form to list and optionally delete Devices
router.get('/list', function (req, res, next) {
 request({
   url: baseURL + '/api/devices/',
   json: true
 }, function (error, response, body) {
   if (!error && response.statusCode === 200) {
     res.render('list-devices', {
       'content': body
     })
   }
 })
})

router.post('/emit/doctor/:did/location', (req, res, next) => {
  socket.emitToDoctor(req.params.did, req.body)
  res.status(200).send({message: 'message sent' })
})

router.post('/emit/pacient/:pid/location', (req, res, next) => {
  socket.emitToPacient(req.params.pid, req.body)
  res.status(200).send({message: 'message sent'})
})

module.exports = router;
