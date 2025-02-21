const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

//Generate Access Token
const generateAccessToken = (user) => {
  const payload = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    role: user.role,
    email: user.email,
    status: 'login',
    isVerified: user.isVerified,
  };

  const secret = process.env.ACCESS_TOKEN; // This must be the JWT secret key
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || '24h';
  return jwt.sign(payload, secret, {
    expiresIn,
    algorithm: 'HS256',
  });
};

module.exports = { generateAccessToken };
