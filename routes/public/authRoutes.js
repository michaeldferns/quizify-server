const { Router } = require('express');
const passport = require('passport');
const authController = require('../../controllers/authController');

const router = Router();

router.post('/signup', authController.signup);

router.post('/login', authController.login);

module.exports = router;
