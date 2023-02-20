const express = require("express");
const userModel = require("../models/index.js");
const coachModel = require("../models/coach.js");
const appointmentModel = require("../models/apointment.js");
const app = express();
const { createHash } = require('crypto');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcryptjs = require('bcryptjs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const jwt = require('jsonwebtoken');
const { UserExistId } = require("../middleware/user.js");

app.use(express.json());

app.use(express.static(__dirname + '/public'))
    .use(express.urlencoded({extended: true}))
    .use(cors())
    .use(cookieParser());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// FIND ALL USERS 

app.get('/findAllUsers', async (req, res) => {
    const users = await userModel.find()
    try{
        res.json(users)
    }
    catch(err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    };
});

// CREATE USER 

app.post('/createUser', async (req, res) => {
    // let date = new Date()
    // let currentDate = date.getDay().toString()
    // let access_token = createHash('sha256').update(currentDate).digest('hex');
    let access_token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 336),
        data: 'foobar'
      }, 'secret');

    const existingEmail = await userModel.findOne({ email: req.body.email }).exec();
    const existingCoachEmail = await coachModel.findOne({ email: req.body.email }).exec();

    if (existingEmail || existingCoachEmail) {
        console.log("Email already exists");
        res.send({ "error": "email already exists" });
    }
    else {
        const myEncrpytedPass = await bcryptjs.hash(req.body.password, 10);
        const user = new userModel({
            name: req.body.name,
            address: req.body.address,
            email: req.body.email,
            password: myEncrpytedPass,
            location: req.body.location,
            token: access_token
        });
        try {
            await user.save();
            console.log("user created =>", user)
            res.json({...req.body, token: user.token});
        }
        catch (error) {
            res.send(error);
            console.log(error);
        }
    }
});

app.post('/createUserByAdmin', async (req, res) => {
    let access_token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 336),
        data: 'foobar'
      }, 'secret');
    const existingUser = await userModel.findOne({ email: req.body.email }).exec()
    if (existingUser) {
        console.log("User already exists => ", existingUser);
        res.send({ "error": "user already exists" });
    }
    else {
        const myEncrpytedPass = await bcryptjs.hash(req.body.password, 10);
        const user = new userModel({
            name: req.body.name,
            address: req.body.address,
            location: req.body.location,
            email: req.body.email,
            password: myEncrpytedPass,
            status: req.body.status,
            token: access_token
        });
        console.log("user created =>", user)
        try {
            await user.save();
            res.send(user);
        }
        catch (error) {
            res.send(error);
            console.log(error);
        }
    }
});

// GET ONE USER BY ID

app.get('/findUserById/:id', async (req, res) => {
    const id = req.params.id;
    const users = await userModel.findById(id)
    try{
        res.json(users)
    }
    catch(err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user."
      });
    };
});

// GET ONE USER OR ONE COACH BY TOKEN
app.get('/findUserWithToken/:token', async(req, res) => {
    const token = req.params.token;
    const user = await userModel.find({token: token})
    const coach = await coachModel.find({token: token})
    if(user != null || user != {} || user != undefined){
        try{
            res.json({user: user});
        }
        catch(err){
            res.send(err);
            console.log(err);
        }
    }
    else if(coach != null || coach != {} || coach != undefined){
        try{
            res.json({coach: coach})
        }
        catch(err){
            res.send(err);
            console.log(err);
        }
    }
    else{
        res.send({error: "No user matched"})
    }
})

// GET ONE USER OR COACH BY EMAIL AND PASSWORD / LOGIN

app.post('/findUserByEmail', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await userModel.findOne({email: email})
    const coach = await coachModel.findOne({email: email})
    try{
        if( user != null ) {
             if (bcryptjs.compareSync(password, user.password ) == true) {
                 res.json(user)
                 console.log(user)
             }
             else {
                res.status(402).send({
                    message:
                      "Bad password"
                  });
             }
        }
        else if( coach != null ) {
            if (bcryptjs.compareSync(password, coach.password ) == true) {
                res.json(coach)
                console.log(coach)
            }
            else {
                res.status(402).send({
                    message:
                      "Bad password"
                  });
             }
        }
        else {
            res.status(403).send({
                message:
                  "This user doesn't exist."
              });
        }
    }
    catch(err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user."
      });
    };
});

// DETECT WHETHER USER IS COACH OR USER
app.get('/getUserType/:token', async(req, res) => {
    const user = await userModel.findOne({token: req.params.token});
    const coach = await coachModel.findOne({token: req.params.token});

    if(user){
        try{
            res.json({"type": "customer", "user": user})            
        }
        catch(err){
            console.log(err);
            res.send(err);
        }
    }
    else if(coach){
        try{
            res.json({"type": "coach", "coach": coach})
        }
        catch(err){
            console.log(err);
            res.send(err);
        }
    }
})

// UPDATE A USER 

app.put('/updateUser/:id', UserExistId, async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;
    const users = await userModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    try{
        res.json(users)
    }
    catch(err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating user."
      });
    };
})

app.put("/updateUserWithEmail/:userEmail", async (req, res) => {
    const email = req.body.email;
    const name = req.body.email;
    const address = req.body.address;
    const existinEmail = req.params.userEmail;
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!",
      });
    }
  
    try {
      const userToUpdate = await userModel.findOneAndUpdate(
        { email: existinEmail },
        {email: email, name: name, address: address}
      );
  
      res.json({userToUpdate: userToUpdate, newCredentials: {email: email, name: name, address: address}});
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while updating user.",
      });
    }
  });

//  DELETE A USER 

app.delete('/deleteUser/:id', UserExistId, async (req, res) => {
    const id = req.params.id;
    const users = await userModel.findByIdAndRemove(id)
    const appointments = await appointmentModel.deleteMany({id_user: id})
    try{
        res.json(users,appointments)
    }
    catch(err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while deleting user."
      });
    };
});

app.delete('/deleteUserByEmail/:email', async (req, res) => {
    const email = req.params.email;
    const userToDelete = await userModel.findOneAndDelete({email: email})
    try{
        res.json(userToDelete)
    }
    catch(err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while deleting user."
      });
    };
});

module.exports = app;