const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	key: String,
	purpose: String,
	content: Object
}, {timestamps: {createdAt: true, updatedAt: false}});

const model = mongoose.model('Key', schema);
module.exports = model;