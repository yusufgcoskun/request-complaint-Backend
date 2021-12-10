const { default: Axios } = require('axios')
const { SMS_SERVICE } = require('../constants/config')
const { TICKET_STATUS } = require('../constants/constants')

const sendSmsToTicketOwner = (phoneNumber, text) => {
	text = encodeURI(text)
	return Axios.post(
		`http://xml.ttmesaj.com/SendSMS/SendSMSURL.aspx?un=${SMS_SERVICE.USERNAME}&pw=${SMS_SERVICE.PASSWORD}&msg=${text}&orgn=${SMS_SERVICE.ORIGIN}&list=${phoneNumber}&sd=0`,
	)
}

const createTextByTicketStatus = ticket => {
	if (ticket.status === TICKET_STATUS.CLOSED.key) {
		return `Sayın ${ticket.ownerName} ${ticket.ownerSurname} ${ticket.ticketUniqId} numaralı talebiniz iptal edildi.`
	}
	if (ticket.status === TICKET_STATUS.COMPLETED.key) {
		return `Sayın ${ticket.ownerName} ${ticket.ownerSurname} ${ticket.ticketUniqId} numaralı talebiniz tamamlandı.`
	}
}

const createTextByTicketType = ticket => {
	return `${ticket.ticketUniqId} numaralı talebiniz ilgili birime atandı.`
}

const createTextForMessageAlert = ticket => {
	return `${ticket.ticketUniqId} numaralı talebinize ilgili birimden cevap verildi.`
}

const createTextForTicketCreation = ticket => {
	return `Sayın ${ticket.ownerName} ${ticket.ownerSurname} ${ticket.ticketUniqId} numaralı talebiniz oluşturuldu. Talebinizin güncel durumunu https://mezitli.bel.tr/mezitli-halk-masasi/ adresinden takip edebilirsiniz.
	Sağlıklı günler dileriz.`
}

module.exports = {
	sendSmsToTicketOwner,
	createTextByTicketStatus,
	createTextByTicketType,
	createTextForMessageAlert,
	createTextForTicketCreation,
}
