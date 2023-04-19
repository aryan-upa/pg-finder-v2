const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	name: String,
	phone: Number,
	email: String,
	dob: Date,
	gst: String,
	properties: [],
	bookingCompleted: [],
	bookingPending: [],
	address: String
});

const model = mongoose.model('Provider', schema);
module.exports = model;