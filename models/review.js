const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	rating: Number,
	userID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Rider'
	},
	propertyID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Property'
	},
	comment: String,
	date: Date
});

const model = mongoose.model('Review', schema);
module.exports = model;