const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true
};
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
