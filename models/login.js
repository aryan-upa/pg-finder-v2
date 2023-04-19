const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const schema = new mongoose.Schema({
	role: String
});

schema.plugin(passportLocalMongoose);
const model = mongoose.model('Login', schema);
module.exports = model;