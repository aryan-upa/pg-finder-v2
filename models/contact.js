const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	email: String,
	subject: String,
	content: String,
}, {timestamps: {updatedAt: false, createdAt: true}});

const model = mongoose.model('Contact', schema);
module.exports = model;