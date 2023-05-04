const express = require('express');
const router = express.Router();
const riders = require('../models/rider');
const {isRoleAdmin, isLoggedIn, isCurrentUserOrAdmin, isCurrentUser} = require("../middlewares/role_validator");
const {validateRiderDetails} = require('../middlewares/schema_validator');
const {uploadRiderFiles} = require("../middlewares/file_uploader");
const logins = require('../models/login');

router.use(isLoggedIn);

router.get('/', isRoleAdmin, async (req, res) => {
	const skip = req.query.skip || 0;
	const riderList = await riders.find().skip(skip).limit(10);
	res.send(riderList);
});

router.get('/:id', isCurrentUserOrAdmin, async (req, res) => {
	const {id} = req.params;
	const user = await riders.findOne({_id: id});
	await user.populate(['bookings', 'likes']);
	res.render('rider-dashboard', {user});
});

router.get('/:id/new-user', isCurrentUser, async (req, res) => {
	const {id} = req.params;
	const user = await riders.findOne({_id: id});
	res.render('register-user', {user}); // working properly
});

router.get('/:id/edit', isCurrentUser, async (req, res) => {
	const {id} = req.params;
	const user = await riders.findOne({_id: id});
	res.render('update-user', {user}); // working properly
});

router.patch('/:id',
	isCurrentUser,
	uploadRiderFiles.fields([{name: "profile-pic"}, {name: "covid-cert"}]),
	validateRiderDetails,
	async (req, res) => {
		const {id} = req.params;
		const {email, phone, gender, dob, occupation, emContactName, emContactRelation, emContactPhone} = req.body;

		const user = await riders.findById({_id: id});

		const imageLink = req.files['profile-pic'] ? req.files['profile-pic'][0].path : user.profilePic;
		const covidCertLink = req.files['covid-cert'] ? req.files['covid-cert'][0].path : user.covidCert;

		const updateEmContact = {
			name: emContactName,
			relation: emContactRelation,
			phone: emContactPhone
		};

		await riders.findOneAndUpdate({_id: id}, {
			phone: phone,
			gender: gender,
			dob: dob,
			occupation: occupation,
			profilePic: imageLink,
			covidCert: covidCertLink,
			emergencyContact: updateEmContact
		});

		await logins.findOneAndUpdate({username: email}, {isFilled: true});
		res.send({success: 'Profile Updated!'}); // working properly
});

router.get('/:id/favourites', isCurrentUserOrAdmin, async (req, res) => {
	const {id} = req.params;
	const user = await riders.findOne({_id: id});
	await user.populate('likes');
	const likes = user.likes;
	res.send(likes);
});

router.get('/:id/bookings', isCurrentUserOrAdmin, async (req, res) => {
	const {id} = req.params;
	const user = await riders.findOne({_id: id});
	await user.populate('bookings');
	const bookings = user.bookings;
	res.send(bookings);
});

router.delete('/:id', isRoleAdmin, async (req, res) => {
	const {id} = req.params;
	const info = await riders.deleteOne({_id: id});
	res.send(info);
});

module.exports = router;