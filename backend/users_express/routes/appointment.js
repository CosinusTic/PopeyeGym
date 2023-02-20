const express = require("express");
const userModel = require("../models/index.js");
const coachModel = require("../models/coach.js");
const appointmentModel = require("../models/apointment.js");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

app.use(express.json());

app
  .use(express.static(__dirname + "/public"))
  .use(express.urlencoded({ extended: true }))
  .use(cors())
  .use(cookieParser());

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

// GET ALL APPOINTMENTS
app.get("/appointments", async (req, res) => {
  const appointments = await appointmentModel.find({});
  try {
    res.json(appointments);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

// GET COMPLETE USER AND COACH INFO FOR EACH APPOINTMENT
app.get("/appointmentsAndUsers", async (req, res) => {
  const appointments = await appointmentModel.find({});
  let users = await userModel.find({});
  let coaches = await coachModel.find({});
  let final = [];

  for (let i = 0; i < appointments.length; i++) {
    const user = users.filter((user) => user._id == appointments[i].id_user);
    const coach = coaches.filter(
      (coach) => coach._id == appointments[i].id_coach
    );
    if (coach.length === 0) {
      continue;
    } else if (user.length === 0) {
      continue;
    } else {
      final.push({
        _id: appointments[i]._id,
        user: { name: user[0].name, id: user[0]._id, email: user[0].email },
        coach: { name: coach[0].name, id: coach[0]._id, email: coach[0].email },
        date: appointments[i].date,
      });
    }
  }

  try {
    res.json(final);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

// COUNT APPOINTMENTS BY MONTH
app.get("/appointments/countPerMonth", async (req, res) => {
  const appointments = await appointmentModel.find();
  appointments.sort(function (a, b) {
    a - b;
  });

  let monthsIndexes = [];
  let countPerMonth = {};
  let final = [];

  for (let i = 0; i < appointments.length; i++) {
    monthsIndexes.push(appointments[i].created_at.toString().substring(4, 7));
  }

  for (const index of monthsIndexes) {
    countPerMonth[index] = countPerMonth[index] ? countPerMonth[index] + 1 : 1;
  }
  if (countPerMonth.Jan) {
    final.push({ month: "January", count: countPerMonth.Jan });
  }
  if (countPerMonth.Feb) {
    final.push({ month: "February", count: countPerMonth.Feb });
  }
  if (countPerMonth.Mar) {
    final.push({ month: "March", count: countPerMonth.Mar });
  }
  if (countPerMonth.Apr) {
    final.push({ month: "April", count: countPerMonth.Apr });
  }
  if (countPerMonth.May) {
    final.push({ month: "May", count: countPerMonth.May });
  }
  if (countPerMonth.Jun) {
    final.push({ month: "June", count: countPerMonth.Jun });
  }
  if (countPerMonth.Jul) {
    final.push({ month: "July", count: countPerMonth.Jul });
  }
  if (countPerMonth.Aug) {
    final.push({ month: "August", count: countPerMonth.Aug });
  }
  if (countPerMonth.Sep) {
    final.push({ month: "September", count: countPerMonth.Sep });
  }
  if (countPerMonth.Oct) {
    final.push({ month: "October", count: countPerMonth.Oct });
  }
  if (countPerMonth.Nov) {
    final.push({ month: "November", count: countPerMonth.Nov });
  }
  if (countPerMonth.Dec) {
    final.push({ month: "December", count: countPerMonth.Dec });
  }
  try {
    res.json(final);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

// ADD AN APPOINTMENT
app.post("/addAppointment", async (req, res) => {
  let coach = await coachModel.find({ _id: req.body.id_coach });
  const date = req.body.date;
  const created_at = Date.now();
  const intDate = Date.parse(date);
  const now = Date.now();
  let validity = false;
  if (intDate > now) {
    validity = true;
  } else {
    validity = false;
  }

  let unavailabilities;
  let coachAvailable = true;
  if (coach) {
    unavailabilities = coach[0].busy;
    for (let i = 0; i < unavailabilities.length; i++) {
      if (unavailabilities[i].date == date) {
        coachAvailable = false;
        break;
      } else {
        coachAvailable = true;
      }
    }
    console.log({
      coach: coach,
      "date input: ": date,
      busy: coach[0].busy,
    });
  } else {
    res.send({ error: "coach not found" });
  }
  if (unavailabilities != []) {
    if (coachAvailable === false) {
      try {
        res.json({ error: "Coach is not available" });
      } catch (err) {
        res.send(err);
        console.log(err);
      }
    } else if (coachAvailable === true) {
      if (validity === true) {
        const appointment = new appointmentModel({
          id_user: req.body.id_user,
          id_coach: req.body.id_coach,
          date: req.body.date,
          created_at: created_at,
        });

        await coachModel.updateOne(
          { _id: req.body.id_coach },
          {
            $push: { busy: { date: req.body.date, user_id: req.body.id_user } },
          }
        );

        try {
          await appointment.save();
          res.json(appointment);
        } catch (err) {
          console.log(err);
          res.send(err);
        }
      } else {
        try {
          res.json({ error: "appointment taken in the past" });
        } catch (err) {
          console.log(err);
          res.send(err);
        }
      }
    }
  } else {
    res.send({ error: "unknown error" });
  }
});

// SEE ALL APPOINTMENTS FOR A GIVEN USER
app.get("/v2/myAppointments/user/:id", async (req, res) => {
  const myAppointments = await appointmentModel.find({
    id_user: req.params.id,
  });
  let ids = myAppointments.map((appointment) => appointment.id_coach);
  const coaches = await coachModel.find({
    _id: {
      $in: ids,
    },
  });
  const appointments = myAppointments.flatMap((appointment) => {
    const coach = coaches.find(
      (coach) => coach._id.toString() === appointment.id_coach
    );
    if (coach !== undefined) {
      return {
        appointment,
        coach: { name: coach.name, _id: coach._id.toString() },
      };
    } else {
      return []
    }
  });
  try {
    res.json(appointments);
  } catch (err) {
    res.send(err);
    console.log(err);
  }
});

//SEE ALL APPOINTMENTS FOR A GIVEN COACH
app.get("/myAppointments/coach/:id", async (req, res) => {
  const myAppointments = await appointmentModel.find({
    id_coach: req.params.id,
  });
  const users = await userModel.find({});
  let usersToSend = [];
  let dates = [];
  let appointments = [];

  let resDate = [];

  for (let i = 0; i < myAppointments.length; i++) {
    let date = new Date(myAppointments[i].date);
    let event = new Date(date).toISOString();
    let resDate = event.split("T")[0];
    resultat = resDate;

    dates.push(resultat);
    usersToSend.push(
      ...users.filter(
        (user) => user._id.toString() == myAppointments[i].id_user
      )
    );
  }
  for (let i = 0; i < dates.length; i++) {
    appointments.push({
      date: dates[i],
      user: usersToSend[i],
      appointment_id: myAppointments[i]._id,
    });
  }
  try {
    res.json(appointments);
  } catch (err) {
    res.send(err);
    console.log(err);
  }
});

//need to find booking in appointment db where coach id and user id correspond and date correspond to body
//then need to pull request on busy array for coaches
app.delete("/deleteAppointment", async (req, res) => {
  const appointmentToDelete = await appointmentModel.findOneAndDelete({
    _id: req.body._id,
  });
  try {
    res.json({ appointment_deleted: appointmentToDelete });
  } catch (err) {
    res.send(err);
    console.log(err);
  }
});

//FREE COACH SCHEDULE
app.put("/freeCoachSchedule", async (req, res) => {
  const bookingDate = req.body.booking_date;
  const coachId = req.body.coach_id;
  const request = await coachModel.updateOne(
    { _id: coachId },
    { $pull: { busy: { date: bookingDate } } }
  );

  const coach = await coachModel.findOne({ _id: coachId });

  try {
    res.json({
      "date freed": bookingDate,
      "coach ID freed": coachId,
      request: request,
      booking_date: bookingDate,
      coach_id: coachId,
      coach: coach,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = app;
