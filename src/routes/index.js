const express = require('express');
const authRoute = require('../component/auth/auth.route');

const router = express.Router();

router.use('/secure', authRoute);

module.exports = router;
