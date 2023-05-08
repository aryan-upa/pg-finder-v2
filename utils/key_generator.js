const validationKeyLen = 16;
const paymentKeyLen = 32;
const elements = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

function generateValidationKey () {
	let key = '';

	while (key.length < validationKeyLen)
		key += elements.charAt(Math.floor(Math.random()*elements.length));

	return key;
}

function paymentKeyGenerator () {
	let key = '';

	while (key.length < paymentKeyLen)
		key += elements.charAt(Math.floor(Math.random()*elements.length));

	return key;
}

module.exports = {
	generateValidationKey,
	paymentKeyGenerator,
}