const mongoose = require('mongoose');
const {databaseURL} = require('../config');

mongoose.connect(databaseURL).then(() => {
	console.log("Connected Successfully!");
}).catch((err) => {
	console.log("Error! Could not connect " + err);
});