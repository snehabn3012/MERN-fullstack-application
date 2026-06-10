const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const { signup, signin, signout, requireSignin } = require('../controllers/auth');
const { userSignupValidator } = require('../validator');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { error: 'Too many attempts, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/signup', authLimiter, userSignupValidator, signup);
router.post('/signin', authLimiter, signin);
router.get('/signout', signout);

module.exports = router;