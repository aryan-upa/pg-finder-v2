function isRoleAdmin (req, res, next) {
	const current = req.user;

	if (!current)
		return res.status(401).send({error: 'Unauthorized access!'});

	if (current.role !== 'admin')
		return res.status(403).send({error: 'Invalid access!'});

	next();
}

function isRoleRider (req, res, next) {
	const current = req.user;

	if (!current)
		return res.status(401).send({error: 'Unauthorized access!'});

	if (current.role !== 'rider')
		return res.status(403).send({error: 'Invalid access!'});

	next();
}

function isRoleProvider (req, res, next) {
	const current = req.user;

	if (!current)
		return res.status(401).send({error: 'Unauthorized access!'});

	if (current.role !== 'provider')
		return res.status(403).send({error: 'Invalid access!'});

	next();
}

function isRoleAdminOrRider (req, res, next) {
	const current = req.user;

	if (!current)
		return res.status(401).send({error: 'Unauthorized access!'});

	if (current.role !== 'admin' && current.role !== 'rider')
		return res.status(403).send({error: 'Invalid access!'});

	next();
}

function isRoleAdminOrProvider (req, res, next) {
	const current = req.user;

	if (!current)
		return res.status(401).send({error: 'Unauthorized access!'});

	if (current.role !== 'admin' && current.role !== 'provider')
		return res.status(403).send({error: 'Invalid access!'});

	next();
}

function isLoggedIn (req, res, next) {
	req.session.redirectUrl = req.originalUrl;

	if (!req.isAuthenticated())
		return res.redirect('/auth/login');

	next();
}

function isAdminLoggedIn (req, res, next) {
	if (!req.isAuthenticated())
		return res.redirect('/auth/admin-login');

	next();
}

function isCurrentUserOrAdmin (req, res, next) {
	const {id} = req.params;

	if (req.user.role === 'admin')
		return next();

	if (req.session.userRoleID === id)
		return next();

	res.status(403).send({error: 'Not Authorized!'});
}

function isCurrentUser (req, res, next) {
	const {id} = req.params;

	if (req.session.userRoleID === id)
		return next();

	res.status(403).send({error: 'Not Authorized'});
}

module.exports = {
	isRoleAdmin,
	isRoleRider,
	isRoleProvider,
	isRoleAdminOrRider,
	isRoleAdminOrProvider,
	isLoggedIn,
	isCurrentUserOrAdmin,
	isCurrentUser,
	isAdminLoggedIn,
}