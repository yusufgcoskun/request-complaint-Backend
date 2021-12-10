const nodemailer = require('nodemailer')
const { ticketEmail } = require('../models/EmailModel')
const TicketTypeModel = require('../models/TicketTypeModel')
const { findTicketTypesAndAuthorizedUsers } = require('./ticketTypeHelper')

const sendEmail = async emailModel => {
	try {
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'info@mezitli.bel.tr',
				pass: 'lrtjqzjatwtuaaic',
			},
			tls: {
				rejectUnauthorized: false,
			},
		})

		const info = await transporter.sendMail(emailModel)
		return { status: true, info }
	} catch (err) {
		return { status: false, err }
	}
}

const sendTicketMail = async (user, ticket) => {
	const emailModel = ticketEmail(user, ticket)
	const sendingResponse = await sendEmail(emailModel)
	return sendingResponse
}

const sendEmailRelevantUsers = (ticketTypeIds, ticket) => {
	let userEmails = []
	return findTicketTypesAndAuthorizedUsers(ticketTypeIds).then(types => {
		for (let j = 0; j < types.length; j++) {
			for (let i = 0; i < types[j].users.length; i++) {
				let user = types[j].users[i]
				sendTicketMail(user, ticket)
			}
		}
	})
}

module.exports = {
	sendEmail,
	sendTicketMail,
	sendEmailRelevantUsers,
}
