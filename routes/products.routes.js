const { Router } = require('express');
const { check } = require('express-validator');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/products.controller');
const { existsProduct, isANumber, existsCategory } = require('../helpers/db-validators');

const router = Router();

const { validateFields, validateJWT, isAdminRole } = require('../middlewares/');

/**
 * @route   GET api/products
*/
// Get all products - public
router.get('/', [
  check('from').custom(isANumber),
  check('limit').custom(isANumber)
], getProducts);

// Get one product by ID - public
router.get('/:id', [
  check('id', 'is not a valid ID').isMongoId(),
  check('id').custom(existsProduct),
  validateFields
], getProduct);

// Create new product - private - any role with token valid
router.post('/', [
  validateJWT,
  check('name', 'The name is mandatory').notEmpty(),
  check('category', 'is not a valid ID').isMongoId(),
  check('category').custom(existsCategory),
  validateFields,
  check('_id', 'user').isMongoId().withMessage('User ID must be a valid MongoDB ObjectId'),
], createProduct);

// Update product - private - any role with token valid
router.put('/:id', [
  validateJWT,
  check('id', 'is not a valid ID').isMongoId(),
  check('id').custom(existsProduct),
  check('name', 'The name is mandatory').notEmpty(),
  validateFields,
  check('category', 'is not a valid ID').isMongoId(),
  check('category').custom(existsCategory),
  check('_id', 'user').isMongoId().withMessage('User ID must be a valid MongoDB ObjectId'),
], updateProduct);

// Delete product - private - Admin role
router.delete('/:id', [
  validateJWT,
  isAdminRole,
  check('id', 'is not a valid ID').isMongoId(),
  check('id').custom(existsProduct),
  validateFields,
  check('_id', 'user').isMongoId().withMessage('User ID must be a valid MongoDB ObjectId'),
], deleteProduct);
module.exports = router;
