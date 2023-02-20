const functions = require('./functions.js');
let appointments;
let createdAppointmentId;
describe('APPOINTMENTS', () => {
    test('Get all appointments', async () => {
        await functions.getAllAppointments()
            .then(async (response) => {
                expect(await response.length).toBeTruthy();
                appointments = response;
            })
    });

    test('Add appointment', async () => {
        await functions.addAppointment(appointments[0].id_coach, appointments[0].id_user)
            .then(async (response) => {
                expect(await response).toBeDefined();
                createdAppointmentId = response._id;
                console.log("response: ", response);
                console.log("ID saved: ", response._id);
            })
    });

    test('Add appointment coach is busy', async () => {
        await functions.addAppointment(appointments[0].id_coach, appointments[0].id_user)
            .then(async (response) => {
                expect(await response.error).toBeDefined();
            })
    });

    test('free coach schedule', async () => {
        await functions.freeCoachSchedule("2100-02-27", appointments[0].id_coach)
            .then(async (response) => {
                console.log("free coach schedule response: ", response);
                console.log("argument passed: 63e0c103a915b763ed777185", "coach ID not working: ", appointments[0].id_coach)
                expect(await response["date freed"]).toBeDefined();
            })
    });

    test('Delete appointment', async () => {
        await functions.deleteAppointment(createdAppointmentId, "2100-02-27", appointments[0].id_coach)
            .then(async (response) => {
                console.log("deleted appointment: ", response);
                expect(await response.appointment_deleted).toBeDefined();
            })
    });

    
    
});
