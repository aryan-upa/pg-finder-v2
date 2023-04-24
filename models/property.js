const mongoose = require('mongoose');
const bookings = require('booking');
const reviews = require('review');

const schema = new mongoose.Schema({
	name: String,
	address: {
		building: String,
		addL1: String,
		addL2: String,
		landmark: String,
		city: String,
		state: String,
		zipcode: Number,
		country: String
	},
	maxOcc: Number,
	type: String,
	desc: String,
	food: [{
		detail: String,
		icon: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Icon'
		}
	}],
	amenities: [{
		detail: String,
		icon: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Icon'
		}
	}],
	rules: [{
		detail: String,
		icon: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Icon'
		}
	}],
	otherCharges: [{
		detail: String,
		icon: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Icon'
		}
	}],
	occupancy: Number,
	rate: Number,
	interested: Number,
	reviews: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Review'
	}],
	tagline: String,
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Provider'
	},
	since: Number
});

schema.post('findOneAndDelete', async (data) => {
	if (data.bookings.length > 0)
		await bookings.deleteMany({$and: [{property: data.id}, {completed: false}]});

	if (data.reviews.length > 0)
		await reviews.deleteMany({id: {$in: data.reviews}});
});

const model = mongoose.model('Property', schema);
module.exports = model;