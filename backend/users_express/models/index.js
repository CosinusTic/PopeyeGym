const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        default: 0,
    },
    token: String
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
