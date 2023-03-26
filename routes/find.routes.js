const router = require('express').Router();
const { check } = require('express-validator');
const { find } = require('../controllers/find.controller');

router.get('/:collection/:searchTerm', find);
module.exports = router;