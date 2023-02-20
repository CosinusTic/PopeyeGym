const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const bcryptjs = require('bcryptjs');


const createUser = async (name, address, email, password, location) => {
    let userToSave;

    const myEncrpytedPass = await bcryptjs.hash(password, 10);
    const options = {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            email: email,
            password: myEncrpytedPass,
            location: location,
            token: "123456789", 
            address: address
        }), 
        headers: {'Content-Type': 'application/json'}
    }
    await fetch('http://localhost:3002/createUser', options)
        .then((response) => response.json())
        .then((response) => {
            userToSave = response
        })
    return userToSave;
}

const getUserByToken = async(token) => {
    let userToSave;
    await fetch('http://localhost:3002/findUserWithToken/' + token)
        .then((response) => response.json())
        .then((response) => userToSave = response);
    console.log("user to save: ", userToSave);
    return userToSave;
}

const getUserByEmail = async(email, password) =>{
    let userToSave;
    const options = {
        method: 'POST', 
        body: JSON.stringify({
            password: password, 
            email: email
        }), 
        headers: {"Content-Type": 'application/json'}
    }

    
    await fetch('http://localhost:3002/findUserByEmail', options)
        .then((response) => response.json())
        .then((response) => userToSave = response)
    
    return userToSave;
}

const modifyUser = async(emailFilter, name, email, address) => {
    let userToSave;
    const options = {
        method: 'PUT', 
        body: JSON.stringify({
            name: name, 
            email: email, 
            address: address
        }), 
        headers: {'Content-Type': 'application/json'}
    }
    await fetch('http://localhost:3002/updateUserWithEmail/' + emailFilter, options)
        .then((response) => response.json())
        .then((response) => userToSave = response)
    
    return userToSave;
}

const deleteUser = async(email) => {
    let userToSave;
    const options = {
        method: 'DELETE', 
        headers: {'Content-Type': 'application/json'}
    }
    await fetch('http://localhost:3002/deleteUserByEmail/' + email, options)
        .then((response) => response.json())
        .then((response) => userToSave = response)

    return userToSave;
}

const getAllUsers = async() => {
    let users;
    const options = {
        method: 'GET', 
        headers: {'Content-Type': 'application/json'}
    }
    await fetch('http://localhost:3002/findAllUsers', options)
        .then((response) => response.json())
        .then((response) => users = response)
    
        return users;
}

const getUserType = async(token) => {
    let userToSave;
    const options  = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }
    await fetch('http://localhost:3002/getUserType/' + token, options)
        .then((response) => response.json())
        .then((response) => userToSave = response);
    
    return userToSave;
}

module.exports = {
    createUser, 
    getUserByToken, 
    getUserByEmail, 
    modifyUser, 
    deleteUser, 
    getAllUsers, 
    getUserType
}