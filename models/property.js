const mongoose = require('mongoose');
const bookings = require('./booking');
const reviews = require('./review');

const detSchema = new mongoose.Schema({
	name: String,
	detail: String,
	path: String
}, {_id: false});

const allowSchema = new mongoose.Schema({
	name: String,
	allowed: Boolean,
	path: String,
}, {_id: false});

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
	food: [detSchema],
	amenities: [detSchema],
	rules: [allowSchema],
	otherCharges: [detSchema],
	occupancy: [String],
	rate: Number,
	rating: Number,
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
	images: [String],
	since: Number,
	bookingMoney: Number
});

schema.index({
	'address.building': "text",
	'address.addL1': 'text',
	'address.addL2': 'text',
	'address.landmark': 'text',
	'address.city': 'text',
	'address.state': 'text',
	'address.zipcode': 'text',
	'name': 'text',
}, {
	default_language: 'en',
});

const model = mongoose.model('Property', schema);
module.exports = model;