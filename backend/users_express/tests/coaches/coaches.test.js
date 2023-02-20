const functions = require('./functions.js');

let token;
let id;
describe('COACHES', () => {
    test('Find all coaches', async() => {
        await functions.findAllCoaches()
            .then(async(response) => {
                expect(await response.length).toBeTruthy()
            })
    });    

    test('Find coaches with scheme', async() => {
        await functions.findCoachesWithScheme("crossfit")
            .then(async (response) => {
                expect(await response.length).toBeTruthy();
            })
    });

    test('Create coach', async() => {
        await functions.createCoach("Foo", "5 Avenue Isle Really Nervertell", "foo@bar.com", "crossfit", "123")
            .then(async (response) => {
                expect(await response.coach.name).toBe("Foo");
                token = response.coach.token;
                id = response.coach._id;
                // console.log("token: ", token);
                // console.log("id: ", id);
            });
    });

    test('Find coach with token', async() => {
        await functions.findCoachWithToken(token)
            .then(async (response) => {
                expect(await response.name).toBe("Foo");
            })
    });

    test('Update coach', async() => {
        await functions.updateCoach(token, "Foo2", "bar@foo")
            .then(async (response) => {
                expect (await response.newCredentials.name).toBe("Foo2");
            })
    });

    test('Delete coach', async () => {
        await functions.deleteCoach(id)
            .then(async (response) => {
                expect(await response.coach_deleted.name).toBe("Foo2");
                // console.log(response);
            })
    });
});



// delete coach
// rate coach by user 

