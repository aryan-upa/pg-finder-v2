const validationKeyLen = 16;

function generateValidationKey () {
	const elements = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
	let key = '';

	while (key.length < validationKeyLen)
		key += elements.charAt(Math.floor(Math.random()*elements.length));

	return key;
}

module.exports = {
	generateValidationKey,
}