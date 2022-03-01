const {
	ERROR,
	createErrorWithObject,
	serverError,
	createError,
} = require('../helpers/errorHelper')
const Helper = require('../helpers/Helper')
const User = require('../models/UserModel')

const validateNameInput = (req, res, next) => {
	const { ownerName, name } = req.body
	const validation = Helper.input.validationName(ownerName ? ownerName : name)
	validation.status ? next() : next(validation.error)
}

const validateTicketTypeNameInput = (req, res, next) => {
	const { name } = req.body
	const validation = Helper.input.validateTicketTypeName(name)
	validation.status ? next() : next(validation.error)
}

const validateSurnameInput = (req, res, next) => {
	const { ownerSurname, surname } = req.body
	const validation = Helper.input.validationSurname(
		ownerSurname ? ownerSurname : surname,
	)
	validation.status ? next() : next(validation.error)
}

const validateAddressInformationInput = (req, res, next) => {
	const { addressDescription, neighborhood, street, apartmentNo } = req.body
	const validation = Helper.input.validateAddressInformation(
		neighborhood,
		street,
		addressDescription,
	)
	validation.status ? next() : next(validation.error)
}

const validatePhoneNumberInput = (req, res, next) => {
	const { phoneNumber } = req.body
	const validation = Helper.input.validationPhoneNumber(phoneNumber)
	validation.status ? next() : next(validation.error)
}

const validatePasswordInput = (req, res, next) => {
	const password = req.body.password || req.body.newPassword
	const validation = Helper.input.validationPassword(password)
	validation.status ? next() : next(validation.error)
}

const validatePhoneNumberIsUnique = (req, res, next) => {
	const { phoneNumber } = req.body
	User.findOne({ phoneNumber })
		.then(phoneNumber => {
			if (phoneNumber) {
				next(createErrorWithObject(ERROR.PHONE_NUMBER_ALREADY_EXIST))
			} else {
				next()
			}
		})
		.catch(err => next(serverError(error)))
}

const validateEmailInput = (req, res, next) => {
	const { email } = req.body
	if (email) {
		validation = Helper.input.validationEmail(email)
		validation.status ? next() : next(validation.error)
	} else {
		return next()
	}
}

const validateUserExistByEmail = (req, res, next) => {
	const email = req.body.email ? req.body.email : res.locals.decoded.email
	User.findOne({ email })
		.then(user => {
			if (user) {
				res.locals.user = user
				return next()
			} else {
				return next(createErrorWithObject(ERROR.USER_EMAIL_NOT_REGISTERED))
			}
		})
		.catch(e => next(serverError(e)))
}

const validateUserNotExistByEmail = (req, res, next) => {
	const { email } = req.body
	User.findOne({ email }).then(user => {
		if (user) {
			return next(createErrorWithObject(ERROR.EMAIL_ALREADY_EXIST))
		} else {
			return next()
		}
	})
}

const validateIdentyNumber = (req, res, next) => {
	const { identityNumber } = req.body
	const validation = Helper.input.validationIdentificationNumber(identityNumber)
	validation.status ? next() : next(validation.error)
}

// const validateTicketTitleInput = (req, res, next) => {
// 	const { title } = req.body
// 	const validation = Helper.input.validationTicketTitle(title)
// 	validation.status ? next() : next(validation.error)
// }

const validateUserRolesInput = (req, res, next) => {
	const { roleIds } = req.body
	if (!roleIds && roleIds.length === 0) {
		return next(createErrorWithObject(ERROR.NULL_ROLE))
	} else {
		return next()
	}
}



module.exports = {
	validatePhoneNumberIsUnique,
	validatePhoneNumberInput,
	validateSurnameInput,
	validateNameInput,
	validateEmailInput,
	validateUserExistByEmail,
	validatePasswordInput,
	validateUserNotExistByEmail,
	validateIdentyNumber,
	// validateTicketTitleInput,
	validateUserRolesInput,
	validateAddressInformationInput,
	validateTicketTypeNameInput,

}
