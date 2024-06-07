const { Router } = require("express");
const { check } = require("express-validator");
const {
  createContent,
  getContents,
  getContent,
  updateContent,
  deleteContent,
} = require("../controllers/contents.controller");
const { existsContent, isANumber } = require("../helpers/db-validators");

const router = Router();

const { validateFields, validateJWT, isAdminRole } = require("../middlewares/");
/*
 * @route   GET api/contents
 */
// Get all contents - public
router.get(
  "/",
  [check("from").custom(isANumber), check("limit").custom(isANumber)],
  getContents
);

// Get one content by ID - public
router.get(
  "/:id",
  [
    check("id", "is not a valid ID").isMongoId(),
    check("id").custom(existsContent),
    validateFields,
  ],
  getContent
);

// Create new content - private role with token valid - any role
router.post(
  "/",
  [
    validateJWT,
    check("title", "The title is mandatory").not().isEmpty(),
    check("type").isIn(["video", "image", "document"]),
    check("description", "The description is mandatory").not().isEmpty(),
    check("category", "The category is mandatory").isMongoId(),
    check("topic", "The topic is mandatory").isMongoId(),
    validateFields,
  ],
  createContent
);

// Update content - private - any role with token valid
router.put(
  "/:id",
  [
    validateJWT,
    check("id", "is not a valid ID").isMongoId(),
    check("id").custom(existsContent),
    check("title", "The title is mandatory").not().isEmpty(),
    check("type").isIn(["video", "image", "document"]),
    check("description", "The description is mandatory").not().isEmpty(),
    check("category", "The category is mandatory").isMongoId(),
    check("topic", "The topic is mandatory").isMongoId(),
    validateFields,
  ],
  updateContent
);

// Delete content - private - Admin role
router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "is not a valid ID").isMongoId(),
    check("id").custom(existsContent),
    validateFields,
  ],
  deleteContent
);
module.exports = router;
