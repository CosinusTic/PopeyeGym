const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const bcryptjs = require('bcryptjs');

const findAllCoaches = async() => {
    let coaches;
    const options = {
        method: 'GET', 
        headers: {'Content-Type' : 'application/json'}
    }
    await fetch('http://localhost:3002/findAllCoaches', options)
        .then((response) => response.json())
        .then((response) => coaches = response)
    return coaches;
}

const findCoachesWithScheme = async(scheme) => {
    let coaches;
    const options = {
        method: 'GET', 
        headers: {'Content-Type': 'application/json'}
    }
    await fetch('http://localhost:3002/findAllCoaches/' + scheme, options)
        .then((response) => response.json())
        .then((response) => coaches = response);

    return coaches;
}

const createCoach = async(name, address, email, nature, password) => {
    let coachToSave;
    const myEncrpytedPass = await bcryptjs.hash(password, 10);
    const options = {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            address: address,
            email: email,
            nature: nature,
            password: myEncrpytedPass
        }), 
        headers: {'Content-Type': 'application/json'}
    }
    await fetch('http://localhost:3002/createCoach', options)
        .then((response) => response.json())
        .then((response) => coachToSave = response);
    
    return coachToSave;
}

const findCoachWithToken = async (token) => {
    let coachToSave;
    const options = {
        method: 'GET', 
        headers: {'Content-Type' : 'application/json'}
    }
    await fetch('http://localhost:3002/findCoachByToken/' + token, options)
        .then((response) => response.json())
        .then((response) => coachToSave = response);
    
    return coachToSave;
}

const updateCoach = async (token, name, email) => {
    let coachToUpdate;
    const options = {
        method: 'PUT', 
        body: JSON.stringify({
            name: name, 
            email: email, 
            busy: {
                date: "2023-03-15", 
                user_id: "63d15e7629a6bf47158f2f52"
            }   
        }), 
        headers: {'Content-Type' : 'application/json'}
    }
    await fetch('http://localhost:3002/updateCoach/' + token, options)
        .then((response) => response.json())
        .then((response) => coachToUpdate = response)
    
    return coachToUpdate;
}

const deleteCoach = async (id) => {
    let coachToDelete;
    const options = {
        method: 'DELETE', 
        headers: {'Content-Type': 'application/json'}
    }
    
    await fetch('http://localhost:3002/deleteCoach/' + id, options)
        .then((response) => response.json())
        .then((response) => coachToDelete = response);

    return coachToDelete;
}



module.exports = {
    findAllCoaches, 
    findCoachesWithScheme, 
    createCoach, 
    findCoachWithToken, 
    updateCoach, 
    deleteCoach
}

