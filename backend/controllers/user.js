const User = require('../models/user');
const { Order } = require('../models/order');

exports.userById = async (req, res, next, id) => {
    try {
        const user = await User.findById(id).exec();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        req.profile = user;
        next();
    } catch (err) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
}

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    return res.json(req.profile);
}

exports.update = (req, res) => {
    const { name, about } = req.body;
    const userUpdatePromise = User.findByIdAndUpdate(
        { _id: req.profile._id },
        { $set: { name, about } },
        { new: true }
    );

    userUpdatePromise
        .then((data) => {
            data.hashed_password = undefined
            data.salt = undefined
            return res.json(data);
        })
        .catch((err) => {
            return res.status(400).json({
                error: err || 'Something went wrong!'
            })
        })

}

exports.addOrderToUserHistory = (req, res, next) => {
    let history = [];

    req.body.order.products.forEach((item) => {
        const { _id, name, description, category, count, price } = item;
        const { transaction_id } = req.body.order;

        history.push({
            _id,
            name,
            description,
            category,
            quantity: count,
            transaction_id,
            price
        })
    })

    User.findByIdAndUpdate(
        { _id: req.profile._id },
        { $push: { history: history } },
        { new: true }
    ).then((data) => {
        next();
    }).catch((err) => {
        return res.status(400).json({
            error: err || 'Something went wrong!'
        })
    })
}
exports.purchaseHistory = (req, res) => {
    Order.find({ user: req.profile._id })
        .populate("user", "_id name")
        .sort("-createdAt")
        .limit(50)
        .lean()
        .exec()
        .then((orders) => {
            res.json(orders);
        }).catch((err) => {
            return res.status(400).json({
                error: err || 'Something went wrong!'
            })
        })
};