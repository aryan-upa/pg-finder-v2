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
	name: joi.string().trim().required().messages({
		'string.empty': 'Name can not be empty!',
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

module.exports = {
	registrationSchema,
	loginSchema,
}