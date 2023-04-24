const {zipcodeKey} = require('../config');

async function getZipcodeDetails (zipcode) {
	const requestURL = `https://api.zipcodestack.com/v1/search?codes=${zipcode}&country=in&apikey=${zipcodeKey}`
	const res = await fetch(requestURL);

	if (res.results)
		return res.results[zipcode][0];

	return {error: 'could not verify results'}
}

module.exports = {
	getZipcodeDetails,
}