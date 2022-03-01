const ERROR = {
	INVALID_NAME: {
		message: 'Geçersiz isim !',
		code: 'invalid-name',
		status: 400,
	},
	TICKET_NOT_OPEN: {
		message: 'İşlemde olmayan bir talebi güncelleyemezsiniz.',
		code: 'ticket-not-open',
		status: 400,
	},
	NULL_ADDRESS_DESCRIPTION: {
		message: 'Adres açıklaması boş bırakılamaz!',
		code: 'null-address-description',
		status: 400,
	},
	NULL_NEIGHBORHOOD: {
		message: 'Mahalle boş bırakılamaz!',
		code: 'null-neighborhood',
		status: 400,
	},
	NULL_STREET: {
		message: 'Sokak boş bırakılamaz!',
		code: 'null-street',
		status: 400,
	},
	NULL_TITLE: {
		message: 'Talep başlığı boş bırakılamaz!',
		code: 'null-title',
		status: 400,
	},
	INVALID_ROLE_ID: {
		message: 'Geçersiz belediye birimi',
		code: 'invalid-role-id',
		status: 400,
	},
	TICKET_TYPE_ALREADY_INCLUDE_THIS_ROLE: {
		message: 'Talep tipi bu rolü zaten içeriyor.',
		code: 'ticket-type-already-include-this-role',
		status: 400,
	},
	ROLE_ALREADY_EXIST: {
		message: 'Bu isimli bir rol zaten var.',
		code: 'role_already_exist',
		status: 400,
	},
	//TODO name
	NOT_CREATE_THIS_ROLE: {
		message: 'Bu isimde bir rol yaratamazsın!',
		code: 'not-create-this-role',
		status: 400,
	},
	AUTHORIZED_ROLE_IDS_NULL: {
		message: 'Yetkili rolü olmak zorunda!',
		code: 'authorized-role-ids-null',
		status: 400,
	},
	USER_EMAIL_NOT_REGISTERED: {
		message: 'Bu e-posta adresine kayıtlı kullanıcı bulunamadı',
		code: 'user-email-not-registered',
		status: 400,
	},
	INVALID_PASSWORD: {
		message: 'Geçersiz parola, lütfen geçerli bir parola giriniz',
		code: 'invalid-password',
		status: 400,
	},
	WRONG_PASSWORD: {
		message: 'Hatalı Parola',
		code: 'wrong-password',
		status: 400,
	},
	DELETE_FAILED: {
		message: 'Silme işlemi başarısız!',
		code: 'delete-failed',
		status: 400,
	},
	NULL_PASSWORD: {
		message: 'Parola boş bırakılamaz !',
		code: 'null-password',
		status: 400,
	},
	NULL_EMAIL: {
		message: 'Email boş bırakılamaz',
		code: 'null-email',
		status: 400,
	},
	PASSWORD_MUST_CONTAIN_A_LOWERCASE_LETTER: {
		message: 'Parola en az bir kücük harf icermelidir!',
		code: 'password-must-contain-a-lowercase-letter',
		status: 400,
	},
	PASSWORD_MUST_CONTAIN_A_CAPITAL_LETTER: {
		message: 'Parola en az bir büyük harf içermelidir!',
		code: 'password-must-contain-a-capital-letter',
		status: 400,
	},
	PASSWORD_MUST_CONTAIN_A_NUMBER_LETTER: {
		message: 'Parola en az bir sayı içermelidir!',
		code: 'password-must-contain-a-number-letter',
		status: 400,
	},
	PASSWORD_MAX_LENGTH: {
		message: 'Parola uzunluğu 6 karakter ile 25 karakter arasında olmalıdır!',
		code: 'password-max-length',
		status: 400,
	},
	SAME_PASSWORD: {
		message: 'Parolalar aynı olamaz!',
		code: 'same-password',
		status: 400,
	},
	INVALID_SURNAME: {
		message: 'Geçersiz soyad !',
		code: 'invalid-surname',
		status: 400,
	},
	REPORT_NOT_FOUND: {
		message: 'Herhangi bir şikayet bulunamadı',
		code: 'report-not-found',
		status: 400,
	},
	SURNAME_NOT_FULL: {
		message: 'Tam soyad girmek zorundasınız !',
		code: 'surname-not-full',
		status: 400,
	},
	MESSAGE_MAX_LENGTH: {
		message: 'Mesaj en az 3 fazla 2000 karakter içerebilir!',
		code: 'message-max-length',
		status: 400,
	},
	MESSAGE_NULL: {
		message: 'Mesaj boş bırakılamaz!',
		code: 'message-null',
		status: 400,
	},

	INVALID_PHONE_NUMBER: {
		message: 'Geçersiz telefon numarası !',
		code: 'invalid-phone-number',
		status: 400,
	},
	USER_NOT_CONFIRMED: {
		message: 'Kayıt işleminizi tamamlamalısınız!',
		code: 'user-not-confirmed',
		status: 401,
	},
	INVALID_TOKEN: {
		message: 'Geçersiz token !',
		code: 'invalid-token',
		status: 400,
	},
	INVALID_TICKET_STATUS: {
		message: 'Geçersiz talep durumu!',
		code: 'invalid-ticket-status',
		status: 400,
	},
	WRONG_IDENTIFICATION_NUMBER: {
		message:
			'Girilen TC kimlik numarası geçersiz. TC kimlik numarası 11 karakter olmalıdır.',
		code: 'wrong-identification-number',
		status: 400,
	},
	NULL_NAME: {
		message: 'İsim boş bırakılamaz !',
		code: 'null-name',
		status: 400,
	},
	NULL_IDENTIFICATION_NUMBER: {
		message: 'Kimlik numaranızı girmelisiniz!',
		code: 'null-identification-number',
		status: 400,
	},
	NULL_SURNAME: {
		message: 'soyad boş bırakılamaz !',
		code: 'null-surname',
		status: 400,
	},
	NULL_PHONE_NUMBER: {
		message: 'Telefon numarası boş bırakılamaz !',
		code: 'null-phone-number',
		status: 400,
	},

	PHONE_NUMBER_ALREADY_EXIST: {
		message: 'Bu telefon numarası kullanılmaktadır.',
		code: 'phone-number-already-exist',
		status: 400,
	},
	UPDATE_FAILED: {
		message: 'Güncelleme başarısız oldu, Lütfen sonra tekrar deneyin.',
		code: 'update-failed',
		status: 400,
	},
	MESSAGE_NOT_FOUND: {
		message: 'Herhangi bir mesaj bulunamadı',
		code: 'message-not-found',
		status: 400,
	},
	MUST_REGISTER_FIRST: {
		message: 'Bu telefon numarasına ait bir kayıt bulunamadı.Lütfen önce kayıt olun',
		code: 'must-register-first',
		status: 400,
	},
	SURNAME_MAX_LENGTH: {
		message: 'Soyad uzunluğu 2 karakter ile 25 karakter arasında olmalıdır.',
		code: 'surname-max-length',
		status: 400,
	},
	TICKET_TITLE_MAX_LENGTH: {
		message: 'Başlık uzunluğu 1 karakter ile 100 karakter arasında olmalıdır.',
		code: 'ticket-title-max-length',
		status: 400,
	},
	SURNAME_JUST_LETTER: {
		message: 'soyad özel karakter içeremez !',
		code: 'surname-just-letter',
		status: 400,
	},
	NAME_JUST_LETTER: {
		message: 'İsim adı özel karakter içeremez !',
		code: 'name-just-letter',
		status: 400,
	},
	TITLE_JUST_LETTER: {
		message: 'Başlık özel karakter içeremez!',
		code: 'title-just-letter',
		status: 400,
	},
	NAME_MAX_LENGTH: {
		message: 'İsim uzunluğu 1 ila 25 karakter arasında olmalıdır',
		code: 'name-max-length',
		status: 400,
	},
	TICKET_TYPE_ALREADY_EXISTS: {
		message: 'Bu talep çeişidi zaten var!',
		code: 'ticket-type-already-exists',
		status: 400,
	},
	INVALID_TICKET_PURPOSE: {
		message: 'Geçersiz başvuru çeşidi!',
		code: 'invalid-ticket-purpose',
		status: 400,
	},
	TITLE_MAX_LENGTH: {
		message: 'Başlık uzunluğu 1 ila 100 karakter arasında olmalıdır',
		code: 'title-max-length',
		status: 400,
	},
	NAME_NOT_FULL: {
		message: 'Tam isim girmek zorundasınız !',
		code: 'name-not-full',
		status: 400,
	},
	PHONE_NUMBER_NOT_FOUND: {
		message: 'Bu telefon numarası kayıtlı değil!',
		code: 'phone-number-not-found',
		status: 400,
	},
	USER_NOT_ADMIN: {
		message: 'Bu işlem için admin yetkisi gerekli!',
		code: 'user-not-admin',
		status: 400,
	},
	TYPE_NOT_FOUND: {
		message: 'Tür bulunamadı !',
		code: 'type-not-found',
		status: 400,
	},
	USER_ID_NULL: {
		message: 'Kullanıcı kimlikleri boş bırakılamaz!',
		code: 'user-id-null',
		status: 400,
	},
	USER_EXIST_REGISTERED: {
		message: 'Kullanıcı zaten kayıt olmuş!',
		code: 'user-exist-registered',
		status: 400,
	},
	USER_ALREADY_MEMBER: {
		message: 'Kullanıcı zaten bu takımın bir üyesi',
		code: 'user-already-member',
		status: 400,
	},
	BLOCK_SPECIFIC_USERNAME: {
		message: 'Kullanıcı adı ayarlar olamaz!',
		code: 'block-specific-username',
		status: 401,
	},
	USER_NOT_FOUND: {
		message: 'Kullanıcı bulunamadı.',
		code: 'user-not-found',
		status: 404,
	},
	NULL_ROLE: {
		message: 'Kullanıcı rolü boş bırakılamaz!',
		code: 'nul-role',
		status: 400,
	},
	SERVER_ERROR: {
		message: 'Sunucu hatası',
		code: 'server-error',
		status: 500,
	},
	INVALID_EMAIL: {
		message: 'Lütfen geçerli bi e-mail giriniz!',
		code: 'invalid-email',
		status: 400,
	},
	EMAIL_ALREADY_EXIST: {
		message: 'Bu e-mail zaten kullanılmakta!',
		code: 'email-already-exist',
		status: 400,
	},

	USER_NOT_AUTHORIZED: {
		message: 'Bu işlem için yetkili değilsiniz!',
		code: 'user-not-authorized',
		status: 400,
	},
	NOT_HAVE_ISSUE: {
		message: 'Şuan herhangi bir sorunuz bulunmamaktadır!',
		code: 'not-have-issue',
		status: 400,
	},
	ISSUE_NOT_FOUND: {
		message: 'Soru bulunamadı!',
		code: 'issue-not-found',
		status: 400,
	},
	ISSUE_TITLE_LENGTH: {
		message: 'Soru başlığı en az 2 en fazla 25 karakter içerebilir.',
		code: 'issue-title-length',
		status: 400,
	},
	ISSUE_TITLE_OR_CONTENT_NULL: {
		message: 'Soru başlığını ve içeriğini boş bırakamazsınız!',
		code: 'issue-title-or-content-null',
		status: 400,
	},
	ISSUE_CONTENT_LENGTH: {
		message: 'Soru içeriği en az 50 karakter olmalıdır!',
		code: 'issue-content-length',
		status: 400,
	},
	TICKET_CLOSED: {
		message: 'Bu bilet kapalı.',
		code: 'ticket-closed',
		status: 400,
	},
	TICKET_ID_NULL: {
		message: 'Lütfen bir talep seçiniz.',
		code: 'ticket-id-null',
		status: 400,
	},
	INVALID_TICKET_ID: {
		message: 'Geçersiz Talep numarası.',
		code: 'invalid-ticket-id',
		status: 400,
	},
	TICKET_NOT_FOUND: {
		message: 'Böyle bir talep bulunamadı.',
		code: 'ticket-not-found',
		status: 400,
	},
	// TICKET_STATUS_ALREADY_SAME : {
	//   message : "Bilet durumu zaten "
	// }
}

module.exports = {
	ERROR,
}
