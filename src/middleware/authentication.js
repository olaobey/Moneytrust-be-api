const jwt = require('jsonwebtoken');
const User = require('../model/user');
const dotenv = require('dotenv');

dotenv.config();

const ensureAuthenticate = async (req, res, next) => {
  try {
    let access_token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      access_token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) {
      return res.status(403).json({
        message: 'ACCESS FORBIDDEN! Authorization headers is required.',
        success: false,
      });
    }

    // Validate the access token
    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN);

    if (!decoded || !decoded._id) {
      return res.status(404).json({
        message:
          'JWT TOKEN INVALID! JWT token is expired/ not valid. Please logout and login again.',
        success: false,
      });
    }

    const user = await User.findById(decoded._id.toString());
    if (!user) {
      return res.status(401).json({
        message: 'Authentication failed. User not found.',
        success: false,
      });
    }

    // Store user in res.locals
    res.locals.user = user;

    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    return res.status(401).json({
      message: 'Authentication failed.',
      success: false,
    });
  }
};

module.exports = ensureAuthenticate;
