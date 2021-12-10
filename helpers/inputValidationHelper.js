const min5Max50Length = new RegExp(/^.{5,50}$/)
const { createErrorWithObject } = require('./errorHelper')
const { ERROR } = require('../constants/error')
const { TICKET_PURPOSE } = require('../constants/constants')
const min10Max500Length = new RegExp(/^.{10,500}$/)
const length11 = new RegExp('^(?=.{11}$)')
const min2Max25Length = new RegExp('^(?=.{2,25}$)')
let specialCharacter = new RegExp('^(?=.[!@#$%^&])')

const validationName = name => {
	let letter = new RegExp('^[a-zA-Z]+$')
	let maxLength = new RegExp('^(?=.{1,25}$)')
	if (name) {
		// if (!letter.test(name)) {
		// 	return { status: false, error: createErrorWithObject(ERROR.NAME_JUST_LETTER) }
		// } else
		if (!maxLength.test(name)) {
			return {
				status: false,
				error: createErrorWithObject(ERROR.NAME_MAX_LENGTH),
			}
		} else {
			return { status: true }
		}
	} else {
		return {
			status: false,
			error: createErrorWithObject(ERROR.NAME_NOT_FULL),
		}
	}
}

const validateTicketTypeName = name => {
	let maxLength = new RegExp('^(?=.{1,55}$)')
	if (name) {
		if (!maxLength.test(name)) {
			return {
				status: false,
				error: createErrorWithObject(ERROR.NAME_MAX_LENGTH),
			}
		} else {
			return { status: true }
		}
	} else {
		return {
			status: false,
			error: createErrorWithObject(ERROR.NAME_NOT_FULL),
		}
	}
}

// const validationTicketTitle = title => {
// 	let letter = new RegExp('^[a-zA-Z]+$')
// 	let maxLength = new RegExp('^(?=.{1,100}$)')
// 	if (title) {
// 		if (!maxLength.test(title)) {
// 			return {
// 				status: false,
// 				error: createErrorWithObject(ERROR.TITLE_MAX_LENGTH),
// 			}
// 		} else {
// 			return { status: true }
// 		}
// 	} else {
// 		return {
// 			status: false,
// 			error: createErrorWithObject(ERROR.NULL_TITLE),
// 		}
// 	}
// }

const validationEmail = email => {
	let emailControl =
		/^(([^<>()[\]{}'^?\\.,!|//#%*-+=&;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	if (!emailControl.test(email)) {
		return {
			status: false,
			error: createErrorWithObject(ERROR.INVALID_EMAIL),
		}
	} else {
		return { status: true }
	}
}

const validationPassword = password => {
	if (password) {
		let lowerCase = new RegExp('^(?=.*[a-z])')
		let upperCase = new RegExp('^(?=.*[A-Z])')
		let number = new RegExp('^(?=.*[0-9])')
		let length = new RegExp('^(?=.{6,25}$)')
		if (!lowerCase.test(password)) {
			return {
				status: false,
				error: createErrorWithObject(
					ERROR.PASSWORD_MUST_CONTAIN_A_LOWERCASE_LETTER,
					400,
				),
			}
		} else if (!upperCase.test(password)) {
			return {
				status: false,
				error: createErrorWithObject(
					ERROR.PASSWORD_MUST_CONTAIN_A_CAPITAL_LETTER,
					400,
				),
			}
		} else if (!number.test(password)) {
			return {
				status: false,
				error: createErrorWithObject(
					ERROR.PASSWORD_MUST_CONTAIN_A_NUMBER_LETTER,
					400,
				),
			}
		} else if (!length.test(password)) {
			return {
				status: false,
				error: createErrorWithObject(ERROR.PASSWORD_MAX_LENGTH, 400),
			}
		} else {
			return { status: true }
		}
	} else {
		return {
			status: false,
			error: createErrorWithObject(ERROR.NULL_PASSWORD, 400),
		}
	}
}

const validationPhoneNumber = phoneNumber => {
	let regEx = new RegExp('^5(0[5-7]|[3-5]d)d{3}d{4}$')
	if (phoneNumber) {
		if (regEx.test(phoneNumber)) {
			return {
				status: false,
				error: createErrorWithObject(ERROR.INVALID_PHONE_NUMBER),
			}
		} else {
			return { status: true }
		}
	} else {
		return {
			status: false,
			error: createErrorWithObject(ERROR.NULL_PHONE_NUMBER),
		}
	}
}

const validationIdentificationNumber = identityNumber => {
	if (identityNumber) {
		if (!length11.test(identityNumber)) {
			return {
				status: false,
				error: createErrorWithObject(ERROR.WRONG_IDENTIFICATION_NUMBER),
			}
		} else {
			return {
				status: true,
			}
		}
	} else {
		return {
			status: false,
			error: createErrorWithObject(ERROR.NULL_IDENTIFICATION_NUMBER),
		}
	}
}

const validationSurname = surname => {
	if (surname) {
		surname = surname.trim()
		if (!min2Max25Length.test(surname)) {
			return {
				status: false,
				error: createErrorWithObject(ERROR.SURNAME_MAX_LENGTH),
			}
		}
		// else if (specialCharacter.test(surname)) {
		// 	return {
		// 		status: false,
		// 		error: createErrorWithObject(ERROR.SURNAME_JUST_LETTER),
		// 	}
		// }
		else {
			return { status: true }
		}
	} else {
		return {
			status: false,
			error: createErrorWithObject(ERROR.NULL_SURNAME),
		}
	}
}

const validateAddressInformation = (neighborhood, street, addressDescription) => {
	if (neighborhood) {
		if (street) {
			if (addressDescription) {
				return {
					status: true,
				}
			} else {
				return {
					status: false,
					error: createErrorWithObject(ERROR.NULL_ADDRESS_DESCRIPTION),
				}
			}
		} else {
			return {
				status: false,
				error: createErrorWithObject(ERROR.NULL_STREET),
			}
		}
	} else {
		return {
			status: false,
			error: createErrorWithObject(ERROR.NULL_NEIGHBORHOOD),
		}
	}
}

const validateTicketPurpose = purpose => {
	if (purpose) {
		if (Object.values(TICKET_PURPOSE).includes(purpose)) {
			return {
				status: true,
			}
		} else {
			return {
				status: false,
				error: createErrorWithObject(ERROR.INVALID_TICKET_PURPOSE),
			}
		}
	} else {
		return {
			status: false,
			error: createErrorWithObject(ERROR.TICKET_PURPOSE_CANNOT_BE_NULL),
		}
	}
}

module.exports = {
	validationName,
	validationSurname,
	validationEmail,
	validationPassword,
	validationPhoneNumber,
	validationIdentificationNumber,
	// validationTicketTitle,
	validateAddressInformation,
	validateTicketTypeName,
	validateTicketPurpose,
}
