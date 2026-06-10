const { body, validationResult } = require('express-validator');

exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'Name is required').notEmpty()
    req.check('email', 'Email must be between 3 too 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 4,
            max: 32
        });
    req.check('password', 'Password is required').notEmpty()
    req.check('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a Number');

    const errors = req.validationErrors()

    if (errors) {
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({ error: firstError });
    }

    next();
}

// Middleware that returns 400 if any express-validator checks failed
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
};

exports.orderValidator = [
    body('order.products')
        .isArray({ min: 1 })
        .withMessage('Order must contain at least one product'),
    body('order.amount')
        .isFloat({ min: 0 })
        .withMessage('Amount must be a positive number'),
    body('order.address')
        .notEmpty().trim()
        .withMessage('Delivery address is required'),
    body('order.transaction_id')
        .notEmpty().trim()
        .withMessage('Transaction ID is required'),
];