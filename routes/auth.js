const express = require('express');
const router = express.Router();
const logins = require('../models/login');
const registrations = require('../models/register');
const {generateValidationKey} = require('../utils/key_generator');
const {sendRegistrationEmail} = require('../utils/mail_sender');
const {validateRegistration} = require('../utils/schema_validator');
const passport = require('passport');

/* --------- REGISTRATION --------- */
router.get('/registration', (req, res) => {
	res.status(200).send('registration page');
});

router.post('/registration', validateRegistration, async (req, res) => {
	if (req.user)
		req.logout(err => {
			if (err)
				console.log('could not log out for registration due to ' + err);
		});

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

/* --------- VALIDATION --------- */

router.get('/validation', async (req, res) => {
	const {validationKey} = req.query;
	const registrationFound = await registrations.findOne({validationKey});

	if (!registrationFound)
		return res.status(404).send({error: 'Validation Key not found!'});

	const {email, pass, role} = registrationFound;

	const isEmailAlreadyValidated = await logins.findOne({email});
	if (isEmailAlreadyValidated) {
		await registrations.deleteOne({validationKey});
		return res.status(401).send({error: 'Email already registered!'});
	}

	const createdLogin = await logins.register(new logins({ username: email, role: role }), pass);

	if (!createdLogin)
		res.status(500).send({error: 'Internal Server Error, please login again!'});

	await registrations.deleteOne({validationKey});
	res.status(200).send({success: 'account created, now you can login with your credentials'});
	console.log('Account successfully created for user : ' + email);
});

/* --------- LOGIN --------- */

router.get('/login', (req, res) => {
	res.send('login page');
});

router.post(
	'/login', (req, res, next) => {
		return passport.authenticate('passport-local', {
			successRedirect: req.session.redirectUrl || '/',
			failureRedirect: '/auth/login'
		}) (req, res, next);
	}
);


router.get('/logout', (req, res) => {
	req.logout(err => {
		if (err)
			return res.status(500).send({error: 'could not logout! Internal Server Failure!'});
	});

	console.log('user logged out!');
	res.redirect('/');
});

module.exports = router;