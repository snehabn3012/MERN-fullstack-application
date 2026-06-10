const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay')
const crypto = require('crypto')
require('dotenv').config();
const { requireSignin, isAuth } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { createOrder } = require('../controllers/razorpay');

router.get('/payments/getToken/:userId', requireSignin, isAuth)

router.post('/payment/create/:userId', requireSignin, isAuth, createOrder);

router.post('/payment-capture', (req, res) => {

    // do a validation

    const data = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    data.update(JSON.stringify(req.body))
    const digest = data.digest('hex')

    if (digest === req.headers['x-razorpay-signature']) {

        console.log('request is legit')

        //We can send the response and store information in a database.

        res.json({

            status: 'ok'

        })

    } else {

        res.status(400).send('Invalid signature');

    }
});

router.post('/refund', async (req, res) => {
    try {
        //Verify the payment Id first, then access the Razorpay API.

        const options = {

            payment_id: req.body.paymentId,

            amount: req.body.amount,

        };

        const razorpayResponse = await razorpay.refund(options);

        //We can send the response and store information in a database

        res.send('Successfully refunded')

    } catch (error) {

        console.log(error);

        res.status(400).send('unable to issue a refund');

    }
});

router.param('userId', userById);


module.exports = router;