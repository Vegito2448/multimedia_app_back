const { Router } = require('express');
const { check } = require('express-validator');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categories.controller');
const { existsCategory, isANumber } = require('../helpers/db-validators');

const router = Router();

const { validateFields, validateJWT, isAdminRole } = require("../middlewares/");
/*
 * @route   GET api/categories
 */
// Get all categories - public
router.get(
  "/",
  [check("from").isNumeric(), check("limit").custom(isANumber)],
  getCategories
);

// Get one category by ID - public
router.get(
  "/:id",
  [
    check("id", "is not a valid ID").isMongoId(),
    check("id").custom(existsCategory),
    validateFields,
  ],
  getCategory
);

// Create new category - private - any role with token valid
router.post(
  "/",
  [
    validateJWT,
    check("name", "The name is mandatory").not().isEmpty(),
    // verify that allowedContentTypes is an array of mongoId
    check("type").isIn(["image", "video", "audio", "document"]),
    validateFields,
  ],
  createCategory
);

// Update category - private - any role with token valid
router.put(
  "/:id",
  [
    validateJWT,
    check("id", "is not a valid ID").isMongoId(),
    check("id").custom(existsCategory),
    check("name", "The name is mandatory").not().isEmpty(),
    check("type").isIn(["image", "video", "audio", "document"]),
    validateFields,
  ],
  updateCategory
);

// Delete category - private - Admin role
router.delete('/:id', [
	validateJWT,
	isAdminRole,
	check('id', 'is not a valid ID').isMongoId(),
	check('id').custom(existsCategory),
	validateFields,
], deleteCategory);
module.exports = router;
