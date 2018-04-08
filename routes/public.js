/**
 * This router file contains public routes.
 */

var express = require('express');
var router = express.Router();
var fs = require('fs')
var path = require('path');

/**
 * @author ncarmona
 * @description Display the map and devices.
 * @version S1
 */
router.get('/', function(req, res, next) {
    res.sendFile()
});

module.exports = router;
