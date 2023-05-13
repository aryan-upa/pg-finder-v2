const joi = require('joi');
const {stateUTList, cityMap} = require('./state_city_provider');

const registrationSchema = joi.object({
	email: joi.string().email().pattern(new RegExp('^\\w+([\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\\.\\w{2,3})+$')).required().messages({
			'string.email': 'Please enter a valid email!',
			'string.empty': 'Email is required!',
			'string.pattern.base': 'Please enter a valid email!'
		}),
	pass: joi.string().min(8).required().messages({
		'string.empty': 'Password is required!',
		'any.only': 'Confirm password must be same as Password',
		'string.min': 'Password must be 8 characters long.'
	}),
	name: joi.string().trim().pattern(new RegExp('^[A-Za-z ]{1,100}$')).required().messages({
		'string.empty': 'Name can not be empty!',
		'string.pattern.base': 'Name contains invalid characters.',
	}),
	confirmPass: joi.ref('pass'),
	role: joi.string().valid('rider', 'provider')
		.required().messages({
			'any.only' : 'Please select valid role!'
		})
}).options({abortEarly: false});

const loginSchema = joi.object({
	email: joi.string().email().pattern(new RegExp('^\\w+([\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\\.\\w{2,3})+$')).required().messages({
		'string.email': 'Please enter a valid email!',
		'string.empty': 'Email is required!',
		'string.pattern.base': 'Please enter a valid email!'
	}),
	pass: joi.string().required().messages({
		'string.empty': 'Password is required!',
	})
}).options({abortEarly: false});

const riderSchema = joi.object({
	phone: joi.string().pattern(new RegExp('^[6789]\\d{9}')).required().messages({
		'string.empty': 'Please provide phone number.',
		'string.pattern.base': 'Phone number invalid.'
	}),
	dob: joi.date().min(1990).max("now").required().messages({
		'date.min' : 'Age less than minimum age.',
		'date.max' : 'Age greater than maximum age.',
		'date.empty' : 'DOB is required'
	}),
	gender: joi.string().trim().valid('male', 'female', 'trans').required().messages({
		'any.only': 'invalid gender value.'
	}),
	occupation: joi.string().trim(),
	emContactName: joi.string().trim().pattern(new RegExp('^[A-Za-z ]{1,100}$')).required().messages({
		'string.empty': 'require emergency contact name!',
	}),
	emContactRelation: joi.string().trim().required().messages({
		'string.empty': 'require emergency contact relation!',
	}),
	emContactPhone: joi.string().pattern(new RegExp('^([6789])\\d{9}$')).required().messages({
		'string.empty': 'Please provide emergency contact phone number.',
		'string.pattern.base': 'Phone number invalid.'
	}),
}).options({abortEarly: false});

const providerSchema = joi.object({
	phone: joi.string().pattern(new RegExp('^[6789]\\d{9}$')).required().messages({
		'string.empty': 'Please provide phone number.',
		'string.pattern.base': 'Phone number invalid.'
	}),
	dob: joi.date().min(1990).max("now").required().messages({
		'date.min' : 'Age less than minimum age.',
		'date.max' : 'Age greater than maximum age.',
		'date.empty' : 'DOB is required'
	}),
	gst: joi.string().trim().pattern(new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')).required().messages({
		'string.empty': 'GST Number is required',
		'string.pattern.base': 'Improper GST Format'
	}),
	addBuilding: joi.string().trim().required().min(5).max(50).messages({
		'string.empty': 'Building Name can not be empty.',
	}),
	addL1: joi.string().trim().required().min(10).max(80).messages({
		'string.empty': 'Address Line 1 is required.',
	}),
	landmark: joi.string().trim().required().min(10).max(80).messages({
		'string.empty': 'Landmark is required',
	}),
	state: joi.string().trim().required().custom((state, helper) => {
		if (!stateUTList.includes(state))
			return helper.error("any.invalid");
		return state;
	}).messages({
		'string.empty' : 'State can not be empty!',
		'any.invalid' : 'Invalid state input!',
	}),
	city: joi.string().trim().required().messages({
		'string.empty': 'City name can not be empty!',
	}),
	zipCode: joi.string().min(6).max(6).required().messages({
		'string.min' : 'invalid zipcode',
		'string.max' : 'invalid zipcode',
		'string.empty' : 'zipcode required',
	})
}).custom ( (obj, helper) => {
	const {state, city} = obj;

	if (!cityMap[state].includes(city))
		return helper.error('city.invalid');
}).messages({
	'city.invalid': 'City name is invalid for current state!',
	'zip.verify' : 'Could not verify zipcode, please check zipcode and try again!',
	'zip.invalid': 'Zipcode does not match with state, please check again!',
}).options({abortEarly: false});

const propertySchema = joi.object({
	name: joi.string().trim().pattern(new RegExp('^[A-Za-z0123456789&-() ]{1,100}$')).required().messages({
		'string.pattern.base' : 'Name contains invalid characters.'
	}),
	addBuilding: joi.string().trim().required().min(5).max(50).messages({
		'string.empty': 'Building Name can not be empty.',
	}),
	addL1: joi.string().trim().required().min(10).max(80).messages({
		'string.empty': 'Address Line 1 is required.',
	}),
	landmark: joi.string().trim().required().min(10).max(80).messages({
		'string.empty': 'Landmark is required',
	}),
	state: joi.string().trim().required().custom((state, helper) => {
		if (!stateUTList.includes(state))
			return helper.error("any.invalid");
		return state;
	}).messages({
		'string.empty' : 'State can not be empty!',
		'any.invalid' : 'Invalid state input!',
	}),
	city: joi.string().trim().required().messages({
		'string.empty': 'City name can not be empty!',
	}),
	zipCode: joi.string().min(6).max(6).required().messages({
		'string.min' : 'invalid zipcode',
		'string.max' : 'invalid zipcode',
		'string.empty' : 'zipcode required',
	}),
	maxOccupancy: joi.number().min(1).max(1000).required().messages({
		'number.min': 'Minimum occupancy is 1',
		'number max': 'Maximum occupancy is 1000',
		'number.empty': 'Please provide occupancy'
	}),
	type: joi.string().required().valid('male', 'female','co').messages({
		'string.empty': 'Please defined type.',
		'any.only': 'Invalid type value'
	}),
	desc: joi.string().required().min(50).max(1000).messages({
		'string.min': 'please write description at least 50 characters',
		'string.max': 'please write description under 1000 characters',
		'string.empty': 'description is required'
	}),
	occupancy: [
		joi.array().items(joi.string().valid('single', 'double').messages({
			'any.only': 'invalid occupancy type!',
		})).min(1).messages({
			'array.empty': 'occupancy can not be empty',
			'array.min': 'choose at least 1 occupancy type!'
		}),
		joi.string().valid('single', 'double').messages({
			'any.only': 'invalid occupancy type!',
			'string.empty': 'occupancy can not be empty!'
		}).required()
	],
	rate: joi.number().min(1).required().messages({
		'number.empty' : 'defining rate is required',
		'number.min': 'rate has to be at least 1 rupee'
	}),
	since: joi.number().min(1947).max(new Date().getFullYear()).required().messages({
		'number.min': 'year has to be at least 1947',
		'number.max': 'year input is invalid',
		'number.empty': 'required to defined year value!'
	}),
	tagLine: joi.string(),
	bookingMoney: joi.number().min(1).max(10000).required().messages({
		'number.min': 'booking money can not be less than 1 rupee',
		'number.max': 'booking money can not be more than 10,000 rupees',
		'number.empty': 'booking money is required!'
	})
}).custom ( async (obj, helper) => {
	const {state, city, zipcode} = obj;

	if (!cityMap[state].includes(city))
		return helper.error('city.invalid');
}).messages({
	'city.invalid': 'City name is invalid for current state!',
	'zip.verify' : 'Could not verify zipcode, please check zipcode and try again!',
	'zip.invalid': 'Zipcode does not match with state, please check again!',
}).options({abortEarly: false});

const contactSchema = joi.object({
	email: joi.string().email().pattern(new RegExp('^\\w+([\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\\.\\w{2,3})+$')).required(),
	subject: joi.string().min(5).max(100).required(),
	content: joi.string().min(10).max(1000).required()
});

module.exports = {
	registrationSchema,
	loginSchema,
	riderSchema,
	providerSchema,
	propertySchema,
	contactSchema,
}