const replaceAll = (string, search, replacement) => {
	return string.split(search).join(replacement)
}

const stringToUrl = function (string) {
	string = string.toLocaleLowerCase('tr-TR')
	string = string.replace(/\s/g, '-').replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '')
	string = replaceAll(string, 'ğ', 'g')
	string = replaceAll(string, 'ü', 'u')
	string = replaceAll(string, 'ş', 's')
	string = replaceAll(string, 'ı', 'i')
	string = replaceAll(string, 'ö', 'o')
	string = replaceAll(string, 'ç', 'c')
	return string
}

module.exports = {
	stringToUrl,
}
