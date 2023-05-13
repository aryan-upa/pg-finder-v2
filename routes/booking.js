const express = require('express');
const {isLoggedIn, isRoleAdmin, isRoleProvider, isRoleRider, isRoleAdminOrProvider} = require("../middlewares/role_validator");
const bookings = require('../models/booking');
const providers = require('../models/provider');
const properties = require('../models/property');
const riders = require('../models/rider');
const router = express.Router();
const keys = require('../models/key');
const axios = require("axios");
const {
	sendBookingSuccessEmail,
	sendBookingFailEmail,
	sendBookingFinalSuccessEmail,
	sendBookingFinalFailEmail
} = require('../utils/mail_sender');
const {serverURL} = require('../config');

router.get('/', isLoggedIn, isRoleAdmin, async (req, res) => {
	try {
		let {skip} = req.query;

		if (!skip || skip < 0) {
			req.query.skip = 0;
			skip = 0;
		}

		const results = await bookings.find({})
			.populate({path: 'by'})
			.populate({path: 'property'})
			.skip(skip).limit(10);

		return res.render('admin-details', {
			type: 'booking',
			results,
			query: req.query,
			isFirst: skip === 0,
			isLast: results.length < 10,
		});
	} catch (e) {
		res.render('error', {code: 500, error: 'Internal server error'})
	}
})

router.get('/payment-successful', isLoggedIn, isRoleRider, async (req, res) => {
	try {
		const {propertyID, key} = req.query;

		const keyGiven = await keys.findOne({key: key});

		if (!keyGiven)
			return res.render('error', {code: '404', error: 'invalid booking attempt'});

		if (keyGiven.purpose !== 'payment')
			return res.render('error', {code: '406', error: 'invalid booking attempt'});

		const property = await properties.findById({_id: propertyID});

		const config = {
			url: `${serverURL}/booking?propertyID=${propertyID}&userID=${req.session.userRoleID}`,
			method: 'post',
		}

		axios(config)
			.then(async (response) => {
				const bookingID = response.data.bookingID;
				await sendBookingSuccessEmail(req.user.username, {
					bookingID: bookingID,
					customerName: req.session.userDet.name,
					bookingDate: keyGiven.createdAt,
					amountPaid: property.bookingMoney
				});
				res.render('success', {success: 'Your booking has been successful, Details have been mailed to you!'});
			})
			.catch(async (error) => {
				await sendBookingFailEmail(req.user.username, {
					amountPaid: property.bookingMoney,
					customerName: req.session.userDet.name,
					propertyID: propertyID,
					paymentID: keyGiven.content.paymentID,
					date: keyGiven.createdAt
				});
				res.render('error', {code: '500', error: 'Your booking was unsuccessful, details have been mailed to you!'});
			});

		await keys.findOneAndDelete({key: key});
	} catch (e) {
		res.render('error', {code: 500, error: 'Internal server error'})
	}
})

router.post('/', async (req, res) => {
	try {
		const {propertyID, userID: riderID} = req.query;

		const property = await properties.findById({_id: propertyID});

		const ownerID = property.owner;
		const owner = await providers.findById(ownerID);

		const rider = await riders.findById({_id: riderID});

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

		res.send({bookingID: createdBooking.id});
	} catch (e) {
		res.status(500).send({error: 'internal server error!'});
	}
})

router.patch('/:id', isLoggedIn, isRoleProvider, async (req, res) => {
	try {
		const {id: bookingID} = req.params;
		const booking = await bookings.findById({_id: bookingID});

		const providerID = req.session.userRoleID;
		if (booking.owner._id === providerID)
			return res.status(406).send({error: 'Request denied!'});

		if (booking.completed)
			return res.status(403).send({error: 'Bad request, Booking already completed'});

		const {res: result, comment} = req.body;

		booking.res = result === 'true';
		booking.comment = comment;
		booking.completed = true;

		await booking.save();
		const updatedBooking = await bookings.findById({_id: bookingID});
		await providers.findByIdAndUpdate(
			{_id: providerID},
			{$pull: {bookingPending: updatedBooking._id}, $push: {bookingCompleted: updatedBooking._id}}
		);

		const property = await properties.findById({_id: booking.property})
		const owner = await providers.findById({_id: providerID});
		const by = await riders.findById({_id: booking.by});

		const emailContent = {
			bookingID: bookingID,
			propName: property.name,
			propEmail: owner.email,
			propPhone: owner.phone
		}

		if (booking.res)
			sendBookingFinalSuccessEmail(by.email, emailContent).then(() => {});
		else
			sendBookingFinalFailEmail(by.email, emailContent).then(() => {});

		res.send({success: 'booking updated'});
	} catch (e) {
		res.render('error', {code: 500, error: 'Internal server error'})
	}
})

router.delete('/:id', isLoggedIn, isRoleAdminOrProvider, async (req, res) => {
	try {
		const {id: bookingID} = req.params;
		const booking = await bookings.findById({bookingID});

		const {providerID} = req.session.userRoleID;
		if (req.user.role !== 'admin' && booking.owner !== providerID)
			return res.status(406).send({error: 'Request denied!'});

		await riders.updateOne({_id: booking.by}, {$pull: {bookings: booking.id}});
		await providers.updateOne({_id: booking.owner}, {$pull: {bookingPending: booking.id}});

		await bookings.deleteOne(booking);
		res.send({success: 'booking deleted successfully'});
	} catch (e) {
		console.log(e);
		res.send({error: 'Could not delete booking!'});
	}
});

module.exports = router;