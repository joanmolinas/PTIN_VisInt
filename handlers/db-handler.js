'use strict'

let mongoose = require('mongoose')
let config = require('../config.json')
let bluebird = require("bluebird");

let db;
let env = 0 // 0 = prod, 1 = dev
exports.connect = function() {
    return new Promise(function(resolve, reject) {
        if (db) return db

        let conf = env === 1 ? config.mongodb_dev : config.mongodb_prod

        mongoose.promise = bluebird
        let user_str = env === 1 ? '' : conf.user + ":" + conf.pwd + "@"

        mongoose.connect('mongodb://' + user_str + conf.hostname + ":" + conf.port + "/" + conf.database)
        .then(() => {
            console.log('mongo connection created')
            resolve(db)
        })
        .catch(e => {
            console.log('error connecting db connection: ' + err)
            reject(db)
        })
    })
}
