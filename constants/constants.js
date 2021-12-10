const TICKET_STATUS = {
	OPEN: {
		key: 'OPEN',
		text: 'İşlemde',
	},
	CLOSED: {
		key: 'CLOSED',
		text: 'İptal Edildi',
	},
	COMPLETED: {
		key: 'COMPLETED',
		text: 'Tamamlandı',
	},
	UNKNOWN: {
		key: 'UNKNOWN',
		text: 'Bilinmiyor',
	},
}

const TICKET_STATUS_TEXT = ['İşlemde', 'İptal Edildi', 'Tamamlandı', 'Bilinmiyor']

const ATTACHMENT_TYPES = {
	TICKET: 'Ticket',
	MESSAGE: 'Message',
}

const ADMIN_ROLE = 'admin'

const TICKET_PURPOSE = {
	COMPLAINT: 'complaint',
	PROPOSAL: 'proposal',
}

module.exports = {
	TICKET_STATUS,
	ATTACHMENT_TYPES,
	ADMIN_ROLE,
	TICKET_STATUS_TEXT,
	TICKET_PURPOSE,
}
