const { check, validationResult } = require('express-validator');

// Middleware to Handle Validation Errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        param: err.param || 'unknown',
        msg: err.msg,
      })),
    });
  }
  next();
};

module.exports = validate;
