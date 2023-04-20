const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	name: String,
	phone: Number,
	email: String,
	dob: Date,
	gender: String,
	profilePic: String,
	likes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Property'
	}],
	reviews: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Review'
	}],
	bookings: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Booking'
	}],
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