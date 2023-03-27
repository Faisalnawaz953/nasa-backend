const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
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
