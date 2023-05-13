const express = require('express');
const {isAdminLoggedIn, isRoleAdmin} = require("../middlewares/role_validator");
const contacts = require("../models/contact");
const {validateContact} = require("../middlewares/schema_validator");
const router = express.Router();

router.get('/', isAdminLoggedIn, isRoleAdmin, async (req, res) => {
	try {
		let {skip} = req.query;

		if (!skip || skip < 0) {
			req.query.skip = 0;
			skip = 0;
		}

		const results = await contacts.find({}).skip(skip).limit(10);

		return res.render('admin-details', {
			type: 'contact',
			results,
			query: req.query,
			isFirst: skip === 0,
			isLast: results.length < 10,
		});
	} catch (e) {
		res.render('error', {code: 500, error: 'Internal server error'})
	}
})

router.post('/', validateContact, async (req, res) => {
	try {
		const {email, subject, content} = req.body;
		await contacts.create({
			email, subject, content
		});
		res.send({success: 'Message saved successfully!'});
	} catch (e) {
		res.render('error', {code: 500, error: 'Internal server error'})
	}
})

module.exports = router;