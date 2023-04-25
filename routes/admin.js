const express = require('express');
const {isLoggedIn, isRoleAdmin} = require("../middlewares/role_validator");
const providers = require('../models/provider');
const riders = require('../models/rider');
const bookings = require('../models/booking');
const properties = require('../models/property');

const router = express.Router();

router.use(isLoggedIn);
router.use(isRoleAdmin);

router.get('/', async (req, res) => {
	const totalProperties = await properties.find({}).count();
	const totalUsers = await riders.find({}).count();
	const totalBookings = await bookings.find({}).count();
	const totalProviders = await providers.find({}).count();

	res.send({location: 'admin-dashboard', success: 'successfully shown dashboard', data: {
		totalProperties, totalUsers, totalBookings, totalProviders
	}});
});

module.exports = router;