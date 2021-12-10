const { text } = require('body-parser')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ticketTypeSchema = new Schema(
	{
		rootId: {
			type: Schema.Types.ObjectId,
			default: null,
		},
		name: {
			type: String,
			required: true,
		},
		authorizedRoleIds: {
			type: [Schema.Types.ObjectId],
			default: [],
		},
		modified: {
			type: Date,
			default: null,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
)

ticketTypeSchema.virtual('authorizedRoles', {
	ref: 'Role', // The model to use
	localField: 'authorizedRoleIds', // Find people where `localField`
	foreignField: '_id', // is equal to `foreignField`
	// If `justOne` is true, 'members' will be a single doc as opposed to
	// an array. `justOne` is false by default.
})

module.exports = mongoose.model('TicketType', ticketTypeSchema)
