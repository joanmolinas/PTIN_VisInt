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

// Modify user preferences
router.put('/:id', service.ensureUserAuthenticated, async function(req, res, next) {
    let lang = req.body.language

    if (!lang) {
        res.status(400).send({ 'message': 'ERROR: Language missing' })
        return
    }

    User.findByIdAndUpdate(req.params.id,{
        $set: {
            preferences: req.body
        }
    }).then(u => {
        res.status(200).send({'message': 'Preferences changed'})
    }).catch(e => {
        res.send({"status": 400})
    })

})

//Legacy/Deprecated function
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
