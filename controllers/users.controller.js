const { request, response } = require('express');
const bcryptjs = require('bcryptjs');


const User = require('../models/user');

const usersGet = async (req = request, res = response) => {
	const { limit = 5, from = 0 } = req.query;
	const query = { status: true };

	const [total, users] = await Promise.all([User.countDocuments(query), User.find(query).skip(parseInt(from)).limit(parseInt(limit))]);

	res.json({
		total,
		users,
	});
};
const usersPost = async (req = request, res = response) => {
	const { name, mail, password, role } = req.body;

	const user = new User({ name, mail, password, role });

	//Encrypt password
	const salt = bcryptjs.genSaltSync();

	user.password = bcryptjs.hashSync(password, salt);

	//save in DB

	await user.save();

	res.json({
		msg: 'post API - Controller',
		user,
	});
};
const usersPut = async (req = request, res = response) => {
	const { id } = req.params.id;
	const { _id, password, google, mail, ...rest } = req.body;

	//TODO validate BD
	if (password) {
		//Encrypt password
		const salt = bcryptjs.genSaltSync();

		rest.password = bcryptjs.hashSync(password, salt);
	}
	const user = await User().findByIdAndUpdate(id, rest);

	res.json({ msg: 'PUT API - Controller', user });
};
const usersPatch = (req = request, res = response) => {
	res.json({
		msg: 'patch API - Controller',
	});
};
const usersDelete = async (req = request, res = response) => {
	const { id } = req.params;

	//fisical delete this action is'nt recommended
	// const user = await User.findByIdAndDelete(id);

	//Change status user
	const user = await User.findByIdAndUpdate(id, { status: false });
	user.status = false;

	res.json({ user });
};

module.exports = {
	usersGet,
	usersPost,
	usersPut,
	usersPatch,
	usersDelete,
};
