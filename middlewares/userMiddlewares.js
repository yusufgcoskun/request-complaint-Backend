const User = require('../models/UserModel')
const Helper = require('../helpers/Helper')
const { ADMIN_ROLE } = require('../constants/constants')
const {
	ERROR,
	createErrorWithObject,
	serverError,
	createError,
} = require('../helpers/errorHelper')
const RoleModel = require('../models/RoleModel')
const UserModel = require('../models/UserModel')
const { user } = require('../helpers/Helper')

const verifyToken = (req, res, next) => {
	const token = req.headers['x-auth-token'] || req.body.token || req.query.token
	if (token) {
		Helper.user
			.verifyToken(token)
			.then(decoded => {
				res.locals.decoded = decoded
				next()
			})
			.catch(err => {
				next(createError('Geçersiz token', 400, ''))
			})
	} else {
		next(createError(null, 400, `token-is-${token}`))
	}
}

const verifyTokenOrNext = (req, res, next) => {
	const token = req.headers['x-auth-token'] || req.body.token || req.query.token
	if (token && token !== 'null') {
		Helper.user
			.verifyToken(token)
			.then(decoded => {
				res.locals.decoded = decoded
				next()
			})
			.catch(err => {
				next(createError('Geçersiz token', 400, ''))
			})
	} else {
		return next()
	}
}

const verifyPassword = (req, res, next) => {
	let email = null
	if (req.body.email) email = req.body.email
	else if (res.locals.decoded && res.locals.decoded.email)
		email = res.locals.decoded.email
	else return next(createErrorWithObject(ERROR.NULL_EMAIL))

	if (req.body.password || req.body.oldPassword) {
		const password = req.body.password || req.body.oldPassword
		User.findOne({ email })
			.then(user => {
				if (user) {
					Helper.hash
						.compareHash(password, user.password)
						.then(status => {
							if (status) {
								res.locals.user = user
								next()
							} else {
								next(createErrorWithObject(ERROR.WRONG_PASSWORD))
							}
						})
						.catch(err => next(serverError(err)))
				} else {
					next(createErrorWithObject(ERROR.USER_NOT_FOUND))
				}
			})
			.catch(err => next(serverError(err)))
	} else return next(createErrorWithObject(ERROR.NULL_PASSWORD))
}

const checkUserIsAdmin = async (req, res, next) => {
	const { _id } = res.locals.decoded
	let isAdmin = false
	await UserModel.findOne({ _id })
		.then(async user => {
			await RoleModel.find({ _id: { $in: user.roleIds } })
				.then(roles => {
					roles.map(role => {
						if (role.name === ADMIN_ROLE) {
							isAdmin = true
						}
					})
				})
				.catch(e => next(serverError(e)))
		})
		.catch(e => next(serverError(e)))
	if (isAdmin) {
		return next()
	} else {
		return next(createErrorWithObject(ERROR.USER_NOT_AUTHORIZED))
	}
}

const checkUpdatedUserEmail = (req, res, next) => {
	const { email } = req.body
	const { userId } = req.params
	User.findOne({ email, _id: { $ne: userId } })
		.then(user => {
			if (user) {
				return next(createErrorWithObject(ERROR.EMAIL_ALREADY_EXIST))
			} else {
				return next()
			}
		})
		.catch(e => next(serverError(e)))
}

module.exports = {
	verifyPassword,
	verifyToken,
	verifyTokenOrNext,
	checkUserIsAdmin,
	checkUpdatedUserEmail,
}
