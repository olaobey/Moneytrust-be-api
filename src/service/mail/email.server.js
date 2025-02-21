const nodemailer = require('nodemailer');
const dotenv = require("dotenv");

dotenv.config();



const smtp = {
  host: process.env.EMAIL_HOST,
  port: process.env.SEND_MAIL_PORT,
  user: process.env.EMAIL_USERNAME,
  pass: process.env.EMAIL_PASSWORD,
};

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: smtp.host,
  port: smtp.port,
  secure: true,
  auth: {
    user: smtp.user,
    pass: smtp.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = { transporter };
