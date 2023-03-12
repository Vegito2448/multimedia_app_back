const { request, response } = require('express');
const bcryptjs = require('bcryptjs');


const User = require('../models/user');
const { generateJWT } = require('../helpers/generateJWT');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async (req = request, res = response) => {

	const { id_token } = req.body;
	try {

		const { mail, image, name } = await googleVerify(id_token);

		let user = await User.findOne({ mail });

		if (!user) {
			//I have  to create a new user
			const data = {
				name, mail, image, password: ':P', google: true
			};
			user = new User(data);
			await user.save();
		}

		//If user exist in DB
		if (!user.status) return res.status(401).json({ msg: 'Talk with the administrator, user blocked' });

		//generate JWT
		const token = await generateJWT(user.id);

		res.json({
			msg: "Everything is ok Google SignIn",
			user, token
		});

	} catch (error) {
		res.status(400).json({
			msg: "Google Token is not valid"
		});
	}


}

module.exports = {
	login,
	googleSignIn
};
