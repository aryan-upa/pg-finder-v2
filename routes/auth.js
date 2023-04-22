const express = require('express');
const router = express.Router();
const logins = require('../models/login');
const registrations = require('../models/register');
const {generateValidationKey} = require('../utils/key_generator');
const {sendRegistrationEmail} = require('../utils/mail_sender');
const {validateRegistration, validateLogin} = require('../utils/schema_validator');
const riders = require('../models/rider');
const providers = require('../models/provider');
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

	const {email, pass, role, name} = req.body;
	const whether_login_present = await logins.findOne({username: email});

	if (whether_login_present)
		return res.status(400).send({error: 'user already exists'});

	const whether_registration_present = await registrations.findOne({email: email});
	if (whether_registration_present)
		await registrations.deleteOne({email: email});

	const validationKey = generateValidationKey();
	await registrations.create({
		email, pass, name, role, validationKey
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
	if (!req.query.validationKey)
		return res.status(406).send({error: 'Validation Key not provided!'});

	const {validationKey} = req.query;
	const registrationFound = await registrations.findOne({validationKey});

	if (!registrationFound)
		return res.status(404).send({error: 'Invalid Validation Key!'});

	const {email, pass, name, role} = registrationFound;

	const isEmailAlreadyValidated = await logins.findOne({username: email});
	if (isEmailAlreadyValidated) {
		await registrations.deleteOne({validationKey});
		return res.status(401).send({error: 'Email already registered!'});
	}

	const createdLogin = await logins.register(new logins({ username: email, name: name, role: role }), pass);

	if (!createdLogin)
		res.status(500).send({error: 'Internal Server Error, please try again!'});

	await registrations.deleteOne({validationKey});
	res.status(200).send({success: 'account created successfully, now you can login with your credentials'});

	const newUser = {email: email, name: name};

	if (role === 'rider')
		await riders.create(newUser);

	else if (role === 'provider')
		await providers.create(newUser);

	else
		console.log('could not create profile, role not available ' + role);

	console.log('Account successfully created for user : ' + email);
});

/* --------- LOGIN & LOGOUT --------- */

router.get('/login', (req, res) => {
	res.send('login page');
});

router.post('/login', validateLogin, async (req, res, next) => {
	const {email} = req.body;
	const user = await logins.findOne({username: email});

	let redirectTo = req.session.redirectUrl;

	if (user) {
		const {role, isFilled} = user;

		if (!isFilled) {
			let user;
			if (role === 'rider')
				user = await riders.findOne({email: email});
			else
				user = await providers.findOne({email: email});

			redirectTo = `/${role}/${user.id}/edit`;
		}
	}

		return passport.authenticate('passport-local', {
			successRedirect: redirectTo || '/',
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