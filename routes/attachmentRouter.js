const express = require('express')
const multer = require('multer')
const Attachment = require('../models/AttachmentModel')
const router = express.Router()

const Helper = require('../helpers/Helper')
const { serverError } = require('../helpers/errorHelper')
const Middlewares = require('../middlewares/Middlewares')
const TicketModel = require('../models/TicketModel')
const { ATTACHMENT_TYPES } = require('../constants/constants')
const MessageModel = require('../models/MessageModel')

const getFileName = file => {
	return `${Date.now()}-${Helper.string.stringToUrl(file.originalname)}`
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/attachments')
	},
	filename: (req, file, cb) => {
		cb(null, getFileName(file))
	},
})

const upload = multer({
	storage,
	limits: {
		fileSize: 10 * 1024 * 1024,
	},
})

const uploadAttachment = [upload.single('file')]

router.post('/', uploadAttachment, async (req, res, next) => {
	const file = req.file
	// const path = req.file.path.slice(12)
	// TicketModel.updateOne({_id:ticketId},{$push:{attachments:path}}).then(ticket => {
	res.send(req.file.path.slice(12))
	// }).catch(e => next(serverError(e)))
})

module.exports = router
