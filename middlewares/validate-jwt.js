const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const validateJWT = async (req = request, res = response, next) => {

  const token = req.header('x-token');


  if (!token)
    return res.status(401).json({
      msg: "there's no token in the request",
    });

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // read user that correspond to UID

    const user = await User.findById(uid);

    // verify if user status is true

    if (!(user || user.status))
      return res.status(401).json({
        msg: "token isn't valid - user status false or doesn't exist",
      });

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      msg: "there's no valid token. error:" + error.message,
    });
  }


};

const conditionalValidateJWT = (req, res, next) => {
  if (req.header("x-token")) {
    return validateJWT(req, res, next);
  }
  next();
};
module.exports = { validateJWT, conditionalValidateJWT };