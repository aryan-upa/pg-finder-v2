const express = require('express');
const {isLoggedIn, isRoleAdmin, isRoleProvider, isRoleRider, isRoleAdminOrProvider} = require("../middlewares/role_validator");
const bookings = require('../models/booking');
const providers = require('../models/provider');
const properties = require('../models/property');
const riders = require('../models/rider');
const router = express.Router();

router.use(isLoggedIn);

router.get('/', isRoleAdmin, async (req, res) => {
	const skip = req.query.skip || 0;
	const bookingList = await bookings.find().skip(skip).limit(10);
	res.send(bookingList);
});

router.post('/', isRoleRider, async (req, res) => {
	const {propertyID} = req.query;
	const property = await properties.findById({propertyID});

	const {ownerID} = property.owner;
	const owner = await providers.findById({ownerID});

	const riderID = req.session.userRoleID;
	const rider = await riders.findById({riderID});

	const createdBooking = await bookings.create({
		by: rider,
		owner: owner,
		property: property,
		date: Date.now(),
		isTransferred: false,
		completed: false,
	});

	rider.bookings.push(createdBooking);
	await rider.save();

	owner.bookingPending.push(createdBooking);
	await owner.save();

	res.send({success: 'booking successfully done', createdBooking});
});

router.patch('/:id', isRoleProvider, async (req, res) => {
	const {id: bookingID} = req.params;
	const booking = await bookings.findById({bookingID});

	const {providerID} = req.session.userRoleID;
	if (booking.owner !== providerID)
		return res.status(406).send({error: 'Request denied!'});

	if (booking.completed)
		return res.status(403).send({error: 'Bad request, Booking already completed'});

	const {res: result, comment} = req.body;

	booking.res = Boolean(result);
	booking.comment = comment;
	booking.completed = true;

	await booking.save();
	await providers.findByIdAndUpdate(
		{providerID},
		{$pull: {bookingPending: booking}, $push: {bookingCompleted: booking}}
	);

	res.send({success: 'booking updated'});
});

router.get('/:id', async (req, res) => {
	const {id} = req.params;
	const booking = await bookings.findById({id});
	res.send(booking);
});

router.delete('/:id', isRoleAdminOrProvider, async (req, res) => {
	const {id: bookingID} = req.params;
	const booking = await bookings.findById({bookingID});

	const {providerID} = req.session.userRoleID;
	if (booking.owner !== providerID)
		return res.status(406).send({error: 'Request denied!'});

	const info = await bookings.deleteOne({bookingID});
	res.send({success: 'booking deleted successfully', info});
});

module.exports = router;