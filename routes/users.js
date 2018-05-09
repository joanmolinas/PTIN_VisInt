express = require('express')
router = express.Router()
const User = require('../models/User')
require("mongoose").Promise = require("bluebird");
service = require("../handlers/token-service")

// Get a user giving ID
router.get('/:id', function(req, res, next) {
    User.findById(req.params.id)
    .then(doc => {
        res.send(doc)
    })
    .catch(e => {
        res.send({"status": "400"})
    })
});


router.put('/:id',function(req, res, next) {
//Forcem a que passin tots els camps.
//Depenent com sigui la pantalla al front-end s'hauràn d'afegir condicions si només passan els camps que volen modificar.
	if (!req.body.username || !req.body.password || !req.body.language) {
        res.status(400).send({"message": 'ERROR Fields missing'})
        return
    }

    let name = req.body.username;
    let pass = req.body.password
	let pref = req.body;
    User.findByIdAndUpdate(req.params.id,{
        $set: {
        	username : name,
        	password : pass,
            preferences : pref
        }
    }).then(u => {
        res.status(200).send({'message': 'Information changed'})
    }).catch(e => {
          res.status(400).send({"message": 'ERROR Something went wrong'})
    })
})

//Legacy/Deprecated function. In use: /auth/signup 
router.post('/', function(req, res, next) {
    let email = req.body.email
    let password = req.body.password

    if (!email || !password) {
        res.send({"status" : "400"})
        return
    }

    let u = new User({
        email: email,
        password: password
    })

    u.save()
        .then(doc => {
            res.send(doc)
        })
        .catch(e => {
            res.send(e)
        })
})

module.exports = router
