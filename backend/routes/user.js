const express = require('express');
const router = express.Router()

const { userById, update, read, purchaseHistory } = require('../controllers/user');
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth');

router.put('/user/:userId', requireSignin, isAuth, update)
router.get('/user/:userId', requireSignin, isAuth, read);

router.get('/orders/by/user/:userId', requireSignin, isAuth, purchaseHistory);

router.param('userId', userById)

module.exports = router;