var express = require('express')
var router = express.Router()
var request = require('request')

// Form to add a device
router.get('/addform', function(req, res, next){
  res.render('add-device')
})

// Form to list and optionally delete Devices
router.get('/list', function (req, res, next) {
 request({
   url: "http://localhost:3000/api/devices",
   json: true
 }, function (error, response, body) {
   if (!error && response.statusCode === 200) {
     res.render('list-devices', {
       'content': body
     })
   }
 })
})

module.exports = router;
