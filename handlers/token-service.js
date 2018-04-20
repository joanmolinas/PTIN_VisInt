'use sctrict'
const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config.json')
const User = require('../models/User.js')

function createToken(user){
	const payload = {
		sub: user._id,
		iat: moment().unix(),
		exp: moment().add(60, 'days').unix(),
	}

	return jwt.encode(payload, config.SECRET_TOKEN)
}

function ensureAuthenticated(req, res, next) {
	if (!req.headers.authorization) { res.status(401).send({'message': 'Provide a token'})}

	let token = req.headers.authorization.split(" ")[1]
	User.findOne({'token': token})
	.then(doc => {
		let payload = jwt.decode(token, config.SECRET_TOKEN)
		if (payload.exp <= moment().unix) { res.status(401).send({'message' : 'Invalid token'})}
	})
	.catch(e => {
		res.status(400).send({'message': 'Invalid token'})
	})
	next()
}

module.exports = {
    createToken,
	ensureAuthenticated
}