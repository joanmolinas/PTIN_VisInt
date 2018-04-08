let users = require("./users")

exports.create = function(app) {
    let baseAPI = '/api'
    app.use(baseAPI + '/users', users)

}
