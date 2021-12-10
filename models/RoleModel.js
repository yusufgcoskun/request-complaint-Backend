const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roleSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	modified: {
		type: Date,
		default: Date.now,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

module.exports = mongoose.model('Role', roleSchema)
