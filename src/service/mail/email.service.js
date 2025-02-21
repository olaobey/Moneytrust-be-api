const bcrypt = require('bcryptjs');
const logger = require('../../utils/logger');
const { transporter } = require('./email.server');
const {
  otpEmailTemplate,
  welcomeEmailTemplate,
  resetPasswordEmailTemplate,
} = require('./email.template');

// Send OTP Email and Save New OTP in Database
const sendOTPemail = async (user, OTPModel) => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const mailOptions = {
      from: '"OTP Verification" <olaobey15@gmail.com>',
      to: `<${user.email}>`,
      subject: 'Verify Your Email',
      html: otpEmailTemplate(otp, '5 Minutes'),
    };

    const hashedOTP = await bcrypt.hash(otp, 10);
    await OTPModel.create({
      userId: user._id,
      hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 300000, // Expires in 5 minutes
    });

    await transporter.sendMail(mailOptions);
    logger.info({ msg: 'Check Your Email for OTP Code' });
  } catch (err) {
    logger.error(err);
    logger.error({ err: 'Internal Server Error' });
  }
};

const registerSuccessEmail = async (user) => {
  try {
    const mailOptions = {
      from: '"New Registration" <olaobey15@gmail.com>',
      to: `<${user.email}>`,
      subject: 'New User Welcome Email',
      html: welcomeEmailTemplate(user),
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    logger.error(err);
    logger.error({ err: 'Internal Server Error' });
  }
};

const sendPasswordResetLink = async (user, OTPModel) => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const mailOptions = {
      from: '"Reset Password" <olaobey15@gmail.com>',
      to: `<${user.email}>`,
      subject: 'Reset Password',
      html: resetPasswordEmailTemplate(otp, '5 Minutes'),
    };

    const hashedOTP = await bcrypt.hash(otp, 10);
    await OTPModel.create({
      userId: user._id,
      hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 300000, // Expires in 5 minutes
    });

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        logger.error(err);
      }
      logger.info(`Email sent: ${info.response}`);
    });
    logger.info({ msg: 'Check your email to reset password' });
  } catch (err) {
    logger.error(err);
    logger.error({ err: 'Internal Server Error' });
  }
};

module.exports = {
  sendOTPemail,
  registerSuccessEmail,
  sendPasswordResetLink,
};
