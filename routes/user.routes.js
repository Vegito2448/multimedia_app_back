const { Router } = require('express');
const { check } = require("express-validator");

const {
  validateFields,
  validateJWT,
  conditionalValidateJWT,
  hasRole,
} = require("../middlewares");

const {
  isRoleValid,
  emailExists,
  existsUserById,
  isANumber,
} = require("../helpers/db-validators");

const {
  usersGet,
  userGet,
  usersDelete,
  usersPut,
  usersPost,
} = require("../controllers/users.controller");

const router = Router();

router.get(
  "/",
  [check("from").custom(isANumber), check("limit").custom(isANumber)],
  usersGet
);

router.get(
  "/:id",
  [
    check("id", "is not a valid ID").isMongoId(),
    check("id").custom(existsUserById),
    validateFields,
  ],
  userGet
);

router.put(
  "/:id",
  [
    validateJWT,
    check("id", "is not a valid ID").isMongoId(),
    check("id").custom(existsUserById),
    check("role").custom(isRoleValid),
    check("role", "Is not a valid role").isIn(["admin", "creator", "reader"]),
    check("mail", "Email is not valid").isEmail(),
    validateFields,
  ],
  usersPut
);

router.post(
  "/",
  [
    check("userName", "username is mandatory").not().isEmpty(),
    check("password", "password is mandatory and more 6 characters").isLength({
      min: 8,
    }),
    check("role", "Is not a valid role").isIn(["admin", "creator", "reader"]),
    check("role", "role is mandatory").not().isEmpty(),
    check("mail", "Email is not valid").isEmail(),
    check("mail").custom(emailExists),
    check("role").custom(isRoleValid),
    conditionalValidateJWT,
    validateFields,
  ],
  usersPost
);

router.delete(
  "/:id",
  [
    validateJWT,
    // isAdminRole this middleware force to user to have ADMIN Permissions,
    hasRole("admin"),
    check("id", "is not a valid ID").isMongoId(),
    check("id").custom(existsUserById),
    validateFields,
  ],
  usersDelete
);

module.exports = router;
