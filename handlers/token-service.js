'use sctrict'
const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config.json')

function createToken(user){
	const payload = {
		sub: user._id,
		iat: moment().unix(),
		exp: moment().add(60, 'days').unix(),
	}

	return jwt.encode(payload, config.SECRET_TOKEN)
}

module.exports = {
    createToken
}
