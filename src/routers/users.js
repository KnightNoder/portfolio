const express = require('express');
const router = new express.Router();
// const async = require('async');
const User = require('../models/user');

router.get('/users', async (req, res) => {
  try {
    const userList = await User.find({});
    console.log(userList, 'user list found');
    res.send(userList);
    // res.status(200).render('index');
  } catch (error) {
    console.log(error);
  }
});

router.get('/users/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.find({ name: username, auth: true });
    console.log(user, 'user found');
    res.send(user);
    // res.render('index', { user: user[0].name });
  } catch (error) {
    console.log(error);
  }
});

router.put('/users/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOneAndUpdate({ name: username }, req.body);
    res.send(user.password);
  } catch (error) {
    console.log(error);
  }
});

router.post('/users', async (req, res) => {
  try {
    console.log('in post users');
    const newUser = new User(req.body);
    const addingUser = await newUser.save();
    res.send(addingUser);
  } catch (error) {
    res.send(error);
  }
});

router.delete('/users/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.deleteOne({ name: username });
    res.status(200).send('Ok');
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
