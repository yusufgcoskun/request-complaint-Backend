const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
	ticketId: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	// type: {
	//   type: String,
	//   required: true,
	// },
	senderId: {
		type: Schema.Types.ObjectId,
		default: null,
	},
	attachments: {
		type: [String],
		default: [],
	},
	text: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

module.exports = mongoose.model('Message', messageSchema)
