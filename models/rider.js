const mongoose = require('mongoose');
const bookings = require('./booking');
const reviews = require('./review');
const providers = require('./provider');
const properties = require('./property');

const schema = new mongoose.Schema({
	name: {
		type: String,
		immutable: true,
	},
	phone: Number,
	email: {
		type: String,
		immutable: true
	},
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
	if (data.bookings && data.bookings.length > 0)
		await bookings.deleteMany({$and: [{_id: {$in: data.bookings}}, {$completed: false}]});

	if (data.reviews && data.reviews.length > 0)
		await reviews.deleteMany({_id: {$in: data.reviews}});

	if (data.likes && data.likes.length > 0)
		await properties.updateMany({_id: {$in: data.likes}}, {$inc: {interested: -1}});
});

const model = mongoose.model('Rider', schema);
module.exports = model;