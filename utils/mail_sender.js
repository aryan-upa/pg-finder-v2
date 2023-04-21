const {emailAdd, appPass, baseURL, port} = require('../config');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: emailAdd,
		pass: appPass
	}
});

/* EMAIL CONTENT SECTION */

const registrationMailHTML = '' +
'	<div style="text-align: center; box-sizing: border-box;"> ' +
'		<h1>Thank you for registering!</h1>' +
'		<p>' +
' 			To complete the registration process, we need to verify your email address.' +
'			<br>' +
'			Please click the following link to verify your email address:' +
'		</p>' +
'' +
'		<a href="' + `${baseURL}${port}/auth/validate?validationKey=insertValidationKey` + '" style="text-decoration: none; color: #1a1a1a; padding: 0.5rem 2rem; border-radius: 1rem; background-color: lightgreen;">Validate Now!</a>' +
'' +
'		<br>' +
'		<br>' +
'' +
'		<p>' +
'			If you did not register for our service, please ignore this email.' +
'			<br>' +
'			Thank you for your cooperation.' +
'			<br>' +
'			Best regards <br> <strong>Team PG Finder ♥</strong>' +
'		</p>' +
'	</div>';

/* EMAIL SENDING FUNCTIONS */

async function sendRegistrationEmail (recipientAddress, validationKey) {
	const htmlContent = registrationMailHTML.replace('insertValidationKey', validationKey);

	const mailOptions = {
		from: emailAdd,
		to: recipientAddress,
		subject: "PG Finder | Please verify your email address ",
		html: htmlContent,
	};

	return await transporter.sendMail(mailOptions);
}

module.exports = {
	sendRegistrationEmail,
}