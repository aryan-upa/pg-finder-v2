const express = require('express');
const router = express.Router();
const riders = require('../models/rider');
const {isRoleAdmin, isLoggedIn, isCurrentUserOrAdmin, isCurrentUser, isRoleRider} = require("../middlewares/role_validator");
const {validateRiderDetails} = require('../middlewares/schema_validator');
const {uploadRiderFiles} = require("../middlewares/file_uploader");
const logins = require('../models/login');
const providers = require('../models/provider');
const bookings = require('../models/booking');
const properties = require('../models/property');

router.use(isLoggedIn);

router.get('/', isRoleAdmin, async (req, res) => {
	try {
		let {skip} = req.query;

		if (!skip || skip < 0) {
			req.query.skip = 0;
			skip = 0;
		}

		const results = await riders.find({}).skip(skip).limit(10);

		return res.render('admin-details', {
			type: 'rider',
			results,
			query: req.query,
			isFirst: skip === 0,
			isLast: results.length < 10,
		});
	} catch (e) {
		console.log(e);
		res.render('error', {code: 500, error: 'Internal error!'});
	}
});

router.get('/dashboard', isRoleRider, (req, res) => {
	try {
		res.redirect(`/rider/${req.session.userRoleID}`);
	} catch (e) {
		res.render('error', {code: 500, error: 'Internal server error'})
	}
});

router.get('/:id', isCurrentUserOrAdmin, async (req, res) => {
	try {
		const {id} = req.params;
		const userInfo = await riders.findOne({_id: id});

		if (!userInfo)
			return res.render('error', {code: 404, error: 'User not found!'});

		await userInfo.populate({
			path: 'bookings',
			populate: {
				path: 'property'
			},
			sort: {
				date: -1
			}
		});

		await userInfo.populate('likes');
		res.render('rider-dashboard', {userInfo});
	} catch (e) {
		res.render('error', {code: 500, error: 'Internal server error!'});
	}
});

router.get('/:id/new-user', isCurrentUser, async (req, res) => {
	try {
		const {id} = req.params;
		const userInfo = await riders.findOne({_id: id});
		res.render('register-user', {userInfo}); // working properly
	} catch (e) {
		res.render('error', {code: 500, error: 'Internal server error'})
	}
});

router.get('/:id/edit', isCurrentUser, async (req, res) => {
	try {
		const {id} = req.params;
		const userInfo = await riders.findOne({_id: id});
		res.render('update-user', {userInfo}); // working properly
	} catch (e) {
		res.render('error', {code: 500, error: 'Internal server error! Check your permissions!'});
	}
});

router.patch('/:id',
	isCurrentUser,
	uploadRiderFiles.fields([{name: "profile-pic"}, {name: "covid-cert"}]),
	validateRiderDetails,
	async (req, res) => {
	try {
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
	} catch (e) {
		res.render('error', {code: 500, error: 'Internal server error'})
	}
});

router.delete('/:id', isRoleAdmin, async (req, res) => {
	try {
		const {id} = req.params;

		const user = await riders.findById({_id: id});
		await user.populate('bookings');

		// deleting all the pending bookings from both bookings collection and providers list.
		for (const booking of user.bookings) {
			await providers.updateOne({_id: booking.owner},
				{$pull: {bookingsPending: booking._id}});

			if (!booking.completed)
				await bookings.deleteOne({_id: booking.id});
		}

		// reducing like count of all properties which were in the likes of this user.
		user.likes.map(async propertyId => {
			await properties.updateOne(
				{_id: propertyId},
				{$inc: {interested: -1}});
		});

		await riders.deleteOne(user);
		await logins.findByIdAndDelete({_id: req.user.id});
		res.send({success: 'User deleted successfully'});
	} catch (e) {
		console.log(e);
		res.send({error: 'Could not delete user!'});
	}
});

module.exports = router;