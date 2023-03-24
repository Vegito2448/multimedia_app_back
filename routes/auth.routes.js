const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { validateFields } = require('../middlewares/validate-fields');

const { login, googleSignIn } = require('../controllers/auth.controller');


router.post('/login', [
	check('mail', "mail is Mandatory").isEmail(),
	check('password', "password is Mandatory").not().isEmpty(),
	validateFields,
], login);

router.post('/google', [
	check('id_token', "The id_token is necessary").not().isEmpty(),
	validateFields
], googleSignIn)


module.exports = router;
