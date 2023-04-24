const mongoose = require('mongoose');
const riders = require('rider');
const properties = require('property');

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

schema.post('findOneAndUpdate', async (data) => {
	await properties.findByIdAndUpdate({id: data.propertyID}, {$pull: {reviews: {id: data.id}}});
	await riders.findByIdAndUpdate({id: data.userID}, {$pull: {reviews: {id: data.id}}});
});

const model = mongoose.model('Review', schema);
module.exports = model;