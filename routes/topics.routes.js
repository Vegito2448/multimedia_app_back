const { Router } = require("express");
const { check } = require("express-validator");
const {
  createTopic,
  getTopics,
  getTopic,
  updateTopic,
  deleteTopic,
} = require("../controllers/topics.controller");
const { existsTopic, isANumber } = require("../helpers/db-validators");

const router = Router();

const {
  validateFields,
  validateJWT,
  isAdminRole,
  validateAllowedContentTypes,
} = require("../middlewares");

/**
 * @route   GET api/topics
 */
// Get all topics - public
router.get(
  "/",
  [check("from").custom(isANumber), check("limit").custom(isANumber)],
  getTopics
);

// Get one topic by ID - public
router.get(
  "/:id",
  [
    check("id", "is not a valid ID").isMongoId(),
    check("id").custom(existsTopic),
    validateFields,
  ],
  getTopic
);

// Create new topic - private - any role with token valid
router.post(
  "/",
  [
    validateJWT,
    check("name", "The name is mandatory").notEmpty(),
    validateFields,
    validateAllowedContentTypes,
    check("_id", "user")
      .isMongoId()
      .withMessage("User ID must be a valid MongoDB ObjectId"),
  ],
  createTopic
);

// Update topic - private - any role with token valid
router.put(
  "/:id",
  [
    validateJWT,
    check("id", "is not a valid ID").isMongoId(),
    check("id").custom(existsTopic),
    check("name", "The name is mandatory").notEmpty(),
    validateFields,
    check("_id", "user")
      .isMongoId()
      .withMessage("User ID must be a valid MongoDB ObjectId"),
    validateAllowedContentTypes,
  ],
  updateTopic
);

// Delete topic - private - Admin role
router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "is not a valid ID").isMongoId(),
    check("id").custom(existsTopic),
    validateFields,
    check("_id", "user")
      .isMongoId()
      .withMessage("User ID must be a valid MongoDB ObjectId"),
  ],
  deleteTopic
);
module.exports = router;
