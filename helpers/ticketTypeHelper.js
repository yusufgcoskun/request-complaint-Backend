const { Types, Mongoose } = require('mongoose')
const TicketTypeModel = require('../models/TicketTypeModel')
const TicketType = require('../models/TicketTypeModel')

const findAllTicketTypes = () => {
	return TicketType.aggregate([
		{
			$match: {
				isDeleted: false,
			},
		},
		{
			$lookup: {
				from: 'roles',
				localField: 'authorizedRoleIds',
				foreignField: '_id',
				as: 'authorizedRoles',
			},
		},
		{
			$lookup: {
				from: 'tickettypes',
				localField: 'rootId',
				foreignField: '_id',
				as: 'rootType',
			},
		},
	])
}

const findTicketTypesAndAuthorizedUsers = ticketTypeIds => {
	return TicketTypeModel.aggregate([
		{
			$match: {
				_id: {
					$in: ticketTypeIds.map(ticketTypeId => Types.ObjectId(ticketTypeId)),
				},
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: 'authorizedRoleIds',
				foreignField: 'roleIds',
				as: 'users',
			},
		},
		{
			$project: {
				users: 1,
			},
		},
	])
}

const findTicketTypeById = ticketTypeId => {
	return TicketTypeModel.aggregate([
		{
			$match: {
				_id: Types.ObjectId(ticketTypeId),
			},
		},
		{
			$lookup: {
				from: 'roles',
				localField: 'authorizedRoleIds',
				foreignField: '_id',
				as: 'authorizedRoles',
			},
		},
	])
}

module.exports = {
	findAllTicketTypes,
	findTicketTypesAndAuthorizedUsers,
	findTicketTypeById,
}
