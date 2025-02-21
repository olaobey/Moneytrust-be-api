# **ComX Registration and Authentication System**
This project is a Node.js and Express.js backend application designed to handle user registration, authentication, and account management for a platform that supports both Individual and Corporate users. It includes features such as:

- User Registration: Separate registration flows for Individual and Corporate users.
  - Individual: First name, last name, email, password, and phone number.
  - Corporate: Company name, type of business, date of incorporation, email, password, and phone number.
- Account Verification: Email-based verification using a 4-digit code.
- Login: Secure login with JWT-based authentication.
- Password Management: Forgot password and reset password functionality.
- Database: Uses MongoDB for storing user data.
- Security: Password hashing with bcryptjs and token-based authentication with JSON Web Tokens (JWT).
  
This project is a robust and scalable solution for platforms requiring dual user-type registration and secure authentication.

Technologies Used:
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT, bcryptjs
- Email Verification: Nodemailer (simulated for demonstration purposes)

Before you can run the API, you will need to have the following installed:

- Node.js

- Mongodb 

### **Installing**

Clone the repository to your local machine.

In the root directory, create a .env file and add the
following environment variables:

1. Clone the repository to your local machine.
2. Install the required dependencies with npm install
3. In the root directory, create a **`.env`** file based on the **`.env.example`** file, and update the values as needed with the following variables

- MONGO_DB= **`mongodb localhost`**
- PORT= **`specified number`**
- NODE_ENV= **`stage of the project`**

4. Run **`npm install`** to install the required packages.
5. The API server will start running on http://localhost:3000. You can now send HTTP requests to the API endpoints.

