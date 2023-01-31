const { request, response } = require('express');
const bcryptjs = require('bcryptjs');


const User = require('../models/user');
const { generateJWT } = require('../helpers/generateJWT');

const login = async (req = request, res = response) => {

	const { mail, password } = req.body;

	try {

		//Verify if Email exist

		const user = await User.findOne({ mail });

		if (!user) {
			return (res.status(400).json({
				msg: "User / password aren't correct"
			}));
		}

		//Verify if User is active in the DB and exist
		if (!user.status) {
			return (res.status(400).json({
				msg: "User not exits in the DB"
			}));
		}

		//Verify Password

		const validPassword = bcryptjs.compareSync(password, user.password);

		if (!validPassword) return (res.status(400).json({
			msg: "User / password aren't correct"
		}));


		//generate JWT

		const token = await generateJWT(user.id);


		res.json({
			user,
			token
		});


	} catch (error) {
		console.log("🚀 ~ file: auth.controller.js:14 ~ login ~ error", error);
		throw new Error(res.status(500).json({
			msg: 'has been an error, talk with backend administrator'
		}));
	}

};

module.exports = {
	login,
};
