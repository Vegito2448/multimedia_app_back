const jwt = require('jsonwebtoken');

const generateJWT = async (uid = '') => new Promise((resolve, reject) => {
  const payload = { uid };
  jwt.sign(payload, process.env.SECRETORPRIVATEKEY, { expiresIn: '4h' }, (err, token) =>
    err ?
      reject('Ey!, we cannot generate JSON WEB TOKEN') :
      resolve(token)
  );
});
module.exports = { generateJWT };