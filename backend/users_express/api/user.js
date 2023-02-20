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
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - location
 *         - email
 *         - password
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *           example: 63d97be9747016bf0eabc31a
 *         name:
 *           type: string
 *           description: The name of the user
 *           example: Anais Nanou
 *         address:
 *           type: string
 *           description: The user address
 *           example: 53 Avenue des Hespérides 06300 Nice
 *         location:
 *           type: object
 *           description: coordinates of the user address and his type of point
 *           example: {type: point, coordinates: [7.303923, 43.694724]}
 *         email:
 *           type: string
 *           description: The user email
 *           example: anais@anais.com
 *         password:
 *           type: string
 *           description: The user hashed password
 *           example: $2a$10$pvUivZbraF8biRFYqad/fuXk6VL7desCb6E/f91aLEp.vJLetMgbGe
 *         status:
 *           type: integer
 *           description: The user status => 0 if client / 1 if admin
 *           example: 1
 *         token:
 *           type: string
 *           description: The auto-generated token of the user
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NzY0MDcwMTcsImRhdGEiOiJmb29iYXIiLCJpYXQiOjE2NzUxOTc0MTd9.lI1aSnCfCk3cY5lntEGd6yAEeBF_8jvdqjs6Q
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /findAllUsers:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of users.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some error occurred while retrieving users.
 *
 */

router.get('/findAllUsers', async (req, res) => {
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


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /createUser:
 *   post:
 *     summary: Create a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: email already exists
 *       500:
 *         description: Some error occurred while retrieving users.
 *
 */

router.post('/createUser', async (req, res) => {
    let access_token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 336),
        data: 'foobar'
      }, 'secret');

    const existingEmail = await userModel.findOne({ email: req.body.email }).exec();
    const existingCoachEmail = await coachModel.findOne({ email: req.body.email }).exec();

    if (existingEmail || existingCoachEmail) {
        res.status(403).send({
            message:
              err.message || "email already exists"
          });
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
            res.json({...req.body, token: user.token});
        }
        catch (error) {
            res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving users."
              });
        }
    }
});


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /createUserByAdmin:
 *   post:
 *     summary: Create a user from admin page
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: email already exists
 *       500:
 *         description: Some error occurred while retrieving users.
 *
 */

router.post('/createUserByAdmin', async (req, res) => {
    let access_token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 336),
        data: 'foobar'
      }, 'secret');
    const existingUser = await userModel.findOne({ email: req.body.email }).exec()
    if (existingUser) {
        res.status(403).send({
            message:
              err.message || "email already exists"
          });
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
        try {
            await user.save();
            res.send(user);
        }
        catch (error) {
            res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving users."
              });
        }
    }
});


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /findUserById/:id:
 *   get:
 *     summary: Get the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some error occurred while retrieving user.
 *
 */

router.get('/findUserById/:id', async (req, res) => {
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

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /findUserWithToken/:token:
 *   get:
 *     summary: Get the user by token
 *     tags: [Users]
 *     parameters:
 *       - token: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The user token
 *     responses:
 *       200:
 *         description: The user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: "No user matched"
 *       500:
 *         description: "Some error occurred while retrieving user."
 *
 */

router.get('/findUserWithToken/:token', async(req, res) => {
    const token = req.params.token;
    const user = await userModel.find({token: token})
    const coach = await coachModel.find({token: token})
    if(user != null || user != {} || user != undefined){
        try{
            res.json({user: user});
        }
        catch(err){
            res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving user."
              });
        }
    }
    else if(coach != null || coach != {} || coach != undefined){
        try{
            res.json({coach: coach})
        }
        catch(err){
            res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving user."
              });
        }
    }
    else{
        res.status(403).send({
            message:
              err.message || "No user matched"
          });
    }
})


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /findUserByEmail:
 *   post:
 *     summary: Find a user by his email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The matched user or coach.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       402:
 *         description: Bad password
 *       403:
 *         description: This user doesn't exist.
 *       500:
 *         description: Some error occurred while retrieving user.
 *
 */

router.post('/findUserByEmail', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await userModel.findOne({email: email})
    const coach = await coachModel.findOne({email: email})
    try{
        if( user != null ) {
             if (bcryptjs.compareSync(password, user.password ) == true) {
                 res.json(user)
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


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /getUserType/:token:
 *   get:
 *     summary: Search if the user is a client or a coach
 *     tags: [Users]
 *     parameters:
 *       - token: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The user token
 *     responses:
 *       200:
 *         description: The user (customer or coach).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: "Some error occurred while retrieving user."
 *
 */

router.get('/getUserType/:token', async(req, res) => {
    const user = await userModel.findOne({token: req.params.token});
    const coach = await coachModel.findOne({token: req.params.token});

    if(user){
        try{
            res.json({"type": "customer", "user": user})            
        }
        catch(err){
            res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving user."
              });
        }
    }
    else if(coach){
        try{
            res.json({"type": "coach", "coach": coach})
        }
        catch(err){
            res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving user."
              });
        }
    }
})



/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /updateUser/:id:
 *   put:
 *     summary: Update a user informations
 *     tags: [Users]
 *     parameters:
 *       - id: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The updated user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         Data to update can not be empty!
 *       500:
 *         description: Some error occurred while updating user.
 *
 */

router.put('/updateUser/:id', UserExistId, async (req, res) => {
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


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /deleteUser/:id:
 *   delete:
 *     summary: Delete a user by id
 *     tags: [Users]
 *     parameters:
 *       - id: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       204:
 *         description: The user has been deleted.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: "Some error occurred while deleting user."
 *
 */
router.delete('/deleteUser/:id', UserExistId, async (req, res) => {
    const id = req.params.id;
    const users = await userModel.findByIdAndRemove(id)
    const appointments = await appointmentModel.deleteMany({id_user: id})
    try{
        res.status(204)
    }
    catch(err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while deleting user."
      });
    };
});

module.exports = router;