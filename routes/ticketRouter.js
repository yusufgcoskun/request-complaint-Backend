const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const {
	sendSmsToTicketOwner,
	sendSmsForTicketCreation,
} = require('../helpers/smsHelper')

const Ticket = require('../models/TicketModel')
const Message = require('../models/MessageModel')
const Middlewares = require('../middlewares/Middlewares')
const { serverError } = require('../helpers/errorHelper')
const Helper = require('../helpers/Helper')
const { ticketTypeAgg, rootTicketTypeAgg } = require('../helpers/aggregateHelper')
const { TICKET_STATUS } = require('../constants/constants')
const UserModel = require('../models/UserModel')
const { getAdminRole } = require('../helpers/roleHelper')
const {
	checkAndGetTicketStatus,
	getNewAssignments,
} = require('../helpers/ticketHelper')

router.post('/', Middlewares.createTicket, async (req, res, next) => {
	const uniqId = await Helper.ticket.createUniqTicketId()
	if (res.locals.decoded && res.locals.decoded._id) {
		await Ticket.create({
			...req.body,
			creatorId: res.locals.decoded._id,
			ticketUniqId: uniqId,
		})
			.then(async ticket => {
				await Helper.ticket
					.getTicketById(ticket.ticketUniqId)
					.then(async ticket => {
						await req.app.get('socketIo').emit('newTicket', ticket[0])
						const text = Helper.sms.createTextForTicketCreation(ticket[0])
						await sendSmsToTicketOwner(`9${ticket[0].phoneNumber}`, text)
							.then(smsResult => {
								console.log({ dat: smsResult.data })
							})
							.catch(e => next(serverError(e)))
						res.send(ticket)
						if (req.body.typeId) {
							await Helper.email
								.sendEmailRelevantUsers(req.body.typeId, ticket[0])
								.then()
								.catch(e => next(serverError(e)))
						}
					})
					.catch(e => next(serverError(e)))
			})
			.catch(e => next(serverError(e)))
	} else {
		await Ticket.create({
			...req.body,
			ticketUniqId: uniqId,
		})
			.then(async ticket => {
				await Helper.ticket
					.getTicketById(ticket.ticketUniqId)
					.then(async ticket => {
						await req.app.get('socketIo').emit('newTicket', ticket[0])
						const text = Helper.sms.createTextForTicketCreation(ticket[0])
						await sendSmsToTicketOwner(`9${ticket[0].phoneNumber}`, text)
							.then(smsResult => {
								console.log({ dat: smsResult.data })
							})
							.catch(e => next(serverError(e)))
						res.send(ticket)
					})
					.catch(e => next(serverError(e)))
			})
			.catch(e => next(serverError(e)))
	}
})

router.put(	'/assignmentAndStatusInformations/:ticketId',
	Middlewares.updateTicketAssignmentAndStatusInformations,
	(req, res, next) => {
		const { assignmentAndStatusInformations, sendSms } = req.body
		const { ticketId } = req.params
		const { _id } = res.locals.decoded
		const status = checkAndGetTicketStatus(assignmentAndStatusInformations)
		Ticket.findByIdAndUpdate(
			ticketId,
			{
				assignmentAndStatusInformations,
				status,
				$push: {
					logs: {
						modified: new Date(),
						modifier: mongoose.Types.ObjectId(_id),
						assignmentAndStatusInformations,
					},
				},
				modified: new Date(),
				modifier: mongoose.Types.ObjectId(_id),
			},
			{ new: true },
		)
			.then(async () => {
				await Helper.ticket
					.getTicketById(ticketId)
					.then(async ticket => {
						if (sendSms) {
							console.log({ sendSms })
							if (status !== TICKET_STATUS.OPEN.key) {
								console.log('SMS SENDED FOR STATUS')
								const text = Helper.sms.createTextByTicketStatus(ticket[0])
								await sendSmsToTicketOwner(`9${ticket[0].phoneNumber}`, text)
									.then(smsResult => {
										console.log({ dat: smsResult.data })
									})
									.catch(e => next(serverError(e)))
							} else {
								console.log('SMS SENDED FOR TYPE')
								const text = Helper.sms.createTextByTicketType(ticket[0])
								await sendSmsToTicketOwner(`9${ticket[0].phoneNumber}`, text)
									.then(smsResult => {
										console.log({ dat: smsResult.data })
									})
									.catch(e => next(serverError(e)))
							}
						}
						res.send(ticket[0])
						const typeIds = getNewAssignments(ticket[0].logs)
						Helper.email
							.sendEmailRelevantUsers(typeIds, ticket[0])
							.then()
							.catch(e => next(serverError(e)))
					})
					.catch(e => next(serverError(e)))
			})
			.catch(e => next(serverError(e)))
	},
)

router.put('/updatePurpose/:roleId', (req, res, next) => {

	const { roleId } = req.params
	const dbpurpose = req.body.dbPurpose
	console.log(req.body.dbPurpose)
	
	Ticket.findOneAndUpdate({ _id: roleId }, { purpose: dbpurpose }, { new: true })
	 	.then(role => {
	 		res.send(role)
	 	})
	 	.catch(e => next(serverError(e)))
})

router.get('/', Middlewares.verifyToken, (req, res, next) => {
	const { _id } = res.locals.decoded
	UserModel.findById(_id)
		.then(async user => {
			await getAdminRole()
				.then(async adminRole => {
					const roleIds = user.roleIds.some(id => `${id}` === `${adminRole._id}`)
						? null
						: user.roleIds
					await Helper.ticket
						.getAllTickets(roleIds)
						.then(tickets => {
							res.send(tickets)
						})
						.catch(e => next(serverError(e)))
				})
				.catch(e => next(serverError(e)))
		})
		.catch(e => next(serverError(e)))
})

// Ticket.updateMany({}, { assignmentAndStatusInformations: [] }).exec()

router.get('/:ticketId', (req, res, next) => {
	const { ticketId } = req.params
	Helper.ticket
		.getTicketById(ticketId)
		.then(ticket => {
			res.send(ticket)
		})
		.catch(e => next(serverError(e)))
})

router.get(
	'/getTicketByUserRole',
	Middlewares.verifyToken,
	async (req, res, next) => {
		const { _id } = res.locals.decoded
		let roleIds = res.locals.decoded.roleIds
		roleIds = roleIds.map(roleId => mongoose.Types.ObjectId(roleId))
		await Ticket.aggregate([
			ticketTypeAgg,
			rootTicketTypeAgg,
			{
				$match: {
					$or: [
						{ 'rootTicketType.authorizedRoleIds': { $in: roleIds } },
						{ 'ticketTypes.authorizedRoleIds': { $in: roleIds } },
					],
				},
			},
		])
			.then(tickets => {
				res.send(tickets)
			})
			.catch(e => next(serverError(e)))
	},
)

router.get('/getTicketByType/:typeId', Middlewares.verifyToken, (req, res, next) => {
	const { typeId } = req.params
	Helper.ticket
		.getTicketByType(typeId)
		.then(tickets => {
			res.send(tickets)
		})
		.catch(e => next(serverError(e)))
})

router.post(
	'/filter',
	[Middlewares.verifyToken, Middlewares.checkRoleIdForFilter],
	async (req, res, next) => {
		const { roleIds } = res.locals.decoded

		await Helper.ticket
			.findfilteredTickets(
				req.body,
				roleIds.map(r => mongoose.Types.ObjectId(r)),
			)
			.then(tickets => {
				res.send(tickets)
			})
			.catch(e => next(serverError(e)))
	},
)

module.exports = router
