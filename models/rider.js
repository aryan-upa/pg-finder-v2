const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	name: String,
	phone: Number,
	email: String,
	dob: Date,
	gender: String,
	profilePic: String,
	likes: [],
	reviews: [],
	bookings: [],
	covidCert: String,
	occupation: String,
	emergencyContact: {
		name: String,
		relation: String,
		phone: Number
	}
});

const model = mongoose.model('Rider', schema);
module.exports = model;