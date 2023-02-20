const userModel = require("../models/index.js");


async function userExist(req, res, next) {
    const userId = req.body.user_id;
    const user = await userModel.findOne({ _id: userId }); //get user that tries to rate
  
    if (user === null) {
      return res.status(404).send("User does not exist")
    } else {
      next()
    }
  }

  async function UserExistId(req, res, next) {
    const id = req.params.id;
    const user = await userModel.findById(id)
    if (user === null) {
        return res.status(404).send("User does not exist")
    }
    next()
    
  }

  module.exports = {
    userExist,
    UserExistId
  }