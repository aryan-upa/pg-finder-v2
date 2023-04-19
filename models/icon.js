const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	title: String,
	url: String
});

const model = mongoose.model('Icon', schema);
module.exports = model;