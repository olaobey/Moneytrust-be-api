const dotenv = require('dotenv');

dotenv.config();

// Function to generate email header
const emailHeader = (title) => {
  return `
<!doctype html>
<html lang="en-US">
<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>${title}</title>
    <meta name="description" content="Email From Monettrust Microfinance bank .">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
    </style>
</head>
<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px; margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:25px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <a href="https://lh3.googleusercontent.com/a/ACg8ocI4uBFa9Q6CU0E-DIY5VW_lSV6zLw1MRzcWpLtvbl7ADIdbJw8=s96-c" title="logo" target="_blank">
                            <img width="80px" src="${process.env.BASEURL}" title="logo" alt="logo">
                          </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:10px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px; background:#fff; border-radius:3px; text-align:center; box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;">${title}</h1>
    `;
};

// Function to generate email footer
const emailFooter = () => {
  return `
    </td>
    </tr>
    <tr>
     <td style="height:40px;">&nbsp;</td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <p style="font-size:14px; color:rgba(69, 80, 86, 0.74); line-height:18px;">&copy; <strong>Moneytrust Microfinance BankApp</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:25px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
};

// Function to generate OTP email template
const otpEmailTemplate = (link, duration) => {
  return `
     ${emailHeader('OTP Verification')}
       <p style="color:#455056; font-size:15px; line-height:24px; margin-top:10px;">
          Use This OTP to complete your registration
         <br>
         Note that this verification code expires in <strong>${duration}</strong>
        </p>
         <a href="#"
          style="background:#20e277;text-decoration:none; font-weight:500; margin-top:35px; color:#fff; text-transform:uppercase; font-size:16px; padding:10px 24px; display:inline-block; border-radius:50px;">${link}
         </a>
      ${emailFooter()}
  `;
};

// Function to generate password reset email template
const resetPasswordEmailTemplate = (link, duration) => {
  return `
    ${emailHeader('Password Reset Request')}
    <p style="color: #455056; font-size: 15px; line-height: 24px; margin-top: 10px;">
      You or someone has requested a password reset. If this was not you, please ignore this message.
      Otherwise, use the reset password code below to reset your password.
      <br>
      Note that this reset password code expires in <strong>${duration}</strong>.
    </p>
    <a href="#"
          style="background:#20e277;text-decoration:none; font-weight:500; margin-top:35px; color:#fff; text-transform:uppercase; font-size:16px; padding:10px 24px; display:inline-block; border-radius:50px;">${link}
         </a>
    ${emailFooter()}
  `;
};

// Function to generate welcome email template
const welcomeEmailTemplate = (user) => {
  const { firstName, companyName, userType } = user;
  return `
       ${emailHeader('welcome to our platform!')}
         <p style="color:#455056; font-size:15px; line-height:24px; margin-top:10px;">
         Dear ${
           userType === 'individual' ? firstName : companyName
         }, your registration is now complete.<br> 
       You may proceed to your dashboard and start trading your commodities.
        </p>
         ${emailFooter()}
  `;
};

module.exports = {
  otpEmailTemplate,
  resetPasswordEmailTemplate,
  welcomeEmailTemplate,
};
