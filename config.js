const path = require('path');
const dotenv = require('dotenv').config({path: path.join(__dirname, 'secret.env')});

module.exports = {
	databaseURL: process.env.DATABASE_URL,
	baseURL: process.env.BASE_URL,
	emailAdd: process.env.EMAIL_ADDRESS,
	appPass: process.env.APP_PASSCODE,
	port: process.env.PORT || 3000,
	sessionSecret: process.env.SESSION_SECRET,
	zipcodeKey: process.env.ZIPCODE_STACK_KEY,
	cloudName: process.env.CLOUD_NAME,
	cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
	cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET
};
