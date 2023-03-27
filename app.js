const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://nasa-frontend-five.vercel.app");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Max-Age", 3000);
  res.header("Access-Control-Allow-Methods", [
    "POST",
    "PUT",
    "GET",
    "OPTIONS",
    "HEAD",
    "PATCH",
  ]);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});
const whitelist = [ 'https://nasa-frontend-five.vercel.app']
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error())
    }
  },
  methods:["POST", "PUT", "GET", "OPTIONS", "HEAD", "PATCH"],
  credentials: true
}

//Middleware
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', require('./routes/auth.js'));

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on('connected', () => {
  console.log('database connected');
});
mongoose.connection.on('error', () => {
  console.log('database error occured');
});

app.listen(PORT, () => {
  console.log('http://localhost:5000/');
});
