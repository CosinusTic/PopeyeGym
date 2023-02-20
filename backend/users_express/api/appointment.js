const express = require("express");
const cors = require('cors');
const router = express.Router();
router.use(cors());

const userModel = require("../models/index.js");
const coachModel = require("../models/coach.js");
const appointmentModel = require("../models/apointment.js");


/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - id_user
 *         - id_coach
 *         - date
 *         - created_at
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the appointment
 *           example: 63e1043ad8ad760b6b2b8b94
 *         id_user:
 *           type: string
 *           description: The user id
 *           example: 63d392d878d66a58e70ccf21
 *         id_coach:
 *           type: string
 *           description: The coach id
 *           example: 63e0c103a915b763ed777185
 *         date:
 *           type: string
 *           description: The appointment date
 *           example: 2023-02-27T00:00:00.000+00:00
 *         created_at:
 *           type: string
 *           description: The creation date of appointment
 *           example: 2023-02-06T13:44:26.054+00:00
 *
 */

/**
 * @swagger
 * tags:
 *   name: Appointment
 *   description: The appointment managing API
 * /appointments:
 *   get:
 *     summary: Get all appointments
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: The list of appointments.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Some error occurred while retrieving appointments.
 *
 */
router.get("/appointments", async (req, res) => {
  const appointments = await appointmentModel.find({});
  try {
    res.json(appointments);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving appointments.",
    });
  }
});

/**
 * @swagger
 * tags:
 *   name: Appointment
 *   description: The appointment managing API
 * /appointmentsAndUsers:
 *   get:
 *     summary: Get user or coach infos by their appointments 
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: The list of appointments and the coach and user infos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Some error occurred while retrieving appointments.
 *
 */

router.get("/appointmentsAndUsers", async (req, res) => {
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

/**
 * @swagger
 * tags:
 *   name: Appointment
 *   description: The appointment managing API
 * /appointments/countPerMonth:
 *   get:
 *     summary: Get number of appointments per mounth 
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: The number of appointments per mounth.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Some error occurred while retrieving appointments.
 *
 */
router.get("/appointments/countPerMonth", async (req, res) => {
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
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving appointments.",
    });
  }
});

/**
 * @swagger
 * tags:
 *   name: Appointment
 *   description: The appointment managing API
 * /addAppointment:
 *   post:
 *     summary: Create an appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: The created appointment.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       402:
 *         description: appointment taken in the past      
 *       403:
 *         description: coach is not available
 *       404:
 *         description: coach not found
 *       500:
 *         description: Some error occurred while retrieving appointment.
 *
 */
router.post("/addAppointment", async (req, res) => {
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
  } else {
    res.status(404).send({
      message:
        err.message || "coach not found"
    });
  }
  if (unavailabilities != []) {
    if (coachAvailable === false) {
      try {
        res.status(403).send({
          message:
            err.message || "coach is not available"
        });
      } catch (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving appointment."
        });
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
          res.status(402).send({
            message:
              err.message || "appointment taken in the past"
          });
        } catch (err) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving appointment."
          });
        }
      }
    }
  } else {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving appointment."
    });
  }
});

/**
 * @swagger
 * tags:
 *   name: Appointment
 *   description: The appointment managing API
 * /v2/myAppointments/user/:id:
 *   get:
 *     summary: Get appointments for a user
 *     tags: [Appointments]
 *     parameters:
 *       - id: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: All appointments for a user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Some error occurred while retrieving appointments.
 *
 */
router.get("/v2/myAppointments/user/:id", async (req, res) => {
  const myAppointments = await appointmentModel.find({
    id_user: req.params.id,
  });
  let ids = myAppointments.map((appointment) => appointment.id_coach);
  const coaches = await coachModel.find({
    _id: {
      $in: ids,
    },
  });
  const appointments = myAppointments.map((appointment) => {
    const coach = coaches.find(
      (coach) => coach._id.toString() === appointment.id_coach
    );
    if (coach.name !== undefined) {
      return {
        appointment,
        coach: { name: coach.name, _id: coach._id.toString() },
      };
    }
  });
  try {
    res.json(appointments);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving appointments."
    });
  }
});

/**
 * @swagger
 * tags:
 *   name: Appointment
 *   description: The appointment managing API
 * /myAppointments/coach/:id:
 *   get:
 *     summary: Get appointments for a coach
 *     tags: [Appointments]
 *     parameters:
 *       - id: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The coach id
 *     responses:
 *       200:
 *         description: All appointments for a coach.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Some error occurred while retrieving appointments.
 *
 */
router.get("/myAppointments/coach/:id", async (req, res) => {
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

/**
 * @swagger
 * tags:
 *   name: Appointment
 *   description: The appointment managing API
 * /deleteAppointment:
 *   delete:
 *     summary: Delete an appointment
 *     tags: [Appointments]
 *     prequestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: The deleted appointment.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: "Some error occurred while deleting appointment."
 *
 */
router.delete("/deleteAppointment", async (req, res) => {
  const appointmentToDelete = await appointmentModel.findOneAndDelete({
    _id: req.body._id,
  });
  try {
    res.json({ appointment_deleted: appointmentToDelete });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while updating appointment."
    });
  }
});

/**
 * @swagger
 * tags:
 *   name: Appointment
 *   description: The appointment managing API
 * /freeCoachSchedule:
 *   put:
 *     summary: Delete an unavailability date for a coach
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: The updated coach.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Some error occurred while updating coach.
 *
 */
router.put("/freeCoachSchedule", async (req, res) => {
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
    res.status(500).send({
      message:
        err.message || "Some error occurred while updating coach."
    });
  }
});

module.exports = router;
