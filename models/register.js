const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	email: String,
	pass: String,
	name: String,
	role: String,
	validationKey: String
});

const model = mongoose.model('Register', schema);
module.exports = model;