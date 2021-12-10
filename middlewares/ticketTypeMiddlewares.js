const { ERROR } = require('../constants/error')
const {
	createErrorWithObject,
	createError,
	serverError,
} = require('../helpers/errorHelper')
const { ticket } = require('../helpers/Helper')
const Helper = require('../helpers/Helper')
const Ticket = require('../models/TicketModel')
const TicketTypeModel = require('../models/TicketTypeModel')
const TicketType = require('../models/TicketTypeModel')

const checkRoleAlreadyExist = async (req, res, next) => {
	const { roleId } = req.body
	const { ticketTypeId } = req.params
	await TicketType.findOne({ _id: ticketTypeId })
		.then(ticketType => {
			if (ticketType.authorizedRoleIds.includes(roleId)) {
				return next(
					createErrorWithObject(ERROR.TICKET_TYPE_ALREADY_INCLUDE_THIS_ROLE),
				)
			} else {
				return next()
			}
		})
		.catch(e => next(serverError(e)))
}

const checkTicketTypesAuthorizedRoles = (req, res, next) => {
	const { authorizedRoleIds } = req.body
	if (!authorizedRoleIds || authorizedRoleIds.length === 0) {
		return next(ERROR.AUTHORIZED_ROLE_IDS_NULL)
	} else {
		return next()
	}
}

const checkTicketTypeAlreadyExists = (req, res, next) => {
	const { name } = req.body
	TicketTypeModel.findOne({ name })
		.then(ticketType => {
			ticketType
				? next(createErrorWithObject(ERROR.TICKET_TYPE_ALREADY_EXISTS))
				: next()
		})
		.catch(e => next())
}

module.exports = {
	checkRoleAlreadyExist,
	checkTicketTypesAuthorizedRoles,
	checkTicketTypeAlreadyExists,
}
