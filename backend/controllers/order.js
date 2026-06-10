const { Order, CartItem } = require("../models/order");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.orderById = (req, res, next, id) => {
    Order.findById(id)
        .populate("products.product", "name price")
        .lean()
        .exec()
        .then((order) => {
            if (!order) return res.status(404).json({ error: "Order not found" });
            req.order = order;
            next();
        })
        .catch((error) => res.status(400).json({ error: errorHandler(error) }));
};

exports.createOrder = (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save()
        .then((data) => res.json(data))
        .catch((error) => res.status(400).json({ error: errorHandler(error) }));
};

exports.listOrders = (req, res) => {
    Order.find()
        .populate("user", "_id name address")
        .sort("-createdAt")
        .limit(100)
        .lean()
        .exec()
        .then((orders) => res.json(orders))
        .catch((err) => res.status(400).json({ error: errorHandler(err) }));
};

exports.getStatusValues = (req, res) => {
    res.json(Order.schema.path("status").enumValues);
};

exports.updateOrderStatus = (req, res) => {
    Order.updateOne(
        { _id: req.body.orderId },
        { $set: { status: req.body.status } },
        { runValidators: true }
    )
        .then((order) => res.json(order))
        .catch((err) => res.status(400).json({ error: errorHandler(err) }));
};
