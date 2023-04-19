const mongoose = require('mongoose');

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
	food: [],
	amenities: [],
	rules: [],
	otherCharges: [],
	occupancy: Number,
	rate: Number,
	reviews: [],
	tagline: String,
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Provider'
	},
	since: Number
});

const model = mongoose.model('Property', schema);
module.exports = model;