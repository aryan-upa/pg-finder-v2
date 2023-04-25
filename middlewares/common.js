const riders = require('../models/rider');
const providers = require('../models/provider');

async function addRoleID (req, res, next) {
	if (req.user) {
		if (req.session.userRoleID)
			next();

		const {username, role} = req.user;

		if (role === 'rider') {
			req.session.userRoleID = (await riders.findOne({email: username})).id;
		}
		else if (role === 'provider')
			req.session.userRoleID = (await providers.findOne({email: username})).id;
	}

	next();
}

module.exports = {
	addRoleID,
}