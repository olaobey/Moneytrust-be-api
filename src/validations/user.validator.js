const { check, validationResult } = require('express-validator');

// Signup Validation
const signupValidation = () => {
  return [
    check('userType')
      .exists()
      .withMessage('User type is required')
      .isString()
      .withMessage('Account type must be a string')
      .isIn(['individual', 'corporate'])
      .withMessage("User type must be either 'individual' or 'corporate'"),

    // Individual Fields
    check('firstName')
      .if(check('accountType').equals('individual'))
      .exists()
      .withMessage('First name is required for individual accounts')
      .isString()
      .withMessage('First name must be a string'),

    check('lastName')
      .if(check('accountType').equals('individual'))
      .exists()
      .withMessage('Last name is required for individual accounts')
      .isString()
      .withMessage('Last name must be a string'),

    // Corporate Fields
    check('companyName')
      .if(check('accountType').equals('corporate'))
      .exists()
      .withMessage('Company name is required for corporate accounts')
      .isString()
      .withMessage('Company name must be a string'),

    check('businessType')
      .if(check('accountType').equals('corporate'))
      .exists()
      .withMessage('Business type is required for corporate accounts')
      .isString()
      .withMessage('Business type must be a string'),

    check('incorporationDate')
      .if(check('accountType').equals('corporate'))
      .exists()
      .withMessage('Incorporation date is required for corporate accounts')
      .isISO8601()
      .withMessage('Incorporation date must be a valid date'),

    check('email')
      .exists()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format')
      .trim()
      .normalizeEmail(),

    check('phoneNumber')
      .exists()
      .withMessage('Phone number is required')
      .isMobilePhone('any')
      .withMessage('Invalid phone number format')
      .trim(),

    check('password')
      .exists()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .trim(),
  ];
};

// Sign-in Validation
const signinValidation = () => {
  return [
    check('email')
      .isEmail()
      .trim()
      .normalizeEmail()
      .withMessage('Invalid email format')
      .notEmpty()
      .withMessage('Email is required'),

    check('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ];
};

// OTP Verification Validation
const verifyOTPValidation = () => {
  return [
    check('email')
      .isEmail()
      .trim()
      .normalizeEmail()
      .withMessage('Invalid email format')
      .notEmpty()
      .withMessage('Email is required'),

    check('otp')
      .notEmpty()
      .withMessage('OTP is required')
      .isLength({ mmax: 4 })
      .withMessage('OTP must be exactly 6 digits'),
  ];
};

// Forgot Password Validation
const forgotPasswordValidation = () => {
  return [
    check('email')
      .isEmail()
      .trim()
      .normalizeEmail()
      .withMessage('Invalid email format')
      .notEmpty()
      .withMessage('Email is required'),
  ];
};

// Reset Password Validation
const resetPasswordValidation = () => {
  return [
    check('email')
      .isEmail()
      .trim()
      .normalizeEmail()
      .withMessage('Invalid email format')
      .notEmpty()
      .withMessage('Email is required'),

    check('otp')
      .notEmpty()
      .withMessage('OTP is required')
      .isNumeric()
      .withMessage('OTP must be a number')
      .isLength({ min: 4, max: 6 })
      .withMessage('OTP must be between 4 to 6 digits'),

    check('newPassword')
      .notEmpty()
      .withMessage('New password is required')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long'),

    check('confirmPassword')
      .notEmpty()
      .withMessage('Confirm password is required')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Confirm password must match new password');
        }
        return true;
      }),
  ];
};

module.exports = {
  signupValidation,
  signinValidation,
  verifyOTPValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};
