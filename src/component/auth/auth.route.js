const express = require('express');
const {
  register,
  signin,
  verifyOTP,
  forgotPassword,
  resetPassword,
} = require('./auth.controller');
const {
  signupValidation,
  signinValidation,
  verifyOTPValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require('../../validations/user.validator');
const validate = require('../../middleware/validate');

const router = express.Router();

router.route('/register').post([...signupValidation(), validate], register);

router.route('/signin').post([...signinValidation(), validate], signin);

router.route('/verify').post([...verifyOTPValidation(), validate], verifyOTP);

router
  .route('/forgot')
  .post([...forgotPasswordValidation(), validate], forgotPassword);

router
  .route('/reset')
  .patch([...resetPasswordValidation(), validate], resetPassword);

module.exports = router;
