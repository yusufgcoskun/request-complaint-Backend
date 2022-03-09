const Ticket = require('../models/TicketModel')
const mongoose = require('mongoose')
const { tikcetTypeAggrageWithPipeline } = require('./aggregateHelper')
const { findUserByRole, getUserEmail } = require('./userHelper')
const { serverError } = require('./errorHelper')
const { reject } = require('bcrypt/promises')
const { TICKET_STATUS } = require('../constants/constants')

const findTicketByTicketId = ticketId => {
	return Ticket.findOne({ _id: ticketId })
}

const defaultRoleLookup = [
	{
		$lookup: {
			from: 'roles',
			localField: 'types.authorizedRoleIds',
			foreignField: '_id',
			as: 'roles',
		},
	},
]

const sendTicketMailToUnit = async (ticket, next) => {
	let emails = []
	await findUserByRole(ticket.type[0].authorizedRoleIds)
		.then(users => {
			emails = getUserEmail(users)
		})
		.catch(e => next(serverError(e)))
	return emails
}

const defaultTicketTypeLookup = [
	{
		$lookup: {
			from: 'tickettypes',
			let: {
				typeIds: '$assignmentAndStatusInformations.typeId',
			},
			pipeline: [
				{
					$match: {
						$expr: {
							$in: ['$_id', '$$typeIds'],
						},
					},
				},
				{
					$project: {
						modified: 0,
						__v: 0,
					},
				},
			],
			as: 'types',
		},
	},
]

const findTicketAndAuthorizedRoles = ticketId => {
	const _id = mongoose.Types.ObjectId.isValid(ticketId)
		? { _id: ticketId }
		: { ticketUniqId: ticketId }

	return Ticket.aggregate([
		{
			$match: mongoose.Types.ObjectId.isValid(ticketId)
				? { _id: mongoose.Types.ObjectId(ticketId) }
				: { ticketUniqId: ticketId },
		},
		{
			$lookup: {
				from: 'tickettypes',
				localField: 'assignmentAndStatusInformations.typeId',
				foreignField: '_id',
				as: 'ticketType',
			},
		},
		{
			$lookup: {
				from: 'tickettypes',
				localField: 'ticketType.rootId',
				foreignField: '_id',
				as: 'rootTicketType',
			},
		},
	])
}

const getDefaultPagination = page => {
	return {
		page,
		limit: 2,
		sort: '-createdAt',
	}
}

const createUniqTicketId = () => {
	return new Promise(async (resolve, reject) => {
		let id = Math.random().toString(10).substr(3, 6)
		let status = false
		while (!status) {
			await Ticket.exists({ ticketUniqId: id })
				.then(exist => {
					if (exist) {
						id = Math.random().toString(10).substr(3, 6)
					} else {
						status = true
					}
				})
				.catch(e => reject(e))
		}
		resolve(id)
	})
}

const getAllTickets = roleIds => {
	return Ticket.aggregate(
		roleIds
			? [
					...defaultTicketTypeLookup,
					{
						$match: {
							'types.authorizedRoleIds': { $in: roleIds },
						},
					},
					...defaultRoleLookup,
					{
						$sort: { createdAt: -1 },
					},
			  ]
			: [
					...defaultTicketTypeLookup,
					...defaultRoleLookup,
					{
						$sort: { createdAt: -1 },
					},
			  ],
	)
}

const checkAndGetTicketStatus = assignmentAndStatusInformations => {
	return assignmentAndStatusInformations.every(
		s => s.status === TICKET_STATUS.COMPLETED.key,
	)
		? TICKET_STATUS.COMPLETED.key
		: assignmentAndStatusInformations.every(
				s => s.status === TICKET_STATUS.CLOSED.key,
		  )
		? TICKET_STATUS.CLOSED.key
		: TICKET_STATUS.OPEN.key
}

const getNewAssignments = logs => {
	if (logs) {
		const typeIds = []
		if (logs.length === 1) {
			const newLog = logs[0]
			newLog.assignmentAndStatusInformations.map(nw => {
				typeIds.push(nw.typeId)
			})
		} else {
			const length = logs.length
			const newLog = logs[length - 1]
			const oldLog = logs[length - 2]
			newLog.assignmentAndStatusInformations.map(nw => {
				if (
					!oldLog.assignmentAndStatusInformations.some(ol => ol.typeId === nw.typeId)
				) {
					typeIds.push(nw.typeId)
				}
			})
		}
		return typeIds
	}
	return []
}

const getTicketById = ticketId => {
	return Ticket.aggregate([
		{
			$match: mongoose.Types.ObjectId.isValid(ticketId)
				? { _id: mongoose.Types.ObjectId(ticketId) }
				: { ticketUniqId: ticketId },
		},
		tikcetTypeAggrageWithPipeline,
		...defaultRoleLookup,
	])
}

const getTicketByType = typeId => {
	return Ticket.find({ typeId })
}

const checkUserAuthrizedForTicket = (ticket, userRoleIds) => {
	let ticketAuthorizedRoleIds = []
	let isAuthorized = false
	ticket.ticketType.map(ticketType => {
		ticketAuthorizedRoleIds.push(...ticketType.authorizedRoleIds)
	})
	ticket.rootTicketType.map(rootTicketType => {
		ticketAuthorizedRoleIds.push(...rootTicketType.authorizedRoleIds)
	})
	userRoleIds.map(roleId => {
		ticketAuthorizedRoleIds.map(id => {
			if (`${roleId}` === `${id}`) {
				isAuthorized = true
			}
		})
	})
	return isAuthorized
}

const getFilterQueryByFilters = (filters, userRoleIds) => {
	let filterQuerys = {}
	if (filters.startDate) {
		let startDate = new Date(filters.startDate).setHours(3, 0, 0, 0)
		filterQuerys = { createdAt: { $gte: new Date(startDate) }, ...filterQuerys }
	}
	if (filters.endDate) {
		let endDate = new Date(filters.endDate).setHours(23, 59, 59, 0)
		filterQuerys = { createdAt: { $lte: new Date(endDate) }, ...filterQuerys }
	}
	if (filters.startDate && filters.endDate) {
		let startDate = new Date(filters.startDate).setHours(3, 0, 0, 0)
		let endDate = new Date(filters.endDate).setHours(23, 59, 59, 0)
		filterQuerys = {
			...filterQuerys,
			createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
		}
	}
	if (filters.status) {
		filterQuerys = { ...filterQuerys, status: filters.status }
	}
	if (filters.roleId && filters.roleId !== 'pending') {
		filterQuerys = {
			...filterQuerys,
			typeIds: { $ne: [] },
		}
	}
	if (filters.roleId === 'pending') {
		filterQuerys = {
			...filterQuerys,
			typeIds: [],
		}
	}

	if (filters.identityNumber) {
		filterQuerys = { ...filterQuerys, identityNumber: filters.identityNumber }
	}
	if (filters.ticketNumber) {
		filterQuerys = { ...filterQuerys, ticketUniqId: filters.ticketNumber }
	}
	return filterQuerys
}

const findfilteredTickets = (filters, userRoleIds) => {
	let aggregate = [
		...defaultTicketTypeLookup,
		{
			$addFields: {
				typeIds: '$assignmentAndStatusInformations.typeId',
			},
		},
		!userRoleIds
			? { $match: getFilterQueryByFilters(filters, userRoleIds) }
			: {
					$match: {
						...getFilterQueryByFilters(filters, userRoleIds),
						$or: [
							{
								'types.authorizedRoleIds': { $in: userRoleIds },
							},
							{
								types: [],
							},
						],
					},
			  },
	]
	if (filters.roleId && filters.roleId !== 'pending') {
		aggregate = [
			...aggregate,
			{
				$addFields: {
					authorizedRoleIds: {
						$reduce: {
							input: '$types.authorizedRoleIds',
							initialValue: [],
							in: { $concatArrays: ['$$value', '$$this'] },
						},
					},

					filterRoleId: mongoose.Types.ObjectId(filters.roleId),
				},
			},
			{
				$match: {
					$expr: {
						$in: ['$filterRoleId', '$authorizedRoleIds'],
					},
				},
			},
			...defaultRoleLookup,
			{
				$sort: { createdAt: -1 },
			},
		]
	} else {
		aggregate = [
			...aggregate,
			...defaultRoleLookup,
			{
				$sort: { createdAt: -1 },
			},
		]
	}
	return Ticket.aggregate(aggregate)
}

module.exports = {
	findTicketByTicketId,
	getAllTickets,
	getTicketByType,
	findTicketAndAuthorizedRoles,
	checkUserAuthrizedForTicket,
	getTicketById,
	findfilteredTickets,
	sendTicketMailToUnit,
	createUniqTicketId,
	checkAndGetTicketStatus,
	getNewAssignments,
}
