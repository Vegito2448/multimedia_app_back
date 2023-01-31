const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { validateFields } = require('../middlewares/validate-fields');

const { isRoleValid, emailExists, existsUserById, isANumber } = require('../helpers/db-validators');

const { login } = require('../controllers/auth.controller');


router.post('/login', [
	check('mail', "mail is Mandatory").isEmail(),
	check('password', "password is Mandatory").not().isEmpty(),
	validateFields,
], login);


module.exports = router;
