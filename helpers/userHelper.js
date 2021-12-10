const { API_SECRET_KEY } = require('../constants/config')
const jwt = require('jsonwebtoken')
const UserModel = require('../models/UserModel')

const createPayloadUserObjectFromUser = user => {
	const { _id, email, roleIds, createdAt } = user
	return {
		_id,
		email,
		createdAt,
		roleIds,
	}
}

const findUserByRole = (roleId) => {
	return UserModel.find({roleIds:{$in :roleId}})	
}

const verifyToken = token => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, API_SECRET_KEY, (error, decoded) => {
			error ? reject(error) : resolve(decoded)
		})
	})
}

const generateToken = (data = {}, expiresIn = '24000h') => {
	return new Promise((resolve, reject) => {
		jwt.sign(
			{
				...createPayloadUserObjectFromUser(data),
			},
			API_SECRET_KEY,
			{ expiresIn },
			(err, token) => {
				err ? reject(err) : resolve(token)
			},
		)
	})
}

const getUserEmail  =(users) => {
	const emails = []
	users.map(user => {
		emails.push(user.email)
	})
	return emails
}

module.exports = {
	verifyToken,
	generateToken,
	createPayloadUserObjectFromUser,
	findUserByRole,	
	getUserEmail
}
