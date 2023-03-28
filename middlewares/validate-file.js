const { request, response } = require("express");

const validateFileToUpload = (req = request, res = response, next) =>
  !req.files || !Object.keys(req.files).length || !req.files.file ?
    res.status(400).json({ msg: 'No files were uploaded - validateFileToUpload.' }) : next();


module.exports = {
  validateFileToUpload
};