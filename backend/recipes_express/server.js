const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const router = require('./routes');

app.use(express.json());
app.use(router);
mongoose.set('strictQuery', false);

app.use(express.static(__dirname + '/public'))
  .use(express.urlencoded())
  .use(cookieParser())
  .use(cors());


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

mongoose.connect("mongodb+srv://Clementine:Clementine42@chaudtime.5ayuxil.mongodb.net/popeye_gym?retryWrites=true&w=majority", {
    useNewUrlParser: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});


app.listen(3001, () => {
  console.log("Listening on port 3001");
});