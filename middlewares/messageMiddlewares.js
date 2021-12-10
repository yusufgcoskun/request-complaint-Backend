const { ERROR } = require('../constants/error')
const {
	createErrorWithObject,
	createError,
	serverError,
} = require('../helpers/errorHelper')
const { ticket } = require('../helpers/Helper')
const Helper = require('../helpers/Helper')
const Message = require('../models/MessageModel')
const Ticket = require('../models/TicketModel')


const checkMessageText = (req,res,next) => {
	const {text} = req.body
	if(text){
		return next()
	}else {
		return next(createErrorWithObject(ERROR.MESSAGE_NULL))
	}
}

module.exports= {
	checkMessageText
}