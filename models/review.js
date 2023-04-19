const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	rating: Number,
	comment: String,
	date: Date
});

const model = mongoose.model('Review', schema);
module.exports = model;