const {zipcodeKey} = require('../config');
const axios = require('axios');

async function getZipcodeDetails (zipcode) {
	const requestURL = `https://api.zipcodestack.com/v1/search?codes=${zipcode}&country=in&apikey=${zipcodeKey}`
	let result;
	await axios.get(requestURL).then(res => {
		result = res.data.results[`${zipcode}`][0];
	}).catch(err => {
		result = {error: 'Data could not be verified!'}
	});

	return result;
}

module.exports = {
	getZipcodeDetails,
}