const mongoose = require('mongoose'),
	Schema = mongoose.Schema

const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
mongoose.set('debug', true)

const attachmentSchema = new Schema({
	type: { type: String, required: true },
	contentType: { type: String, required: true },
	name: { type: String, required: true },
	size: { type: Number, required: true },
	ticketId: { type: Schema.Types.ObjectId },
	messageId: { type: Schema.Types.ObjectId },
	createdAt: { type: Date, default: Date.now },
})

attachmentSchema.plugin(aggregatePaginate)

module.exports = mongoose.model('Attachment', attachmentSchema)
