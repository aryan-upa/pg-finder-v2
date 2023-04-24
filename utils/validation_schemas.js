const joi = require('joi');

const registrationSchema = joi.object({
	email: joi.string().email().pattern(new RegExp('^\\w+([\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\\.\\w{2,3})+$')).required().messages({
			'string.email': 'Please enter a valid email!',
			'string.empty': 'Email is required!',
			'string.pattern.base': 'Please enter a valid email!'
		}),
	pass: joi.string().min(8).alphanum().required().messages({
		'string.empty': 'Password is required!',
		'any.only': 'Confirm password must be same as Password',
		'string.min': 'Password must be 8 characters long.'
	}),
	name: joi.string().trim().pattern(new RegExp('^[A-Za-z]+$')).required().messages({
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
	pass: joi.string().alphanum().required().messages({
		'string.empty': 'Password is required!',
	})
}).options({abortEarly: false});

const riderSchema = joi.object({
	name: joi.string().trim().pattern(new RegExp('^[A-Za-z]+$')).required().messages({
		'string.pattern.base' : 'Name contains invalid characters.'
	}),
	phone: joi.string().pattern(new RegExp('^(?:(?:\\+|0{0,2})91(\\s*-\\s*)?|0?)?[6789]\d{9}$')).required().messages({
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
	emContactName: joi.string().trim().pattern(new RegExp('^[A-Za-z]+$')).required().messages({
		'string.empty': 'require emergency contact name!',
	}),
	emContactRelation: joi.string().trim().required().messages({
		'string.empty': 'require emergency contact relation!',
	}),
	emContactPhone: joi.string().pattern(new RegExp('^(?:(?:\\+|0{0,2})91(\\s*-\\s*)?|0?)?[6789]\d{9}$')).required().messages({
		'string.empty': 'Please provide emergency contact phone number.',
		'string.pattern.base': 'Phone number invalid.'
	}),
}).options({abortEarly: false});

module.exports = {
	registrationSchema,
	loginSchema,
}