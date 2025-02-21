const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ['individual', 'corporate'],
    required: true,
  },
  firstName: {
    type: String,
    required: function () {
      return this.userType === 'individual';
    },
  },
  lastName: {
    type: String,
    required: function () {
      return this.userType === 'individual';
    },
    profileImage: {
      type: String,
      default:
        'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
  },
  companyName: {
    type: String,
    required: function () {
      return this.userType === 'corporate';
    },
  },
  businessType: {
    type: String,
    required: function () {
      return this.userType === 'corporate';
    },
  },
  incorporationDate: {
    type: Date,
    required: function () {
      return this.userType === 'corporate';
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('User', UserSchema);
