const ticketEmail = (user, ticket) => {
	return {
		from: 'Mezitli Belediyesi <info@mezitli.bel.tr',
		to: user.email,
		subject: 'Talep Ataması',
		text: `
      Mezitli Belediyesi
      Talep Ataması.
    `,
		html: `
      <b>Mezitli Belediyesi</b>
      <br />
      <br />
      <span>
      Sayın ${user.name} ${user.surname} ${ticket.ticketUniqId}  numaralı talep biriminize atanmıştır.
Bilgilerinize sunarız.
     </span>
      <a href="https://mezitli-admin.mezitli.bel.tr">Talepleri görüntülemek için tıklayınız.</a>
      <br />
      <br />
    `,
	}
}

module.exports = {
	ticketEmail,
}
