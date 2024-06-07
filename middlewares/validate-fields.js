const { validationResult } = require('express-validator');
const mongoose = require("mongoose");

const validateFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  next();
};

const isValidMongoIdArray = (req, res, next) => {
  const { allowedContentTypes } = req.body;

  // Verifica que allowedContentTypes sea un array
  if (!Array.isArray(allowedContentTypes)) {
    return res.status(400).json({
      msg: "allowedContentTypes is not an array",
    });
  }
  // Usa every para verificar que cada elemento sea un mongoId válido
  const mongoIds = allowedContentTypes.every((id) =>
    mongoose.isValidObjectId(id)
  );

  if (!mongoIds) {
    return res.status(400).json({
      msg: "Some allowedContentTypes aren't a valid mongoId",
    });
  }
};

function verificarAllowedContentTypes(allowedContentTypes) {
  const permittedValues = ["image", "video", "txt", "audio", "document"];
  if (!Array.isArray(allowedContentTypes) || allowedContentTypes.length === 0) {
    return false;
  }
  const unique = new Set(allowedContentTypes);
  return (
    unique.size === allowedContentTypes.length &&
    allowedContentTypes.every((tipo) => permittedValues.includes(tipo))
  );
}

const validateAllowedContentTypes = (req, res, next) => {
  const { allowedContentTypes } = req.body;
  if (!verificarAllowedContentTypes(allowedContentTypes)) {
    return res.status(400).json({
      msg: "allowedContentTypes should be an array with unique values and should contain only image, video, text, audio or document",
    });
  }
  next();
};

module.exports = {
  validateFields,
  isValidMongoIdArray,
  validateAllowedContentTypes,
};