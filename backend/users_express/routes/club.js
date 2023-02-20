const express = require("express");
const clubModel = require("../models/club.js");
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

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


// FIND ALL FITNESS CLUBS 

app.get('/findAllFitnessClubs', async (req, res) => {
    const clubs = await clubModel.find()
    try{
        res.json(clubs)
    }
    catch(err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving fitness clubs."
      });
    };
});


// FIND NEAREST FITNESS CLUBS 

app.get('/findNearestFitnessClubs/:lat/:lon', async (req, res) => {
    try{
        fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${req.params.lat},${req.params.lon}&radius=5000&type=gym&key=AIzaSyDSO3UbyD2oRH2cr1NJZovqOlI1eIHw5ag`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data.results);
          res.json(data.results)
        });  
    }
    catch(err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving fitness clubs."
      });
    };
});

module.exports = app;