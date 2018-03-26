/**
 * This router file contains public routes.
 */

var express = require('express');
var router = express.Router();

/**
 * 
 */
router.get('/', function(req, res, next) {
    res.send("Página principal")
});

module.exports = router;