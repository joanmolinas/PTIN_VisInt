express = require('express')
router = express.Router()
const User = require('../models/User')
require("mongoose").Promise = require("bluebird");

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

router.post('/', function(req, res, next) {
    let email = req.body.email
    let password = req.body.password

    if (!email || !password) {
        res.send({"status" : "400"})
        return
    }

    let u = new User({
        email: req.body.email,
        password: req.body.password
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
