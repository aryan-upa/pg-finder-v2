const mongoose = require('mongoose');
const bookings = require('booking');
const reviews = require('review');
const providers = require('provider');
const properties = require('property');

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

schema.post('findOneAndDelete', async function (data) {
	if (!(data.bookings.length === 0)) {
		await bookings.deleteMany({$and: [{_id: {$in: data.bookings}}, {$completed: false}]});
		await providers.updateMany(
			{pendingBooking: {$in: data.bookings}},
			{$pull: {pendingBooking: {$in: data.bookings}}}
		);
	}

	if (!(data.reviews.length === 0)) {
		await reviews.deleteMany({_id: {$in: data.reviews}});
		await properties.updateMany(
			{reviews: {$in: data.reviews}},
			{$pull: {reviews: {$in: data.reviews}}}
		);
	}

	if (!(data.likes.length === 0)) {
		await properties.updateMany(
			{_id: {$in: data.likes}},
			{$inc: {interested: -1}}
		);
	}
});

const model = mongoose.model('Rider', schema);
module.exports = model;