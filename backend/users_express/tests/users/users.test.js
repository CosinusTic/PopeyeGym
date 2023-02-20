const functions = require('./functions.js');


let token;
describe('USERS', () => {
    test('Find all users', async() => {
        await functions.getAllUsers()
            .then(async(response) => {
                expect(await response.length).toBeTruthy()
            })
    })

    test('Create User (register)', async () => {
        await functions.createUser(
            "John",
            "24 Avenue Isle Nevertell",
            "john@doe.com", 
            "123",
            { type: "City", coordinates: [152434, 5272] })
                .then(async (response) => {
                    expect(await response.name).toBe("John");
                    token = response.token;
                    _id = response._id;
                });
    });

    test('Get user type', async() => {
        await functions.getUserType(token)
            .then(async (response) => {
                expect(await response.type).toBe("customer");
            })
    })

    test('Create User with existing email', async () => {
        await functions.createUser(
            "Johnny",
            "24 Avenue Isle Nevertelllll",
            "john@doe.com", 
            "123",
            { type: "Village", coordinates: [20045, 5272] })
                .then(async (response) => {
                    expect(await response.error).toBeDefined();
                });
    });

    test('Get user by email (login)', async() => {
        await functions.getUserByEmail("john@doe.com", "123").then(async(response) => {
            expect(await response).toBeDefined()
        });
    })

    test('Modify user profile (update profile)', async() => {
        await functions.modifyUser("john@doe.com", "Johnny", "john@doe2.com", "25 Avenue Isle Nevertell")
            .then((async(response) => expect(await response.newCredentials.email).toBe("john@doe2.com")));
    })

    test('Delete user', async() => {
        await functions.deleteUser("john@doe2.com")
            .then(async(response) => {
                expect(await response).toBeDefined();
                expect(await response.email).toBe("john@doe2.com")
            })
    })
});


