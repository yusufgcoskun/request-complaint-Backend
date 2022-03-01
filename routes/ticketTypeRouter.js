const TicketType = require('../models/TicketTypeModel')
const Helper = require('../helpers/Helper')
const express = require('express')
const router = express.Router()
const Middlewares = require('../middlewares/Middlewares')
const { serverError } = require('../helpers/errorHelper')
const TicketTypeModel = require('../models/TicketTypeModel')
const { ticketType, ticket } = require('../helpers/Helper')

router.post('/', Middlewares.createTicketType, (req, res, next) => {
	const { rootId, name, authorizedRoleIds } = req.body
	Helper.role
		.getAdminRole()
		.then(adminRole => {
			TicketType.create({
				rootId,
				name,
				authorizedRoleIds: [...authorizedRoleIds, adminRole._id],
			})
				.then(async ticketType => {
					ticketType = await Helper.ticketType.findTicketTypeById(ticketType._id)
					res.send(ticketType[0])
				})
				.catch(e => next(serverError(e)))
		})
		.catch(e => next(serverError(e)))
})

router.get('/', (req, res, next) => {
	Helper.ticketType
		.findAllTicketTypes()
		.then(ticketTypes => {
			res.send(ticketTypes)
		})
		.catch(e => next(serverError(e)))
})

router.put('/:ticketTypeId', Middlewares.updateTicketType, (req, res, next) => {
	const { ticketTypeId } = req.params
	const userIp = req.headers['x-forwarded-for']
	const { authorizedRoleIds, name } = req.body
	const updateObject = {}
	if (authorizedRoleIds) updateObject.authorizedRoleIds = authorizedRoleIds
	if (name) updateObject.name = name

	TicketTypeModel.findByIdAndUpdate(
		ticketTypeId,
		{
			modifiedIp: userIp ? userIp : 'unknown',
			...updateObject,
		},
		{ new: true },
	)
		.populate('authorizedRoles')
		.then(ticketType => {
			res.send(ticketType)
		})
		.catch(e => next(serverError(e)))
})

router.put('/addRole/:ticketTypeId',
	Middlewares.addRoleForTicketType,
	(req, res, next) => {
		const { roleId } = req.body
		const { ticketTypeId } = req.params
		TicketTypeModel.findOneAndUpdate(
			{ _id: ticketTypeId },
			{ $push: { authorizedRoleIds: roleId } },
			{ new: true },
		)
			.then(ticketType => {
				res.send(ticketType)
			})
			.catch(e => next(serverError(e)))
	},
)

router.put('/deleteTicketType/:ticketTypeId',(req, res, next) => {

	const { ticketTypeId } = req.params
	TicketTypeModel.findOneAndDelete({ _id: ticketTypeId },(err,deletedTicketType)=>{
		if(!err){
			console.log(deletedTicketType)
		}
	}).then(user => {
		res.send(user)
	})
	.catch(e => next(serverError(e)))
	
})
module.exports = router
