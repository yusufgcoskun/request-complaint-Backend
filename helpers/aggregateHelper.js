const rootTicketTypeAgg = {
	$lookup: {
		from: 'tickettypes',
		localField: 'ticketTypes.rootId',
		foreignField: '_id',
		as: 'rootTicketTypes',
	},
}

const ticketTypeAgg = {
	$lookup: {
		from: 'tickettypes',
		localField: 'assignmentAndStatusInformations.typeId',
		foreignField: '_id',
		as: 'ticketTypes',
	},
}

const tikcetTypeAggrageWithPipeline = {
	$lookup: {
		from: 'tickettypes',
		let: {
			typeIds: '$assignmentAndStatusInformations.typeId',
		},
		pipeline: [
			{
				$addFields: {
					typeIds: '$$typeIds',
				},
			},
			{
				$match: {
					$expr: {
						$in: ['$_id', '$typeIds'],
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
}

module.exports = {
	ticketTypeAgg,
	rootTicketTypeAgg,
	tikcetTypeAggrageWithPipeline,
}
