const express = require("express");
const coachModel = require("../models/coach.js");
const userModel = require("../models/index.js");
const appointmentModel = require("../models/apointment.js");
const app = express();
var bodyParser = require("body-parser");
const { createHash } = require("crypto");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcryptjs = require("bcryptjs");
const { NativeBuffer } = require("mongoose");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const jwt = require("jsonwebtoken");
const { isCoach } = require("../middleware/coach.js");
const { userExist } = require("../middleware/user.js");

app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// FIND ALL COACHES
app.get("/findAllCoaches", async (req, res) => {
  const coaches = await coachModel.find();
  try {
    res.json(coaches);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving coaches.",
    });
  }
});

app.get("/getCoachById/:id", async (req, res) => {
  const coach = await coachModel.find({ _id: req.params.id });
  try {
    res.json(coach);
  } catch (err) {
    res.send(err);
    console.log(err);
  }
});
// FIND ALL COACHES WITH SCHEMES
app.get("/findAllCoaches/:scheme", async (req, res) => {
  const nature = req.params.scheme;
  let coaches = await coachModel.find({ nature: nature });
  let resDate = [];

  try {
    coaches = coaches.map((coach) => {
      coach.busy = coach.busy.map((invalid) => {
        
        resDate=invalid.date.split("T")[0]

        if (invalid.user_id !== undefined) {
          return { date: resDate, excuse: "Apptmt" };
        }
        return { date: resDate, excuse: "Occupied" };
      });
      return coach;
    });
    console.log(coaches);
    res.json(coaches);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving coaches.",
    });
  }
});

// CREATE COACH

app.post("/createCoach", async (req, res) => {
  let access_token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 336,
      data: "foobar",
    },
    "secret"
  );
  const existingCoachemail = await coachModel.findOne({email: req.body.email}).exec();
  const existingUseremail = await userModel.findOne({email: req.body.email}).exec();

  if (existingCoachemail || existingUseremail) {
    console.log("email already taken");
    res.send({ error: "email already taken" });
  }
  else {
    const myEncrpytedPass = await bcryptjs.hash(req.body.password, 10);
    const coach = new coachModel({
      name: req.body.name,
      address: req.body.address,
      email: req.body.email,
      nature: req.body.nature,
      password: myEncrpytedPass,
      token: access_token,
    });
    try {
      await coach.save();
      console.log("coach created =>", coach);
      res.json({ ...req.body, token: coach.token, coach: coach });
    } catch (error) {
      res.send(error);
      console.log(error);
    }
  }
});

// CREATE COACH BY ADMIN
app.post("/createCoachByAdmin", async (req, res) => {
  let access_token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 336,
      data: "foobar",
    },
    "secret"
  );
  const existingUser = await coachModel
    .findOne({ email: req.body.email })
    .exec();
  if (existingUser) {
    console.log("Coach already exists => ", existingUser);
    res.send({ error: "coach already exists" });
  } else {
    const myEncrpytedPass = await bcryptjs.hash(req.body.password, 10);
    const coach = new coachModel({
      name: req.body.name,
      email: req.body.email,
      password: myEncrpytedPass,
      description: req.body.description,
      nature: req.body.nature,
      photo: req.body.photo,
      status: req.body.status,
      token: access_token,
    });
    console.log("coach created =>", coach);
    try {
      await coach.save();
      res.send(coach);
    } catch (error) {
      res.send(error);
      console.log(error);
    }
  }
});

// GET ONE COACH BY token

app.get("/findCoachByToken/:token", async (req, res) => {
  const token = req.params.token;
  const coaches = await coachModel.findOne({ token: token });
  let resDate = [];

  try {
    for (let i = 0; i < coaches.rate.length; i++) {
    }
    coaches.busy = coaches.busy.map((invalid) => {

      resDate = resDate=invalid.date.split("T")[0]
      if (invalid.user_id !== undefined) {
        return { date: resDate, excuse: "Apptmt" };
      }
      return { date: resDate, excuse: "Occupied" };
    });

    res.json(coaches);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving coach.",
    });
  }
});

// UPDATE A COACH BY TOKEN

app.put("/updateCoach/:token", async (req, res) => {
  const token = req.params.token;

  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const coaches = await coachModel.findOne({ token });
  try {
    const busy = req.body.busy;
    const data = req.body;
    delete data.busy;
    const dataToUpdate = { $set: { ...data }, $push: {} };
    if (busy.date !== undefined) {
      dataToUpdate.$push = { busy };
    }
    const coachUpdate = await coachModel.findOneAndUpdate(
      { token },
      dataToUpdate
    );

    res.json({coachUpdate, newCredentials: req.body});
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while updating user.",
    });
  }
});

// UPDATE A COACH BY ADMIN

app.put("/updateCoachByAdmin/:id", async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;
  const coaches = await coachModel.findByIdAndUpdate(id, req.body, {
    useFindAndModify: false,
  });
  try {
    res.json(coaches);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while updating coach.",
    });
  }
});


// RATE A COACH BY USER
app.put("/rateCoach", userExist, isCoach ,async (req, res) => {
  const coachId = req.body.coach_id;
  const userId = req.body.user_id;
  const rateToAdd = req.body.rate;
  let userAlreadyRated = false;
  const coach = await coachModel.findOne({ _id: coachId });
  const user = await userModel.findOne({ _id: userId });

  if (coach.rate.length > 0) {
    for (let i = 0; i < coach.rate.length; i++) {
      if (coach.rate[i].user_id == user._id) {
        userAlreadyRated = true;
        break;
      }
    }
  }

  // if user has rated, push to busy table, else send error
  if (userAlreadyRated === false) {
    await coachModel.updateOne(
      { _id: coachId },
      { $push: { rate: { rate: rateToAdd, user_id: userId } } }
    );
    try {
      res.json({
        "rate added": rateToAdd,
        "coach targeted ID": coachId,
        "user origin ID": userId,
        user: user,
        coach: coach,
      });
    } catch (err) {
      res.send(err);
      console.log(err);
    }
  } else if (userAlreadyRated === true) {
    res.send({ error: "user already rated this coach" });
  } else {
    res.send({ error: "unknown error" });
  }
});

// DELETE A DATE IF THE COACH IS FINALLY AVAILABLE

app.delete("/deleteDate/:token", async (req, res) => {
  const token = req.params.token;
  const coaches = await coachModel.findOne({ token });
  try {
    coaches.busy = await coaches.busy.filter((element) => {
      return new Date(element.date).toLocaleDateString() != req.body.busy.date;
    });
    coaches.save();
    res.json(coaches.busy);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while deleting user.",
    });
  }
});

//MODIFY A RATE FOR USER TO RE-RATE COACH
app.put('/modifyRate', async(req, res) => {
  const coachId = req.body.coach_id;
  const userId = req.body.user_id;
  const rateToAdd = req.body.rate;
  const coach = await coachModel.findOne({_id: coachId});  //get coach to rate

  const rate = coach.rate.filter((rate) => rate.user_id == userId); //get the rate
  const request = await coachModel.updateOne({_id: coachId}, {$pull: {rate: {rate: rate[0].rate, user_id: rate[0].user_id}}}); //delete this rate from table
  const sec = await coachModel.updateOne({_id: coachId}, {$push: {rate: {rate: rateToAdd, user_id: userId}}}) //add body rate to db

  try {
    res.json({ requestOne: request,  secondRequest: sec, rateToModify: rate, valuesPushed: {rate: rateToAdd, user_id: userId}})
  }
  catch (err) {
    res.send(err);
    console.log(err);
  }
})

// DELETE AN APPOINTMENT AS A COACH

app.delete("/deleteAppointment/:appointment_id", async (req, res) => {
  const appointment_id = req.params.appointment_id;
  const appointments = await appointmentModel.findOneAndDelete({ _id: appointment_id });
  try {
    res.json(appointments);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while deleting user.",
    });
  }
});

//  DELETE A COACH

app.delete("/deleteCoach/:id", async (req, res) => {
  const id = req.params.id;
  const coaches = await coachModel.findByIdAndRemove(id);
  const appointments = await appointmentModel.deleteMany({id_coach: id})
  
  try {
    res.json({coach_deleted: coaches, appointments_deleted: appointments});
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while deleting coach.",
    });
  }
});

// GET THE TOP 3 BEST COACHES

app.get("/bestcoaches", async (req, res) => {
  const coaches = await coachModel.find();
  let appointmentCountsAndCoach = [];
  let good = false;
  for (let i = 0; i < coaches.length; i++) {
    console.log(coaches[i]);
    for (j = 0; j < coaches[i].busy.length; j++) {
      if (coaches[i].busy[j].user_id) {
        console.log(coaches[i].busy[j]);
        good = true;
      }
    }
    if ((good = true)) {
      appointmentCountsAndCoach.push({
        coach_name: coaches[i].name,
        appoiment_count: coaches[i].busy.length,
      });
    }
  }

  appointmentCountsAndCoach = appointmentCountsAndCoach.sort(function (a, b) {
    return b.appoiment_count - a.appoiment_count;
  });
  try {
    res.json(appointmentCountsAndCoach.slice(0, 3));
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred",
    });
  }
});

app.post('/averageRatingforCoach', async(req, res) => {
  const coachId = req.body.coach_id;
  const coach = await coachModel.findOne({_id: coachId});
  let rates = [];
  let total = 0;
  let count = 0;
  let avg;
  if(coach.rate.length > 0){
    for(let i = 0; i < coach.rate.length; i++){
      rates.push(parseInt(coach.rate[i].rate));
    }
    for(let i =0; i < rates.length; i++){
      total += rates[i];
      count ++;
    }
    avg = total / count;
    try{
      res.json({rates: rates, count: count, total: total, avg: avg});
    }
    catch(err){
      console.log(err);
      res.send(err);
    }
  }
  else{
    try{
      res.json({error: "unknown error"})
    }
    catch(err){
      console.log(err);
    }
  }
})

module.exports = app;

