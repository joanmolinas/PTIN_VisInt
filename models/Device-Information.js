let mongoose = require('mongoose')

let schema = new mongoose.Schema({
    id_device: String, // ID device
    info: Array
})

module.exports = mongoose.model('device-informations', schema)
