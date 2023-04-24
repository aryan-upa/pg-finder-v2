const express = require('express');
const router = express.Router();
const riders = require('../models/rider');
const {isRoleAdmin, isLoggedIn, isCurrentUserOrAdmin, isCurrentUser} = require("../middlewares/role_validator");
const {validateRiderDetails} = require('../middlewares/schema_validator');
const {uploadFile} = require("../utils/file_uploader");

router.use(isLoggedIn);

router.get('/', isRoleAdmin, async (req, res) => {
	const skip = req.query.skip || 0;
	const riderList = await riders.find().skip(skip).limit(10);
	res.send(riderList);
});

router.get('/:id', isCurrentUserOrAdmin, async (req, res) => {
	const {id} = req.params;
	const user = await riders.findOne({_id: id});
	res.send(user);
});

router.get('/:id/edit', isCurrentUser, (req, res) => {
	res.send('edit profile page for user ' + req.params.id);
});

router.patch('/:id',
	isCurrentUser,
	validateRiderDetails,
	uploadFile('profile', 'profile-pic'),
	uploadFile('covidCert', 'covid-cert'),
	async (req, res) => {
		const {id} = req.params;
		const {phone, gender, dob, occupation, emContactName, emContactRelation, emContactPhone, imageLink, covidCertLink} = req.body;
		const updateEmContact = {
			name: emContactName,
			relation: emContactRelation,
			phone: emContactPhone
		};

		const newRider = await riders.findOneAndUpdate({id: id}, {
			phone: phone,
			gender: gender,
			dob: dob,
			occupation: occupation,
			profilePic: imageLink,
			covidCert: covidCertLink,
			emergencyContact: updateEmContact
		});

		res.send({success: 'Profile Updated!'});
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