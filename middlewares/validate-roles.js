const { request, response } = require("express");

const isAdminRole = (req = request, res = response, next) => {

  if (!req.user) return res.status(500).json({
    msg: "We required to verify the role without validate first the token"
  });

  const { role, name } = req.user;

  if (role !== 'ADMIN_ROLE') return res.status(401).json({
    msg: `${name}: doesn't have permission to take this action`
  });

  next();

};

const hasRole = (...roles) => (req = request, res = response, next) => {
  console.log("🚀 ~ file: validate-roles.js:20 ~ hasRole ~ roles", roles);
  const { user } = req;
  if (!user) return res.status(500).json({
    msg: "We required to verify the role without validate first the token"
  });

  if (!roles.includes(user.role)) return res.status(401).json({
    msg: `The user required to have one of the specific roles: ${roles}`
  });

  next();
};




module.exports = { isAdminRole, hasRole };