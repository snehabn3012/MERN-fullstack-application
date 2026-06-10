const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxLength: 32
        },
        email: {
            type: String,
            trim: true,
            required: true,
            maxLength: 32
        },
        hashed_password: {
            type: String,
            required: true,
        },
        about: {
            type: String,
            trim: true,
        },
        role: {
            type: Number,
            default: 0
        },
        history: {
            type: Array,
            default: []
        }
    },
    { timestamps: true }
);

userSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.hashed_password = bcrypt.hashSync(password, 10);
    })
    .get(function () {
        return this._password;
    });

userSchema.methods = {
    authenticate: function (plainText) {
        return bcrypt.compare(plainText, this.hashed_password);
    }
};

module.exports = mongoose.model("User", userSchema);