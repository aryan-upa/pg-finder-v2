const mongoose = require('mongoose');
const riders = require('./rider');
const providers = require('./provider');

const schema = new mongoose.Schema({
	by: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Rider'
	},
	property: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Property'
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Provider'
	},
	date: Date,
	isTransferred: Boolean,
	completed: Boolean,
	res: Boolean,
	comment: String
});

schema.post('findOneAndDelete', async (data) => {
	await providers.findOneAndUpdate({id: data.owner}, {$pull: {bookingPending: {id: data.id}}});
	await riders.findOneAndUpdate({id: data.by}, {$pull: {bookings: {id: data.id}}});
});

const model = mongoose.model('Booking', schema);
module.exports = model;