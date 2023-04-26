function convertToArray (variable) {
	if (!Array.isArray(variable))
		return [variable];

	return variable;
}

module.exports = {
	convertToArray,
}