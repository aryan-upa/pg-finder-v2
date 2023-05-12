const express = require('express');
const {isRoleAdmin, isAdminLoggedIn} = require("../middlewares/role_validator");
const providers = require('../models/provider');
const riders = require('../models/rider');
const bookings = require('../models/booking');
const properties = require('../models/property');
const contacts = require('../models/contact');
const {stripePrivateKey} = require('../config');
const stripe = require('stripe')(stripePrivateKey);

const router = express.Router();

router.use(isAdminLoggedIn);
router.use(isRoleAdmin);

router.get('/', async (req, res) => {
	const totalProperties = await properties.find({}).count();
	const totalRiders = await riders.find({}).count();
	const totalBookings = await bookings.find({}).count();
	const totalProviders = await providers.find({}).count();
	const totalContacts = await contacts.find({}).count();
	const balanceObject = await stripe.balance.retrieve();

	res.render('admin-dashboard', {
		location: 'admin-dashboard',
		success: 'successfully shown dashboard',
		data: {
			totalProperties,
			totalRiders,
			totalBookings,
			totalProviders,
			totalContacts,
			totalBalance: Math.round(balanceObject.pending[0].amount / 100),
		}
	});
});

module.exports = router;