const coachModel = require("../models/coach.js");

async function isCoach(req, res, next) {
    const coachId = req.body.coach_id;
    const coach = await coachModel.findOne({ _id: coachId }); //get user that tries to rate
  
    if (coach === null) {
      return res.status(404).send("Coach does not exist")
    } else {
      next()
    }
  }

  module.exports = {
    isCoach
  }