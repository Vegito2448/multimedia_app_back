const router = require('express').Router();
const { check } = require('express-validator');
const {
  uploadFile,
  showImage,
  updateImageCloudinary,
  deleteFile,
} = require("../controllers/uploads.controller");

const { allowedCollections } = require("../helpers");

const { validateFields, validateFileToUpload } = require("../middlewares");

router.post("/", validateFileToUpload, uploadFile);

router.put(
  "/:collection/:id",
  [
    validateFileToUpload,
    check("id", "id should be a mongo id").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["user", "content"])
    ),
    validateFields,
  ],
  /* updateImage */ updateImageCloudinary
);

router.get(
  "/:collection/:id",
  [
    check("id", "id should be a mongo id").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["user", "content"])
    ),
    validateFields,
  ],
  showImage
);

router.delete(
  "/:collection/:id",
  [
    check("id", "id should be a mongo id").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["user", "content"])
    ),
    validateFields,
  ],
  deleteFile
);

module.exports = router;
