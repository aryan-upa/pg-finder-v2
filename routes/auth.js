const express = require('express');
const router = express.Router();
const logins = require('../models/login');
const registrations = require('../models/register');
const {generateValidationKey} = require('../utils/key_generator');
const {sendRegistrationEmail} = require('../utils/mail_sender');
const {validateRegistration} = require('../utils/schema_validator');

/* --------- REGISTRATION --------- */
router.get('/registration', (req, res) => {
	res.status(200).send('registration page');
});

router.post('/registration', validateRegistration, async (req, res) => {
	const {email, pass, role} = req.body;
	const whether_login_present = await logins.findOne({email: email});

	if (whether_login_present)
		return res.status(400).send({error: 'user already exists'});

	const whether_registration_present = await registrations.findOne({email: email});
	if (whether_registration_present)
		await registrations.deleteOne({email: email});

	const validationKey = generateValidationKey();
	await registrations.create({
		email, pass, role, validationKey
	});

	const whether_email_sent = await sendRegistrationEmail(email, validationKey);
	if (!whether_email_sent) {
		console.log('email sending unsuccessful @ ' + Date.now());
		return res.status(500).send({error: 'internal server error, please re-register!'});
	}

	console.log(`email sent @ ${new Date().toISOString()} to email : ${email}.`);
	res.status(200).send({success: 'email sent successfully'});
});

module.exports = router;