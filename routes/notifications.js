express = require('express')
router = express.Router()
Notification = require('../models/Notification')

router.get('/', (req, res, next) => {
    Notification.find({})
    .populate('requester')
    .populate('deviceAssociated')
    .then(nots => {
        res.status(200).send(nots)
    })
    .catch(e => {
        console.log(e)
        res.status(500).send({message: 'Internal server error'})
    })
})

router.put('/:id', (req, res, next) => {

    Notification.findByIdAndUpdate(req.params.id, {
        $set: {
            readed : true
        }
        }).then(u => {
            res.status(200).send({'message': 'Notification readed'})
        }).catch(e => {
            res.status(400).send({message: 'Internal server error'})
        })

})

module.exports = router
