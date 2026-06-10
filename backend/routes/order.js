const express = require('express');
const router = express.Router();

const { userById, addOrderToUserHistory } = require('../controllers/user');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { createOrder, listOrders, getStatusValues, updateOrderStatus } = require('../controllers/order');
const { decreaseQuantity } = require('../controllers/product');
const { orderValidator, validate } = require('../validator');


router.post(
    '/order/create/:userId',
    requireSignin, isAuth, orderValidator, validate, addOrderToUserHistory, decreaseQuantity, createOrder
);

router.get('/order/list/:userId', requireSignin, isAuth, isAdmin, listOrders);

router.get('/order/status-values/:userId', requireSignin, isAuth, isAdmin, getStatusValues);

router.put('/order/:orderId/status/:userId', requireSignin, isAuth, isAdmin, updateOrderStatus);


router.param('userId', userById);

module.exports = router;

