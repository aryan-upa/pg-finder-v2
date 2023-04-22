const {registrationSchema, loginSchema} = require('../utils/validation_schemas');

/* UTILITY FUNCTION TO GET ERROR MESSAGES */

function errorModifier (error) {
	return error.details.map(err => {
		const msg = err.message;
		const at = err.context.label;
		return {msg, at};
	});
}

/* VALIDATION FUNCTIONS */

function validateRegistration (req, res, next) {
	const {email, pass, confirmPass, role, name} = req.body;
	const {error} = registrationSchema.validate({
		email, pass, confirmPass, role, name
	});

	if (error) {
		const errors = errorModifier(error);
		return res.status(406).send({error: true, errors});
	}

	next();
}

function validateLogin (req, res, next) {
	const {email, pass} = req.body;
	const {error} = loginSchema.validate({
		email, pass
	});

	if (error) {
		const errors = errorModifier(error);
		return res.status(406).send({error: true, errors});
	}

	next();
}

module.exports = {
	validateRegistration,
	validateLogin,
}