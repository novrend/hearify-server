const jwt = require("jsonwebtoken");
const signJWT = (obj) => {
  return jwt.sign(obj, process.env.SECRET_TOKEN);
};
const verifyJWT = (access_token) => {
  return jwt.verify(access_token, process.env.SECRET_TOKEN);
};

module.exports = { signJWT, verifyJWT };
