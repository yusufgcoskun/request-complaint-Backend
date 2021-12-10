const { ADMIN_ROLE } = require('../constants/constants')
const RoleModel = require('../models/RoleModel')

const getAdminRole = () => {
	return RoleModel.findOne({ name: ADMIN_ROLE })
}

module.exports = {
	getAdminRole,
}
