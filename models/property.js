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

const model = mongoose.model('Property', schema);
module.exports = model;