express = require('express')
router = express.Router()
User = require('../models/User')

router.post("/signin", function(req, res, next) {
    let email = req.body.email
    let password = req.body.password
    if (!email && !password) {
        res.send({'status': 400})
        return
    }

    let request = { "email": email, "password": password }
    User.findOne(request, "-password")
    .then(user => {
        if (user) res.send({'status': 200, 'data': user}) 
        else res.send({'status': 404})
    })
    .catch(e => {
        res.send({'status': 400})
    })
})

module.exports = router
