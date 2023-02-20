const mongoose = require("mongoose");

const CoachSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    nature: {
        type: String,
        required: false,
    },
    busy: {
        type: Array,
        default: [],
    },
    rate: {
        type: Array,
        default: [],
    },
    photo: {
        type: String,
        required: false,
    },
    status: {
        type: Number,
        default: 0,
    },
    token: String
});

const Coach = mongoose.model("Coach", CoachSchema);
module.exports = Coach;