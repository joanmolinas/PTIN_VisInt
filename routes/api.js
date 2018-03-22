/**
 * This router file contains api routes.
 */

var express = require('express');
var router = express.Router();

/**
 * 
 */
router.get('/user/:nombre', function(req, res, next) {
  let user = require('../models/User')

  user.find({'nombre': req.params.nombre}, "" ,function(err, users_doc){
    res.json(users_doc)
  })

});

router.post('/user/validate')
module.exports = router;
