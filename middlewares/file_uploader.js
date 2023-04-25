const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const {cloudName, cloudinaryApiKey, cloudinaryApiSecret} = require('../config');

cloudinary.config({
	cloud_name: cloudName,
	api_key: cloudinaryApiKey,
	api_secret: cloudinaryApiSecret
});

const profilePicStorage = cloudinaryStorage({
	cloudinary: cloudinary,
	folder: 'profile-pic',
	allowedFormats: ["jpg", "png"],
});

const covidCertificateStorage = cloudinaryStorage({
	cloudinary: cloudinary,
	folder: 'covid-cert',
	allowedFormats: ["pdf"]
});

const propertyImages = cloudinaryStorage({
	cloudinary: cloudinary,
	folder: 'properties',
	allowedFormats: ["jpg", "png"],
});

const uploadProfilePic = multer({
	storage: profilePicStorage,
	limits: {
		fileSize: 1024 * 1024 // 1MB
	},
	fileFilter (req, file, cb) {
		if (!file.originalname.match(/\.(png|jpg)$/))
			return cb(new Error('Please upload an image file!'));

		cb (undefined, true);
	}
});

const uploadCovidCert = multer({
	storage: covidCertificateStorage,
	limits: {
		fileSize: 1024 * 1024 * 4 // 4MBs
	},
	fileFilter (req, file, cb) {
		if (!file.originalname.match(/\.(pdf)$/))
			return cb(new Error('please upload pdf file!'));

		cb (undefined, true);
	}
});

const uploadPropertyImages = multer ({
	storage: propertyImages,
	limits: {
		fileSize: 1024 * 1024 // 1 MB
	},
	fileFilter (req, file, cb) {
		if (!file.originalname.match(/\.(jpg|png)$/))
			return cb(new Error('please upload an image file only!'));

		cb (undefined, true);
	}
}).array('property-image', 5);

module.exports = {
	uploadProfilePic,
	uploadCovidCert,
	uploadPropertyImages
}