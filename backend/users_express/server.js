const express = require('express');
///////////////////// swagger  ////////////////////////
  bodyParser = require("body-parser"),
  swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");
//////////////////////////////////////////////////////

const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bcryptjs = require('bcryptjs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'))
app.use(cookieParser())
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://Clementine:Clementine42@chaudtime.5ayuxil.mongodb.net/popeye_gym?retryWrites=true&w=majority", {
    useNewUrlParser: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});


const RouterUser = require('./routes');
const RouterCoach = require('./routes/coach.js')
const RouterAppointment = require('./routes/appointment.js')
const RouterClub = require('./routes/club.js')

app.use(RouterUser).use(RouterCoach).use(RouterAppointment).use(RouterClub)


////////////////////////   swagger /////////////////////////////
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Popeye's Gym",
      description:
        "Swagger documentation for a gym Express Api ",
    },
    servers: [
      {
        url: "http://localhost:3002",
      },
    ],
  },
  apis: [`${__dirname}/api/*.js`],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

///////////////////////////////////////////////////////////////

app.listen(3002, () => {
  console.log("Listening on port 3002");
});