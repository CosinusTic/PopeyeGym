const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = require('../../users_express/routes');
const router = express();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.use(express.json());
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

const fields = ["image", "label", "ingredientLines", "dietLabels", "healthlabels", "calories", "totalTime", "cuisineType", "mealType", "totalNutrients"];


/* --- Read --- */

//home page default request
app.get('/recipes/default', async(req, res) => {
  const calories = "100-800"
  let url = "https://api.edamam.com/api/recipes/v2?app_id=ae4522c9&app_key=4c1bda8106e54fd94e9aefc797ec6d1d&random=true&type=public&calories=" + calories;
  for(let field in fields){
    url+= ("&field=" + fields[field]);
  }
  console.log(url);
  const response = await fetch(url)
    .then((response) => response.json())
  
  try{
    res.json(response);
  }
  catch(err){
    console.log(err);
    res.send(err);
  }
})

//search bar
app.get('/recipes/search/:search', async(req, res) => {
  const calories = "100-800";
  const search = req.params.search;
  let url = "https://api.edamam.com/api/recipes/v2?app_id=ae4522c9&app_key=4c1bda8106e54fd94e9aefc797ec6d1d&random=true&type=public&calories=" + calories + "&q=" + search;
  for(let field in fields){
    url+= ("&field=" + fields[field]);
  }
  const response = await fetch(url)
    .then((response) => response.json());
  try{
    res.json(response);
  }
  catch(err){
    res.send(err);
    console.log(err);
  }
})

//filter by calories range
app.post('/recipes/filters', async(req, res) => {
  let url = "https://api.edamam.com/api/recipes/v2?app_id=ae4522c9&app_key=4c1bda8106e54fd94e9aefc797ec6d1d&random=true&type=public";
  const calories = req.body.calories;
  const cuisineType = req.body.cuisineType;
  const mealType = req.body.mealType;
  const time = req.body.time;
  const diet = req.body.diet;
  
  if(calories){
    url += "&calories=" + calories; 
  }
  if(cuisineType){
    url += "&cuisineType=" + cuisineType;
  }
  if(mealType){
    url += "&mealType=" + mealType;
  }
  if(time){
    url += "&time=" + time;
  }
  if(diet){
    url+="&diet=" + diet;
  }

  for(let field in fields){
    url+= ("&field=" + fields[field]);
  }

 
  const response = await fetch(url)
    .then((response) => response.json());
  
  try{
    console.log(url);
    res.json({response: response, url: url});
  }
  catch(err){
    console.log(err);
    res.send(err);
  }
})


module.exports = app;