const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const db = require('./db.js');

// body parser for POST requests
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async (req, res) => {
  const name = req.body.username;
  console.log('Received username: ', name);

  try {
    const userJsonDoc = await db.createUser(name);
    const {_id, username} = userJsonDoc;
    res.json({_id, username});
  } catch (err) {
    console.error('Error handling the request:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  };
});

app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await db.getAllUsers();
    res.json(allUsers);
  } catch (err) {
    console.error('Error handling the request:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  };
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  const userId = req.params._id;
  try {
    const description = req.body.description;
    const duration = req.body.duration;
    let date;
    if (req.body.date) {
      const inputDate = new Date(req.body.date);
      date = inputDate.toDateString();
    } else {
      const currentDate = new Date();
      date = currentDate.toDateString();
    }

    const updatedUser = await db.logExercise(userId, description, duration, date);
    
    res.json({
      _id: updatedUser._id, 
      username: updatedUser.username, 
      date, 
      duration: parseInt(duration), 
      description
    });

  } catch (err) {
    console.error('Error handling the request:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  };
});

app.get('/api/users/:_id/logs/:from?/:to?/:limit?', async (req, res) => {
  const userId = req.params._id;
  const from = req.query.from;
  const to = req.query.to;
  const limit = req.query.limit
  console.log('Limit:', limit);

  try {
    const userFound = await db.findUserById(userId, from, to, limit);
    res.json(userFound);
  } catch (err) {
    console.error('Error handling the request:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  };
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
