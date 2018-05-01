let bcrypt = require('bcrypt')
const salts = 10

function encrypt(password) {
    return new Promise(function(resolve, reject){
        bcrypt.hash(password, salts)
        .then(resolve)
        .catch(reject)
    })
}

function compare(password, dbPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(password, dbPassword)
        .then(resolve)
        .catch(reject)
    })
}

module.exports = {
    encrypt,
    compare 
}
