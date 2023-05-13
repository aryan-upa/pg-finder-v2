const express = require('express');
const router = express.Router();
const providers = require('../models/provider');
const {isRoleAdmin, isLoggedIn, isCurrentUserOrAdmin, isCurrentUser, isRoleProvider} = require("../middlewares/role_validator");
const {validateProviderDetails} = require('../middlewares/schema_validator');
const logins = require('../models/login');
const properties = require('../models/property');
const bookings = require('../models/booking');

router.use(isLoggedIn);

router.get('/', isRoleAdmin, async (req, res) => {
	try {
		let {skip} = req.query;

		if (!skip || skip < 0) {
			req.query.skip = 0;
			skip = 0;
		}

		const results = await providers.find({}).skip(skip).limit(10);

		return res.render('admin-details', {
			type: 'provider',
			results,
			query: req.query,
			isFirst: skip === 0,
			isLast: results.length < 10,
		});
	} catch (e) {
		console.log(e);
		res.status(500).render('error', {error: 'Internal server error!'});
	}
});

router.get('/dashboard', isRoleProvider, (req, res) => {
	res.redirect(`/provider/${req.session.userRoleID}`);
});

router.get('/:id', isCurrentUserOrAdmin, async (req, res) => {
	try {
		const {id} = req.params;
		const userInfo = await providers.findOne({_id: id});

		if (!userInfo)
			return res.status(404).send({error: true, message: 'User not found!'});

		await userInfo.populate('properties');
		await userInfo.populate({
			path: 'bookingPending',
			populate: [
				{ path: 'by' },
				{ path: 'property' }
			]
		});

		await userInfo.populate({
			path: 'bookingCompleted',
			populate: [
				{ path: 'by' },
				{ path: 'property' }
			]
		});

		res.render('provider-dashboard', {userInfo}); // working properly
	} catch (e) {
		console.log(e);
		res.status(500).render('error', {error: 'Internal server error!'});
	}
});

router.get('/:id/new-user', isCurrentUser, async (req, res) => {
	try {
		const {id} = req.params;
		const userInfo = await providers.findById({_id: id});
		res.render('register-provider', {userInfo}); // working properly
	} catch (e) {
		console.log(e);
		res.status(500).render('error', {error: 'Internal server error!'});
	}
})
router.get('/:id/edit', isCurrentUser, async (req, res) => {
	try {
		const {id} = req.params;
		const userInfo = await providers.findById({_id: id});
		res.render('update-provider', {userInfo}); // working properly
	} catch (e) {
		console.log(e);
		res.status(500).render('error', {error: 'Internal server error!'});
	}
});

router.patch('/:id', isCurrentUser, validateProviderDetails, async (req, res) => {
	try {
		const {id} = req.params;
		const {email, phone, dob, gst, addBuilding, addL1, addL2, landmark, state, city, zipCode} = req.body;

		const address = {
			building: addBuilding,
			addL1: addL1,
			addL2: addL2,
			landmark: landmark,
			city: city,
			state: state,
			zipcode: zipCode,
			country: 'India'
		}

		await providers.findOneAndUpdate({_id: id}, {
			phone: phone,
			dob: dob,
			gst: gst,
			address: address
		});

		await logins.findOneAndUpdate({username: email}, {isFilled: true});
		res.send({success: 'Profile Updated!'}); // working properly
	} catch (e) {
		console.log(e);
		res.status(500).render('error', {error: 'Internal server error!'});
	}
});

router.get('/:id/properties', isCurrentUserOrAdmin, async (req, res) => {
	try {
		const {id} = req.params;
		const user = await providers.findOne({_id: id});
		await user.populate('properties');
		const likes = user.likes;
		res.send(likes);
	} catch (e) {
		console.log(e);
		res.status(500).render('error', {error: 'Internal server error!'});
	}
});

router.get('/:id/bookings-completed', isCurrentUserOrAdmin, async (req, res) => {
	try {
		const {id} = req.params;
		const user = await providers.findOne({_id: id});
		await user.populate('bookingCompleted');
		const completedBookings = user.bookingCompleted;
		res.send(completedBookings);
	} catch (e) {
		console.log(e);
		res.status(500).render('error', {error: 'Internal server error!'});
	}
});

router.get('/:id/bookings-pending', isCurrentUserOrAdmin, async (req, res) => {
	try {
		const {id} = req.params;
		const user = await providers.findOne({_id: id});
		await user.populate('bookingPending');
		const pendingBookings = user.bookingPending;
		res.send(pendingBookings);
	} catch (e) {
		console.log(e);
		res.status(500).render('error', {error: 'Internal server error!'});
	}
});

router.delete('/:id', isRoleAdmin, async (req, res) => {
	try {
		const {id} = req.params;
		const providerToDelete = await providers.findById({_id: id});

		providerToDelete.properties.map(async pID => {
			await bookings.deleteMany({property: pID, completed: false});
			await properties.findByIdAndDelete({_id: pID});
		});

		await logins.findOneAndDelete({username: providerToDelete.email});
		await providers.deleteOne(providerToDelete);
		res.send({success: 'User deleted successfully!'});
	} catch (e) {
		console.log(e);
		res.status(500).render('error', {error: 'Internal server error!'});
	}
});

module.exports = router;
