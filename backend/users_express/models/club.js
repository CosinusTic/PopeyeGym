const mongoose = require("mongoose");

const ClubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    tel: {
        type: String,
        required: true,
    },
    location: {
        lon: {
            type: Number,
            required: true,
        },
        lat: {
            type: Number,
            required: true,
        }
    },
});

const Club = mongoose.model("fitness_clubs", ClubSchema);
module.exports = Club;
