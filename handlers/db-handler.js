'use strict'

let mongoose = require('mongoose')
let config = require('../config.json')

let db;
exports.connect = function() {
    return new Promise(function(resolve, reject) {
        if (db) return db

        mongoose.promise = global.Promise;
        let user_str = config.mongodb.user + ":" + config.mongodb.pwd + "@"

        mongoose.connect('mongodb://' + user_str + config.mongodb.hostname + ":" + config.mongodb.port + "/" + config.mongodb.database)
        .then(() => {
            console.log('mongo connection created')
            resolve(db)
        })
        .catch(e => {
            console.log('error creating db connection: ' + err)
            reject(db)
        })
    })
}
