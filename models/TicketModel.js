const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.set('debug', true)
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
const { TICKET_PURPOSE } = require('../constants/constants')

const ticketSchema = new Schema({
	ticketUniqId: {
		type: String,
		required: true,
		unique: true,
	},
	assignmentAndStatusInformations: {
		type: [
			{
				_id: false,
				status: {
					type: String,
					required: true,
				},
				typeId: {
					type: Schema.Types.ObjectId,
					default: null,
				},
				roleId: {
					type: Schema.Types.ObjectId,
				},
			},
		],
		default: [],
	},
	ownerName: {
		type: String,
		required: true,
	},
	ownerSurname: {
		type: String,
		required: true,
	},
	phoneNumber: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		default: null,
	},
	identityNumber: {
		type: String,
		default: null,
	},
	addressDescription: {
		type: String,
		default: null,
	},
	neighborhood: {
		type: String,
		required: true,
	},
	street: {
		type: Object,
		required: true,
	},
	apartmentNo: {
		type: String,
		default: null,
	},
	// title: {
	// 	type: String,
	// 	// required: true,
	// },
	explanation: {
		type: String,
		required: true,
	},
	attachments: {
		type: [String],
		default: [],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	modifier: {
		type: Schema.Types.ObjectId,
		default: null,
	},
	modified: {
		type: Date,
		default: null,
	},
	creatorId: {
		type: Schema.Types.ObjectId,
		default: null,
	},
	modifiedIp: {
		type: String,
		//TODO ???
	},
	purpose: {
		type: String,
		default: null
	},
	status: {
		type: String,
		default: 'OPEN',
	},
	logs: {
		type: [Object],
		default: [],
	},
})

ticketSchema.plugin(aggregatePaginate)

module.exports = mongoose.model('Ticket', ticketSchema)
