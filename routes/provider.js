const express = require('express');
const router = express.Router();
const providers = require('../models/provider');
const {isRoleAdmin, isLoggedIn, isCurrentUserOrAdmin, isCurrentUser} = require("../middlewares/role_validator");
const {validateProviderDetails} = require('../middlewares/schema_validator');

router.use(isLoggedIn);

router.get('/', isRoleAdmin, async (req, res) => {
	const skip = req.query.skip || 0;
	const providerList = await providers.find().skip(skip).limit(10);
	res.send(providerList);
});

router.get('/:id', isCurrentUserOrAdmin, async (req, res) => {
	const {id} = req.params;
	const user = await providers.findOne({_id: id});
	res.send(user);
});

router.get('/:id/edit', isCurrentUser, (req, res) => {
	res.send('edit profile page for provider ' + req.params.id);
});

router.patch('/:id', isCurrentUser, validateProviderDetails, async (req, res) => {
	const {id} = req.params;
	const {phone, dob, gst, addBuilding, addL1, addL2, landmark, state, city, zipCode} = req.body;
	const address = {
		building: addBuilding,
		addL1: addL1,
		addL2: addL2,
		landmark: landmark,
		city: city,
		state: state,
		zipCode: zipCode,
		country: 'India'
	}

	const newProvider = await providers.findOneAndUpdate({_id: id}, {
		phone: phone,
		dob: dob,
		gst: gst,
		address: address
	});

	res.send({success: 'Profile Updated!'});
});

router.get('/:id/properties', isCurrentUserOrAdmin, async (req, res) => {
	const {id} = req.params;
	const user = await providers.findOne({_id: id});
	await user.populate('properties');
	const likes = user.likes;
	res.send(likes);
});

router.get('/:id/bookings-completed', isCurrentUserOrAdmin, async (req, res) => {
	const {id} = req.params;
	const user = await providers.findOne({_id: id});
	await user.populate('bookingCompleted');
	const completedBookings = user.bookingCompleted;
	res.send(completedBookings);
});

router.get('/:id/bookings-pending', isCurrentUserOrAdmin, async (req, res) => {
	const {id} = req.params;
	const user = await providers.findOne({_id: id});
	await user.populate('bookingPending');
	const pendingBookings = user.bookingPending;
	res.send(pendingBookings);
});

router.delete('/:id', isRoleAdmin, async (req, res) => {
	const {id} = req.params;
	const info = await providers.deleteOne({_id: id});
	res.send(info);
});

module.exports = router;
