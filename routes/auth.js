express = require('express')
router = express.Router()
User = require('../models/User')
service = require("../handlers/token-service")

router.post("/signin", function(req, res, next) {
    let email = req.body.email
    let password = req.body.password
    if (!email && !password) {
        res.status(400).send({ 'message': 'Email or password missing' })
        return
    }

    let request = { "email": email, "password": password }
    User.findOne(request, "-password")
    .then(user => {
        if (user) {
            let token = service.createToken(user)
            res.status(200).send({ 'data': user, 'token': token })
        }
        else res.status(400).send({ 'message': "User doesn't exists" })
    })
    .catch(e => {
        console.log(e);
        res.status(400).send({'message': 'Internal error'})
    })
})

router.post("/signup", function(req, res, next) {
    let email = req.body.email
    let password = req.body.password
    if (!email || !password) {
        console.log("hey");
        res.status(400).send({ 'message': 'Email or password missing' })
        return
    }

    let user = new User({
    	email: req.body.email,
    	password: req.body.password,
    })

    user.save()
    .then(u => {
        let token = service.createToken(u)
        delete u.password
        res.status(200).send({'data': u, 'token': token})
    })
    .catch(e => {
        res.status(400).send({'message': 'Email already exists'})
    })

})

module.exports = router
