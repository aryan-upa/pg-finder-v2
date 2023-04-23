const express = require('express');
const router = express.Router();
const riders = require('../models/rider');
const {isRoleAdmin, isLoggedIn, isCurrentUserOrAdmin, isCurrentUser} = require("../middlewares/role_validator");

router.use(isLoggedIn);

router.get('/', isRoleAdmin, async (req, res) => {
	const {skip} = req.query || 0;
	const riderList = await riders.find().skip(skip).limit(10);
	res.send(riderList);
});

router.get('/:id', isCurrentUserOrAdmin, async (req, res) => {
	const {id} = req.params;
	const user = await riders.findOne({_id: id});
	res.send(user);
});

router.get('/:id/edit', isCurrentUser, (req, res) => {
	res.send('edit profile page for user ' + req.params.id);
});

router.post('/:id', isCurrentUser, (req, res) => {

});


router.get('/:id/favourites', isCurrentUserOrAdmin, async (req, res) => {
	const {id} = req.params;
	const user = await riders.findOne({_id: id});
	await user.populate('likes');
	const likes = user.likes;
	res.send(likes);
});

router.get('/:id/bookings', isCurrentUserOrAdmin, async (req, res) => {
	const {id} = req.params;
	const user = await riders.findOne({_id: id});
	await user.populate('bookings');
	const bookings = user.bookings;
	res.send(bookings);
});

router.delete('/:id', isRoleAdmin, async (req, res) => {
	const {id} = req.params;
	const info = await riders.deleteOne({_id: id});
	res.send(info);
});

module.exports = router;