const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler');
const jwtToken = require('jsonwebtoken');
var { expressjwt: jwt } = require("express-jwt");

exports.signup = async (req, res) => {
    console.log("err", req.boddy);
    try {
        const user = await User.create(req.body);

        // Hide sensitive information before sending the response
        user.salt = undefined;
        user.hashed_password = undefined;

        res.json({ user });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err) // Assuming errorHandler is properly defined
        });
    }
    // try {
    //     const savedUser = await user.save();

    //     savedUser.salt = undefined;
    //     savedUser.hashed_password = undefined;

    //     res.json({ savedUser })

    // }
    // catch (err) {

    //     res.status(400).json({
    //         err: errorHandler(err)
    //     })
    // }
}

exports.signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                err: 'User with that email does not exist. Please signup'
            });
        }

        const isMatch = await user.authenticate(password);
        if (!isMatch) {
            return res.status(401).json({
                error: `Email and password doesn't match`
            });
        }

        const token = jwtToken.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.cookie('t', token, { expire: new Date() + 9999 });

        const { _id, name, role } = user;
        return res.json({ token, user: { _id, name, email, role } });
    } catch (err) {
        return res.status(400).json({ err });
    }
}

exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({ message: "Signout success" });
}

exports.requireSignin = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth"
})

exports.isAuth = (req, res, next) => {
    console.log("is Auth ===> req.profile", req.profile);
    console.log("is Auth ===> req.auth", req.auth);
    console.log("is Auth ===> req.profile._id", req.profile._id);
    console.log("is Auth ===> req.auth._id", req.auth._id);


    let user = req.profile && req.auth
        && req.profile._id.toString() === req.auth._id;

    if (!user) {
        return res.status(403).json({
            error: 'Access denied!'
        });
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if (req.profile?.role === 0) {
        return res.status(403).json({
            error: 'Admin resource! Access denied'
        });
    }
    next();
}
