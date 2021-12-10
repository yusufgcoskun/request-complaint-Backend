const { TICKET_STATUS, TICKET_STATUS_TEXT } = require('../constants/constants')
const { ERROR } = require('../constants/error')
const {
	createErrorWithObject,
	createError,
	serverError,
} = require('../helpers/errorHelper')
const { ticket } = require('../helpers/Helper')
const Helper = require('../helpers/Helper')
const Ticket = require('../models/TicketModel')
const UserModel = require('../models/UserModel')

const checkTicketStatus = (req, res, next) => {
	const { ticketId } = req.params || req.body
	const { status } = req.body || req.body
	if (Object.keys(TICKET_STATUS).includes(status)) {
		Ticket.findOne({ _id: ticketId })
			.then(ticket => {
				if (ticket.status === TICKET_STATUS.CLOSED.text) {
					return next(createErrorWithObject(ERROR.TICKET_CLOSED))
				} else {
					if (ticket.status === TICKET_STATUS.COMPLETED.text) {
						return next(
							createError(
								`Bilet durumu zaten tamamlanmış`,
								400,
								`Ticket status already complated`,
							),
						)
					} else {
						return next()
					}
				}
			})
			.catch(e => next(serverError(e)))
	} else {
		return next(createErrorWithObject(ERROR.INVALID_TICKET_STATUS))
	}
}

const checkIfTicketCanBeUpdated = (req, res, next) => {
	const { ticketId } = req.params
	Ticket.findOne({ _id: ticketId }).then(ticket => {
		if (ticket) {
			if (ticket.status === TICKET_STATUS.OPEN.key) {
				return next()
			} else {
				return next(ERROR.TICKET_NOT_OPEN)
			}
		} else {
			return next(createErrorWithObject(ERROR.TICKET_NOT_FOUND))
		}
	})
}

const checkTicketIdAndAuthorizedUser = async (req, res, next) => {
	const ticketId = req.body.ticketId || req.params.ticketId
	if (res.locals.decoded) {
		const { _id } = res.locals.decoded
		await UserModel.findOne({ _id })
			.then(async user => {
				await Helper.ticket
					.findTicketAndAuthorizedRoles(ticketId)
					.then(ticket => {
						if (ticket[0]) {
							const status = Helper.ticket.checkUserAuthrizedForTicket(
								ticket[0],
								user.roleIds,
							)
							if (status) {
								res.locals.ticket = ticket
								return next()
							} else {
								return next(createErrorWithObject(ERROR.USER_NOT_AUTHORIZED))
							}
						} else {
							return next(createErrorWithObject(ERROR.TICKET_NOT_FOUND))
						}
					})
					.catch(e => next(serverError(e)))
			})
			.catch(e => next(serverError(e)))
	} else {
		return next()
	}
}

const checkTicketId = (req, res, next) => {
	const ticketId = req.params.ticketId || req.body.ticketId
	Helper.ticket.findTicketByTicketId(ticketId).then(ticket => {
		if (ticket) {
			res.locals.ticket = ticket
			return next()
		} else {
			return next(createErrorWithObject(ERROR.TICKET_NOT_FOUND))
		}
	})
}

module.exports = {
	checkTicketStatus,
	checkTicketIdAndAuthorizedUser,
	checkTicketId,
	checkIfTicketCanBeUpdated,
}
