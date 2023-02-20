const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
    id_user: {
        required: true,
        type: String
    }, 
    id_coach: {
        required: true, 
        type: String
    }, 
    date: {
        required: true, 
        type: Date
    },
    created_at: {
        required: true, 
        type: Date
    }
});

const Appointment = mongoose.model("appointments", AppointmentSchema);
module.exports = Appointment;