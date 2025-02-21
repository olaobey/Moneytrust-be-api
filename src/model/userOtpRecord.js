const mongoose = require('mongoose');
const userOTPSchema = new mongoose.Schema({
  userId: String,
  hashedOTP: String,
  createdAt: Date,
  expiresAt: Date,
});

module.exports = mongoose.model('UserOTPRecord', userOTPSchema);
