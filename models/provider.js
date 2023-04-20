const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	name: String,
	phone: Number,
	email: String,
	dob: Date,
	gst: String,
	properties: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Property'
	}],
	bookingCompleted: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Booking'
	}],
	bookingPending: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Booking'
	}],
	address: {
		building: String,
		addL1: String,
		addL2: String,
		landmark: String,
		city: String,
		state: String,
		zipcode: Number,
		country: String
	}
});

const model = mongoose.model('Provider', schema);
module.exports = model;