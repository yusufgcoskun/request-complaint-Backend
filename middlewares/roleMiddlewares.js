const e = require('express')
const { Types } = require('mongoose')
const { ADMIN_ROLE } = require('../constants/constants')
const { ERROR } = require('../constants/error')
const {
	createErrorWithObject,
	createError,
	serverError,
} = require('../helpers/errorHelper')
const RoleModel = require('../models/RoleModel')

const checkNewRoleName = (req, res, next) => {
	const { name } = req.body
	if (name.toLowerCase() === ADMIN_ROLE) {
		return next(createErrorWithObject(ERROR.NOT_CREATE_THIS_ROLE))
	} else {
		RoleModel.findOne({ name })
			.then(role => {
				if (role) {
					return next(createErrorWithObject(ERROR.ROLE_ALREADY_EXIST))
				} else {
					return next()
				}
			})
			.catch(e => next(serverError(e)))
	}
}

const checkRoleIdForFilter = (req,res,next) => {	
	const {roleId} = req.body
	if(roleId){
		if(roleId === "pending"){
			return next()
		}else {
			if(roleId.length === 24 && Types.ObjectId.isValid(roleId)){
				RoleModel.findOne({_id :roleId}).then(role => {
					if(role){
						return next()
					}else {
						return next(createErrorWithObject(ERROR.INVALID_ROLE_ID))
					}
				}).catch(e => next(serverError(e)))
			}else {
				return next(createErrorWithObject(ERROR.INVALID_ROLE_ID))
			}
		}
	}else {
		return next()
	}
}

module.exports = {
	checkNewRoleName,
	checkRoleIdForFilter
}
