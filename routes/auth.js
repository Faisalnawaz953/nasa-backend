const express = require('express');
const User = require('../model/userModel');
const router = express.Router();
const bcrypt = require('bcryptjs');
const request = require('request');


const authenticate = require('../middleware/authenticate');

router.get('/nasa-image', authenticate, (req, res) => {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`;
  request(url, function (error, response, body) {
    if (error) {
      res.status(500).json({ error: 'Unable to fetch daily image.' });
      res.send(error);
    } else {
      res.send(JSON.parse(body));
    }
  });
});

//Sign up route
router.post('/signup', async (req, res) => {
  console.log(req.body);

  const { name, email, password, confirm_password } = req.body;

  if (!name || !email || !password || !confirm_password) {
    return res.status(500).json({ error: 'All fields are required' });
  }
  try {
    const userexist = await User.findOne({ email: email });
    if (userexist) {
      return res.status(500).json({ error: ' Email already exist' });
    } else if (password != confirm_password) {
      return res.status(500).json({ error: 'Pasword doesnt match' });
    } else {
      const user = new User({ name, email, password, confirm_password });

      const saved = await user.save();
      res.status(200).json({ message: ' user registerd successfully' });
    }
  } catch (err) {
    console.log(err);
  }
});

//Login Route
router.post('/login', async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      // fields cant be empty
      return res.status(500).json({ error: 'All fields are required' });
    }

    const login = await User.findOne({ email: email }); //if doesnot match
    // console.log(login);
    //login ky pas pora email and pass h
    if (login) {
      const ismatch = await bcrypt.compare(password, login.password); //compare krna user login ka pass and orginal

      //JWT tockenization in userMOdel
      token = await login.generateAuthToken();
      console.log('token=', token);
      res.cookie(
        'jwtoken',
        token,
        {
          expires: new Date(Date.now() + 25892000000), //after 30 days expires
          httpOnly: false
        },
        console.log('token is stored in cookie')
      );
      if (!ismatch) {
        res.status(500).json({ message: 'Invalid crediential ' });
      } else {
        res.json({ message: 'user login successfully' });
      }
    } else {
      res.status(500).json({ message: 'Invalid credientials ' });
    }
  } catch (err) {
    console.log(err);
  }
});
//logout route
router.get('/logout', (req, res) => {
  console.log('logout page');
  res.clearCookie('jwtoken', { path: '/' });
  res.status(200).send('user logout');
});

module.exports = router;