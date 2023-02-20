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
 *     Coach:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - description
 *         - nature
 *         - busy
 *         - rate
 *         - photo
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the coach
 *           example: 63e0c103a915b763ed777185
 *         name:
 *           type: string
 *           description: The name of the coach
 *           example: Matthieu
 *         email:
 *           type: string
 *           description: The coach email
 *           example: bat@matt.com
 *         password:
 *           type: string
 *           description: The coach hashed password
 *           example: $2a$10$/AyLP6NUDRob4l381XmPLHegYxL1tQo.OAdOgzOwr8O91odY6pzxae
 *         description:
 *           type: string
 *           description: The short coach description
 *           example: Fais moi 3 var dump et 10 pompes !
 *         nature:
 *           type: string
 *           description: nature of the coach => fitness or crossfit
 *           example: crossfit
 *         busy:
 *           type: array
 *           description: an array of the dates of unavailabilities
 *           example: [ {date: 2023-02-09, user_id: 63d97be9747016bf0eabc31a}]
 *         rate:
 *           type: array
 *           description: an array of the rate from clients
 *           example: [ {rate: 4, user_id: 63d97be9747016bf0eabc31a}]    
 *         photo:
 *           type: string
 *           description: url of coach photo
 *           example: http://www.batmat.png
 *         status:
 *           type: integer
 *           description: The coach status => 0 if client / 1 if admin
 *           example: 1
 *         token:
 *           type: string
 *           description: The auto-generated token of the coach
 *           example: eyJhbGciOiJREzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NzY0MDcwMTcsImRhdGEiOiJmb29iYXIiLCJpYXQiOjE2NzUxOTc0MTd9.lI1aSnCfCk3cY5lntEGd6yAEeBF_8jvdqjs6Q
 */


/**
 * @swagger
 * tags:
 *   name: Coach
 *   description: The coach managing API
 * /findAllCoaches:
 *   get:
 *     summary: Get all coaches
 *     tags: [Coaches]
 *     responses:
 *       200:
 *         description: The list of coaches.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coach'
 *       500:
 *         description: Some error occurred while retrieving coaches.
 *
 */

router.get("/findAllCoaches", async (req, res) => {
  const coaches = await coachModel.find();
  try {
    res.json(coaches);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving coaches.",
    });
  }
});


/**
 * @swagger
 * tags:
 *   name: Coach
 *   description: The coaches managing API
 * /findCoachById/:id:
 *   get:
 *     summary: Get the coach by id
 *     tags: [Coaches]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The coach id
 *     responses:
 *       200:
 *         description: The coach.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coach'
 *       500:
 *         description: Some error occurred while retrieving coach.
 *
 */

router.get("/getCoachById/:id", async (req, res) => {
  const coach = await coachModel.find({ _id: req.params.id });
  try {
    res.json(coach);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving coach.",
    });
  }
});


/**
 * @swagger
 * tags:
 *   name: Coach
 *   description: The coach managing API
 * /findAllCoaches/:scheme:
 *   get:
 *     summary: Get all coaches by scheme
 *     tags: [Coaches]
 *     parameters:
 *       - scheme: path
 *         name: scheme
 *         schema:
 *           type: string
 *         required: true
 *         description: The coach nature
 *     responses:
 *       200:
 *         description: The list of coaches.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coach'
 *       500:
 *         description: Some error occurred while retrieving coaches.
 *
 */

router.get("/findAllCoaches/:scheme", async (req, res) => {
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
    res.json(coaches);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving coaches.",
    });
  }
});

/**
 * @swagger
 * tags:
 *   name: Coach
 *   description: The coaches managing API
 * /createCoach:
 *   post:
 *     summary: Create a coach
 *     tags: [Coaches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coach'
 *     responses:
 *       200:
 *         description: The created coach.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coach'
 *       403:
 *         description: email already exists
 *       500:
 *         description: Some error occurred while retrieving coaches.
 *
 */
router.post("/createCoach", async (req, res) => {
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
    res.status(403).send({
      message:
        err.message || "email already exists"
    });
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
      res.json({ ...req.body, token: coach.token });
    } catch (error) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving coaches."
      });
    }
  }
});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The coaches managing API
 * /createCoachByAdmin:
 *   post:
 *     summary: Create a coach from admin page
 *     tags: [Coaches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coach'
 *     responses:
 *       200:
 *         description: The created coach.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: email already exists
 *       500:
 *         description: Some error occurred while retrieving coaches.
 *
 */
router.post("/createCoachByAdmin", async (req, res) => {
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
    res.status(403).send({
      message:
        err.message || "email already exists"
    });
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
    try {
      await coach.save();
      res.send(coach);
    } catch (error) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving coaches."
      });
    }
  }
});

/**
 * @swagger
 * tags:
 *   name: Coaches
 *   description: The coaches managing API
 * /findCoachByToken/:token:
 *   get:
 *     summary: Get the coach by token
 *     tags: [Coaches]
 *     parameters:
 *       - token: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The coach token
 *     responses:
 *       200:
 *         description: The coach.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coach'
 *       500:
 *         description: "Some error occurred while retrieving coach."
 *
 */
router.get("/findCoachByToken/:token", async (req, res) => {
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

/**
 * @swagger
 * tags:
 *   name: Coaches
 *   description: The coaches managing API
 * /updateCoach/:token:
 *   put:
 *     summary: Update a coach informations
 *     tags: [Coaches]
 *     parameters:
 *       - token: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The coach token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coach'
 *     responses:
 *       200:
 *         description: The updated coach.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coach'
 *       400:
 *         description: Data to update can not be empty!
 *       500:
 *         description: Some error occurred while updating coach.
 *
 */
router.put("/updateCoach/:token", async (req, res) => {
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

    res.json(coachUpdate);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while updating coach.",
    });
  }
});

/**
 * @swagger
 * tags:
 *   name: Coaches
 *   description: The coaches managing API
 * /updateCoachByAdmin/:id:
 *   put:
 *     summary: Update a coach informations from admin page
 *     tags: [Coaches]
 *     parameters:
 *       - id: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The coach id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coach'
 *     responses:
 *       200:
 *         description: The updated coach.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coach'
 *       400:
 *         description: Data to update can not be empty!
 *       500:
 *         description: Some error occurred while updating coach.
 *
 */
router.put("/updateCoachByAdmin/:id", async (req, res) => {
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


/**
 * @swagger
 * tags:
 *   name: Coaches
 *   description: The coaches managing API
 * /rateCoach:
 *   put:
 *     summary: Update a coach informations by adding rate
 *     tags: [Coaches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coach'
 *     responses:
 *       200:
 *         description: The updated coach.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coach'
 *       402:
 *         description: User already rated this coach.
 *       403:
 *         description: Unknown error.
 *       500:
 *         description: Some error occurred while updating coach.
 *
 */
router.put("/rateCoach", userExist, isCoach ,async (req, res) => {
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
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating user."
      });
    }
  } else if (userAlreadyRated === true) {
    res.status(402).send({
      message:
        "User already rated this coach."
    });
  } else {
    res.status(403).send({
      message:
        "Unknown error."
    });
  }
});

/**
 * @swagger
 * tags:
 *   name: Coaches
 *   description: The coaches managing API
 * /deleteDate/:token:
 *   delete:
 *     summary: Delete a date
 *     tags: [Coaches]
 *     parameters:
 *       - token: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The coach token
 *     responses:
 *       200:
 *         description: The updated coach.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coach'
 *       500:
 *         description: "Some error occurred while deleting date."
 *
 */
router.delete("/deleteDate/:token", async (req, res) => {
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
      message: err.message || "Some error occurred while deleting date.",
    });
  }
});

/**
 * @swagger
 * tags:
 *   name: Coaches
 *   description: The coaches managing API
 * /modifyRate:
 *   put:
 *     summary: Update a coach informations by modify rate
 *     tags: [Coaches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coach'
 *     responses:
 *       200:
 *         description: The updated coach.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coach'
 *       500:
 *         description: Some error occurred while updating coach.
 *
 */
router.put('/modifyRate', async(req, res) => {
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
    res.status(500).send({
      message:
        err.message || "Some error occurred while deleting coach."
    });
  }
})

/**
 * @swagger
 * tags:
 *   name: Coaches
 *   description: The coaches managing API
 * /deleteAppointment/:appointment_id:
 *   delete:
 *     summary: Delete an appointment
 *     tags: [Coaches]
 *     parameters:
 *       - appointment_id: path
 *         name: appointment_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The appointment id
 *     responses:
 *       200:
 *         description: The appointments.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coach'
 *       500:
 *         description: "Some error occurred while deleting appointment."
 *
 */
router.delete("/deleteAppointment/:appointment_id", async (req, res) => {
  const appointment_id = req.params.appointment_id;
  const appointments = await appointmentModel.findOneAndDelete({ _id: appointment_id });
  try {
    res.json(appointments);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while deleting appointment.",
    });
  }
});

/**
 * @swagger
 * tags:
 *   name: Coaches
 *   description: The coaches managing API
 * /deleteCoach/:id:
 *   delete:
 *     summary: Delete a coach
 *     tags: [Coaches]
 *     parameters:
 *       - id: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The coach id
 *     responses:
 *       200:
 *         description: The deleted coach.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coach'
 *       500:
 *         description: "Some error occurred while deleting coach."
 *
 */
router.delete("/deleteCoach/:id", async (req, res) => {
  const id = req.params.id;
  const coaches = await coachModel.findByIdAndRemove(id);
  const appointments = await appointmentModel.deleteMany({id_coach: id})
  
  try {
    res.json(coaches,appointments);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while deleting coach.",
    });
  }
});

/**
 * @swagger
 * tags:
 *   name: Coaches
 *   description: The coaches managing API
 * /bestcoaches:
 *   get:
 *     summary: Get the top 3 best coaches
 *     tags: [Coaches]
 *     responses:
 *       200:
 *         description: The 3 best coaches (number of appointments).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coach'
 *       500:
 *         description: "Some error occurred while retrieving coach."
 *
 */
router.get("/bestcoaches", async (req, res) => {
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

/**
 * @swagger
 * tags:
 *   name: Coaches
 *   description: The coaches managing API
 * /averageRatingforCoach:
 *   post:
 *     summary: Update the coach rate
 *     tags: [Coaches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coach'
 *     responses:
 *       200:
 *         description: The updated coach.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coach'
 *       400:
 *         description: Data to update can not be empty!
 *       500:
 *         description: Some error occurred while updating coach.
 *
 */
router.post('/averageRatingforCoach', async(req, res) => {
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
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating coach."
      });
    }
  }
  else{
    try{
      return res.status(400).send({
        message: "Unknown error"
      });
    }
    catch(err){
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating coach."
      });
    }
  }
})

module.exports = router;

