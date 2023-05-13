const properties = require('../models/property');
const fs = require('fs');
const path = require('path');

/* CREATED FILE PATHS */
const top_property_path = path.join(__dirname, '../data/top_property.json');

function fetchTopProperties () {
	properties.find({}).sort({interested: "desc"}).limit(4).then((res) => {
		const modifiedData = JSON.stringify(res.map(prop => {
			return {
				"name" : prop.name,
				"img" : prop.images[0],
				"id" : prop._id
			}
		}));

		fs.writeFile(top_property_path, modifiedData, { flag: 'w' }, (err) => {
			if (err)
				console.log(err)
			console.log('Updated top properties!');
		});
	});
}

module.exports = {
	fetchTopProperties,
}