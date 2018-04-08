let users = require('./users')
let devices = require('./devices')
let utils = require('./utils')

exports.create = function(app) {
    let baseAPI = '/api'
    app.use(baseAPI + '/users', users)
    app.use(baseAPI + '/devices', devices)
    app.use(baseAPI, utils)
}
