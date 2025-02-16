const express = require('express');
const router = express.Router();
const authController = require(`${__dirname}/../controllers`).auth;
const passport = require('passport');
require('../config/passport')(passport);

router.post('/login', authController.login);
router.post('/reset', authController.resetPassword);
router.post('/change', authController.changePassword);
router.post('/', authController.loginCheck);

module.exports = router;
