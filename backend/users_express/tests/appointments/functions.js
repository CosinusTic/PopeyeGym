const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const bcryptjs = require('bcryptjs');


const getAllAppointments = async () => {
    let appointments;
    const options = {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json'
        }
    }
    await fetch('http://localhost:3002/appointments', options)
        .then((response) => response.json())
        .then((response) => appointments = response);

    return appointments;
}

const addAppointment = async(id_coach, id_user) => {
    let appointmentToSave;
    const options = {
        method: 'POST', 
        body: JSON.stringify({
            id_coach: id_coach, 
            id_user: id_user, 
            date: "2100-02-27"
        }), 
        headers: {
            'Content-Type': 'application/json'
        }
    }

    await fetch('http://localhost:3002/addAppointment', options)
        .then((response) => response.json())
        .then((response) => appointmentToSave = response)

    return appointmentToSave;
}

const deleteAppointment = async (appointmentId, appointmentDate, coachId) => {
    let deletedAppointment;
    if(appointmentDate.includes("T")){
        appointmentDate = appointmentDate.split("T")[0];
    }
    const options = {
        method: "DELETE",
        body: JSON.stringify({
          _id: appointmentId,
        }),
        headers: { "Content-Type": "Application/json" },
    };

    
    await fetch("http://localhost:3002/deleteAppointment", options)
          .then((response) => response.json())
          .then(async (response) => {
            deletedAppointment = response;
            })
          .catch((err) => console.log(err));

    return deletedAppointment;
}

const freeCoachSchedule = async (appointmentDate, coachId) => {
    const secondOptions = {
        method: "PUT",
        body: JSON.stringify({
            booking_date: appointmentDate,
            coach_id: coachId,
        }),
        headers: { "Content-Type": "Application/json" },
    };
    let responseToSave;
    await fetch("http://localhost:3002/freeCoachSchedule", secondOptions)
        .then((response) => response.json())
        .then(async (response) => {
            responseToSave = response;
        })
    return responseToSave;
} 
module.exports = {
    getAllAppointments,
    addAppointment, 
    deleteAppointment, 
    freeCoachSchedule
}