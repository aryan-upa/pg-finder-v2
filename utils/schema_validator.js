const {registrationSchema} = require('./validation_schemas');

function validateRegistration (req, res, next) {
	const {email, pass, confirmPass, role} = req.body;
	const {error} = registrationSchema.validate({
		email, pass, confirmPass, role
	});

	if (error) {
		const errors = error.details.map(err => {
			const msg = err.message;
			const at = err.context.label;
			return {msg, at};
		});

		return res.status(406).send({error: true, errors});
	}

	next();
}

module.exports = {
	validateRegistration,
}