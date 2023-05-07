const riders = require('../models/rider');
const providers = require('../models/provider');

async function addRoleID (req, res, next) {
	if (req.user) {
		const {username, role} = req.user;

		if (role === 'rider') {
			const user = await riders.findOne({email: username});
			req.session.userDet = user;
			req.session.userRoleID = user.id;
		}

		else if (role === 'provider') {
			const user = await providers.findOne({email: username});
			req.session.userDet = user;
			req.session.userRoleID = user.id;
		}
	}

	next();
}

module.exports = {
	addRoleID,
}