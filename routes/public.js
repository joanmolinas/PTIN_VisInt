/**
 * This router file contains public routes.
 */

var express = require('express');
var router = express.Router();
var fs = require('fs')
var path = require('path');
var request = require('request')

var default_lang = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json'))).language.default_language

/**
 * @author ncarmona
 * @description Display the map and devices.
 * @version S1
 * @requires request
 */
router.get('/', function(req, res, next) {

    // var trans = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lang', default_lang, 'public.json')))
    //
    // // Getting all devices using api.
    // request({
    //     url: "http://localhost:3000/api/device/getall",
    //     json: true
    // }, function (error, response, body) {
    //     if (!error && response.statusCode === 200) {
    //         console.log(body)
    //         res.render('index-public', {
    //             'trans': trans.map_display,
    //             'content': body
    //           })
    //     }
    // })
    res.send("{OK}")

});

module.exports = router;
