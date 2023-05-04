const express = require('express');
const router = express.Router();
const logins = require('../models/login');
const registrations = require('../models/register');
const {generateValidationKey} = require('../utils/key_generator');
const {sendRegistrationEmail} = require('../utils/mail_sender');
const {validateRegistration, validateLogin} = require('../middlewares/schema_validator');
const riders = require('../models/rider');
const providers = require('../models/provider');
const passport = require('passport');
const {adminKey, serverURL} = require('../config');

/* --------- REGISTRATION --------- */
router.get('/registration', (req, res) => {
	res.render('user-registration');
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

	let validationKey, validationKeyAlreadyPresent;
	do {
		validationKey = generateValidationKey();
		validationKeyAlreadyPresent = await registrations.findOne({validationKey});
	} while (validationKeyAlreadyPresent)

	await registrations.create({
		email, pass, name, role, validationKey
	});

	const whether_email_sent = await sendRegistrationEmail(email, validationKey);
	if (!whether_email_sent) {
		console.log('email sending unsuccessful @ ' + Date.now());
		return res.status(500).render('error',{error: 'internal server error, please re-register!', code: '500'});
	}

	console.log(`email sent @ ${new Date().toISOString()} to email : ${email}.`);
	res.render('success', {success: 'Please check your email to verify it.'});
});

/* --------- VALIDATION --------- */

router.get('/validate', async (req, res) => {
	if (!req.query.validationKey)
		return res.status(406).send({error: 'Validation Key not provided!'});

	const {validationKey} = req.query;
	const registrationFound = await registrations.findOne({validationKey});

	if (!registrationFound)
		return res.status(404).render('error', {error: 'Invalid Validation Key!', code: 404});

	const {email, pass, name, role} = registrationFound;

	const isEmailAlreadyValidated = await logins.findOne({username: email});
	if (isEmailAlreadyValidated) {
		await registrations.deleteOne({validationKey});
		return res.status(401).render('error', {error: 'Email already registered!', code: 401});
	}

	const createdLogin = await logins.register(new logins({ username: email, name: name, role: role }), pass);

	if (!createdLogin)
		res.status(500).render('error', {error: 'Internal Server Error, please try again!', code: 500});

	await registrations.deleteOne({validationKey});
	res.render('success', {success: 'account created successfully, now you can <a href=' + `${serverURL}/auth/login` + ' >login</a> with your credentials'})

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
	res.render('user-login');
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

			redirectTo = `/${role}/${user.id}/new-user`;
		}
	}

		return passport.authenticate('passport-local', {
			successRedirect: redirectTo || '/',
			failureRedirect: '/auth/login'
		}) (req, res, next);
	}
);

router.get('/admin-create', (req, res) => {
	res.send('admin-login-page');
});

router.post('/admin-create', async (req, res) => {
	const {email, adminKey: providedAdminKey} = req.body;

	if (providedAdminKey !== adminKey)
		return res.status(406).send({error: 'BAD REQUEST, UNAUTHORIZED'});

	const login = await logins.find({email});
	login.role = 'admin';

	await riders.findOneAndDelete({email});
	login.save();

	res.send({success: 'role updated successfully'});
});

router.post('/admin-login', passport.authenticate('local-strategy', {
		failureRedirect: '/auth/admin-login'
	}), (req, res) => {
	res.send({success: 'successfully logged in'});
});

router.get('/logout', (req, res) => {
	req.logout(err => {
		if (err)
			return res.status(500).send({error: 'could not logout! Internal Server Failure!'});
	});

	console.log('user logged out!');
	res.redirect('/');
});

module.exports = router;