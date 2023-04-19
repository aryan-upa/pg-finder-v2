const mongoose = require('mongoose');

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
	completed: Boolean,
	res: String,
	comment: String
});

const model = mongoose.model('Booking', schema);
module.exports = model;