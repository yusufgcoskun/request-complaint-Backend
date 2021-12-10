const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Helper = require('../helpers/Helper')
const Middlewares = require('../middlewares/Middlewares')
const Message = require('../models/MessageModel')
const { serverError } = require('../helpers/errorHelper')
const TicketModel = require('../models/TicketModel')
const { sendSmsToTicketOwner } = require('../helpers/smsHelper')

router.post('/:ticketId', Middlewares.createMessage, (req, res, next) => {
	const { attachments, text } = req.body
	Message.create({
		ticketId: req.params.ticketId,
		senderId: res.locals.decoded ? res.locals.decoded._id : null,
		attachments,
		text,
	})
		.then(message => {
			res.send(message)
		})
		.catch(e => next(serverError(e)))
})

router.get('/:ticketId', Middlewares.getMessage, (req, res, next) => {
	const { ticketId } = req.params
	Message.aggregate([
		{
			$match: {
				ticketId: mongoose.Types.ObjectId(ticketId),
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: 'senderId',
				foreignField: '_id',
				as: 'sender',
			},
		},
	])
		.then(messages => {
			res.send(messages)
		})
		.catch(e => next(serverError(e)))
})

module.exports = router
