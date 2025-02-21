const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { generateAccessToken } = require('../../middleware/authorization');
const User = require('../../model/user');
const {
  sendOTPemail,
  registerSuccessEmail,
  sendPasswordResetLink,
} = require('../../service/mail/email.service');
const UserOTPRecord = require('../../model/userOtpRecord');
const dotenv = require('dotenv');

dotenv.config();

const register = async (req, res) => {
  try {
    const {
      userType,
      firstName,
      lastName,
      companyName,
      businessType,
      incorporationDate,
      email,
      password,
      phoneNumber,
    } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    }).exec();

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(409).json({
          message: 'Email already exists and is already verified.',
          success: false,
        });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;

    if (userType === 'individual') {
      newUser = new User({
        userType,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
      });
    } else if (userType === 'corporate') {
      newUser = new User({
        userType,
        companyName,
        businessType,
        incorporationDate,
        email,
        password: hashedPassword,
        phoneNumber,
      });
    } else {
      return res
        .status(400)
        .json({ message: 'Invalid user type', success: false });
    }

    await newUser.save();

    // Send OTP email for user to verify their email and also create new OTP Record in DB
    await sendOTPemail(newUser, UserOTPRecord);

    res.status(201).json({
      message: `User account successfully created and OTP has been sent to ${newUser.email}`,
      success: true,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({
      message: 'Server error',
      success: false,
    });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: 'Invalid email or password', success: false });
    }
    // Check if user is verified
    if (!existingUser.isVerified) {
      // Find and delete any existing OTP
      await UserOTPRecord.findOneAndDelete({
        userId: existingUser._id,
      });
      return res
        .status(401)
        .json({ message: 'You have not verified yet', success: false });
    }
    //check if the password valid
    const comparedPassword = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!comparedPassword) {
      return res
        .status(401)
        .json({ message: 'Invalid password', success: false });
    }
    /// Cookie options
    const cookiesOptions = {
      httpOnly: true,
      sameSite: 'lax',
    };

    if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;

    const accessTokenCookieOptions = {
      ...cookiesOptions,
      expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
    };

    // Generate JWT token
    const access_token = generateAccessToken(existingUser);

    // Construct user data response
    const userData = {
      _id: existingUser._id,
      userType: existingUser.userType,
      firstName: existingUser.firstName || null,
      lastName: existingUser.lastName || null,
      companyName: existingUser.companyName || null,
      typeOfBusiness: existingUser.typeOfBusiness || null,
      dateOfIncorporation: existingUser.dateOfIncorporation || null,
      email: existingUser.email,
      phoneNumber: existingUser.phoneNumber,
      isVerified: existingUser.isVerified,
      profileImage: existingUser.profileImage,
    };

    res.cookie('access_token', access_token, accessTokenCookieOptions);
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });
    res.status(200).json({
      message: 'Signed in successfully',
      data: {
        user: userData,
        access_token,
      },
      success: true,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({
      message: 'Server error',
      success: false,
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;

    // Find the user
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (!existingUser) {
      return res.status(404).json({
        message: 'The email address does not exist',
        success: false,
      });
    }

    // Check if user is already verified
    if (existingUser.isVerified) {
      return res.status(409).json({
        message: 'Account already verified',
        success: false,
      });
    }

    // Find the OTP record
    const userOTPrecord = await UserOTPRecord.findOne({
      userId: existingUser._id,
    });
    if (!userOTPrecord) {
      return res.status(400).json({
        message: 'No OTP records found. Please request a new OTP.',
        success: false,
      });
    }

    // Check if OTP has expired
    if (userOTPrecord.expiresAt.getTime() < Date.now()) {
      await UserOTPRecord.deleteOne({ userId: existingUser._id });
      return res.status(400).json({
        message: 'OTP has expired. Please request a new OTP.',
        success: false,
      });
    }

    // Compare the provided OTP with the hashed OTP
    const isOTPCorrect = await bcrypt.compare(otp, userOTPrecord.hashedOTP);
    if (!isOTPCorrect) {
      return res.status(400).json({
        message: 'Invalid OTP',
        success: false,
      });
    }

    // OTP is valid: Update user and delete OTP record
    existingUser.isVerified = true;
    await existingUser.save();
    await UserOTPRecord.deleteOne({ userId: existingUser._id });

    // Send successful registration email
    await registerSuccessEmail(existingUser);

    return res.status(200).json({
      message: 'Account verified successfully',
      success: true,
      data: {
        userId: existingUser._id,
        email: existingUser.email,
        isVerified: existingUser.isVerified,
      },
    });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    return res.status(500).json({
      message: 'Server error',
      success: false,
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (!existingUser) {
      return res.status(404).json({
        message: 'The email address does not exist',
        success: false,
      });
    }

    await sendPasswordResetLink(existingUser, UserOTPRecord);

    res.status(200).json({
      message:
        'Forgot password request has been activated. Please check your email.',
      success: true,
    });
  } catch (error) {
    console.error('Error in attempting forgotPassword:', error);
    return res.status(500).json({
      message: 'Server error',
      success: false,
    });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (!existingUser) {
      return res.status(404).json({
        message: 'The email address does not exist',
        success: false,
      });
    }

    // Find the OTP record
    const userOTPrecord = await UserOTPRecord.find({
      userId: existingUser._id,
      expiresAt: { $gte: new Date() },
    }).lean();
    if (!userOTPrecord || userOTPrecord.length === 0) {
      return res.status(400).json({
        message: 'No OTP records found. Please request a new OTP.',
        success: false,
      });
    }
    // check expiry of OTP
    const { expiresAt, hashedOTP } = userOTPrecord[0];
    // Convert expiresAt to a timestamp
    if (new Date(expiresAt) < new Date()) {
      // Delete the OTP record if it has expired
      await UserOTPRecord.deleteMany({ userId: existingUser._id });
      return res.status(400).json({
        message: 'OTP has Expired, Please request a new OTP.',
        success: false,
      });
    }

    // If OTP is Valid, verify User Email by comparing OTP with hashed OTP
    const isOTPCorrect = await bcrypt.compare(otp, hashedOTP);
    if (!isOTPCorrect) {
      return res.status(400).json({
        message: 'Invalid OTP',
        success: false,
      });
    }

    // Check if the provided password matches the user's current password
    const isMatch = await bcrypt.compare(newPassword, existingUser.password);
    if (isMatch) {
      return res.status(400).json({
        message: 'New password must be different from the current password',
        success: false,
      });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
    // Update the user's password
    await User.findOneAndUpdate(
      { _id: existingUser._id },
      { password: hashedPassword },
    );
    res.status(200).json({
      message: 'New password successfully reset',
      success: true,
    });
  } catch (error) {
    console.error('Error occurs in resetting password :', error);
    return res.status(500).json({
      message: 'Server error',
      success: false,
    });
  }
};

module.exports = {
  register,
  signin,
  verifyOTP,
  forgotPassword,
  resetPassword,
};
