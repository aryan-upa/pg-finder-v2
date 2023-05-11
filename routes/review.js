const express = require('express');
const {isRoleAdmin, isLoggedIn, isRoleRider, isRoleAdminOrRider} = require("../middlewares/role_validator");
const router = express.Router();
const properties = require('../models/property');
const riders = require('../models/rider');
const reviews = require('../models/review');

router.get('/', isRoleAdmin, (req, res) => {
	try {
		res.send({error: 'not defined'});
	} catch (e) {
		res.render('error', {code: 500, error: 'Internal server error'})
	}
})

router.get('/:id', async  (req, res) => {
	try {
		const {id} = req.params;
		const review = await reviews.findById({id});
		await review.populate(['userID', 'propertyID']);
		res.send({success: 'review found!', review});
	} catch (e) {
		res.render('error', {code: 500, error: 'Internal server error'})
	}
})

router.post('/', isLoggedIn, isRoleRider, async (req, res) => {
	try {
		const {rating, comment} = req.body;

		const {propertyID} = req.query;
		const property = await properties.findById({_id: propertyID});

		const riderID = req.session.userRoleID;
		const rider = await riders.findById({_id: riderID});

		const newReview = await reviews.create({
			rating: rating,
			userID: rider,
			propertyID: property,
			comment,
			date: Date.now()
		});

		rider.reviews.push(newReview);
		rider.save();

		const totalRating = property.reviews.length;
		const newRating = ((property.rating * totalRating) + Number(rating)) / (totalRating + 1);

		property.reviews.push(newReview);
		property.rating = newRating;

		property.save();
		return res.send({success: 'review saved successfully'});
	} catch (e) {
		res.render('error', {code: 500, error: 'Internal server error'})
	}
})

router.delete('/:id', isLoggedIn, isRoleAdminOrRider, async (req, res) => {
	try {
		const {id} = req.params;
		const review = await reviews.findById({_id: id});

		if (!review)
			return res.status(404).send({error: 'review not found!'});

		if (!review.userID.equals(req.session.userRoleID))
			return res.status(406).send({error: 'not authorized!'});

		const info = await reviews.findByIdAndDelete({_id: id});

		await properties.findByIdAndUpdate(review.propertyID, {$pull: {reviews: id}});
		await riders.findByIdAndUpdate(review.userID, {$pull: {reviews: id}})

		res.send({success: 'review deleted successfully', info});
	} catch (e) {
		res.render('error', {code: 500, error: 'Internal server error'})
	}
})

module.exports = router;