express = require('express')
router = express.Router()
User = require('../models/User')
service = require("../handlers/token-service")

router.post("/signin", function(req, res, next) {
    let username = req.body.username
    let password = req.body.password
    if (!username && !password) {
        res.status(400).send({ 'message': 'Username or password missing' })
        return
    }

    let request = { "username": username, "password": password }
    User.findOne(request, "-password")
    .then(user => {
        if (user) {
            let token = service.createToken(user)
            user.token = token
            user.save()
            .then(u => res.status(200).send({ 'data': u }))
            .catch(e => { res.status(500).send({'message': 'Internal error'})})
        }
        else res.status(400).send({ 'message': "User doesn't exists" })
    })
    .catch(e => {
        console.log(e);
        res.status(400).send({'message': 'Internal error'})
    })
})

router.post("/signup", function(req, res, next) {
    let username = req.body.username
    let password = req.body.password
    if (!username || !password) {
        console.log("hey");
        res.status(400).send({ 'message': 'Username or password missing' })
        return
    }

    let user = new User({
    	username: req.body.username,
    	password: req.body.password
    })


    user.save()
    .then(u => {
        let token = service.createToken(u)
        u.token = token
        u.save()
        .then(u => {
            delete u.password
            res.status(200).send({'data': u})
        })
        .catch(e => {
            res.status(500).send({'message': 'Internal error'})
        })

    })
    .catch(e => {
        res.status(400).send({'message': 'Username already exists'})
    })

})

module.exports = router
