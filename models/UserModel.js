const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
		},
		name : {
			type: String,
			required : true
		},
		surname : {
			type : String,
			required  :true
		},
		password: {
			type: String,
			required: true,
		},
		roleIds: {
			type: [Schema.Types.ObjectId],
			default: [],
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		modified: {
			type: Date,
			default: null,
		},
		modifiedIp: {
			type: String,
			//TODO ???
		},
		deleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
)

userSchema.virtual('userMessageCount', {
	ref: 'Message', // The model to use
	localField: '_id', // Find people where `localField`
	foreignField: 'senderId', // is equal to `foreignField`
	// If `justOne` is true, 'members' will be a single doc as opposed to
	// an array. `justOne` is false by default.
	count: true,
})

userSchema.virtual('roles', {
	ref: 'Role', // The model to use
	localField: 'roleIds', // Find people where `localField`
	foreignField: '_id', // is equal to `foreignField`
	// If `justOne` is true, 'members' will be a single doc as opposed to
	// an array. `justOne` is false by default.
})

module.exports = mongoose.model('User', userSchema)
