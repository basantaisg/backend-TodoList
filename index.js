const express = require('express');
const { UserModel, TodoModel } = require('./db');
const app = express();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { auth, JWT_SECRET } = require('./auth');

// connecting mongodb server
mongoose.connect(
  'pastehere.....'
);

// allowing app to parse json data sent by the backend.!
app.use(express.json());

// Sign up!
app.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;

  await UserModel.create({
    email: email,
    password: password,
    name: name,
  }).catch(res.json({ message: 'User already exists' }));

  res.json({
    message: 'You are signed up!',
  });
});

// Sign in model
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({
    email: email,
    password: password,
  });

  if (user) {
    const token = jwt.sign(
      {
        id: user._id.toString(),
      },
      JWT_SECRET
    );

    res.json({ token });
  } else {
    res.status(403).json({
      // 403 -> not authorized!
      message: 'Incorrect credintials',
    });
  }
});

// To-do's routes
app.post('/todo', auth, async (req, res) => {
  const userId = req.userId;
  const { title, completed } = req.body;

  await TodoModel.create({
    title,
    completed,
    userId,
  });
});

// Getting todo s info
app.get('/todos', auth, async (req, res) => {
  const userId = req.userId;

  const todos = await TodoModel.find({ userId: userId });

  res.json({
    todos,
  });
});

app.listen(3000);
