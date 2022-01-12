const express = require('express');
const router = new express.Router();
const isAuthenticated = require('../middleware/authentication');
const isAuthorized = require('../middleware/authorization');
const User = require('../models/user');
// const redis = require('redis');
// const redisClient = redis.createClient('6379');

router.get(
  '/api/users',
  // , isAuthenticated,
  async (req, res) => {
    try {
      const userList = await User.find({});
      console.log(userList, 'user list found');
      res.send(userList);
    } catch (error) {
      console.log(error);
    }
  }
);

router.get(
  '/api/users/:username',
  // isAuthenticated,
  // isAuthorized,
  async (req, res) => {
    try {
      const username = req.params.username;
      const user = await User.find({ name: username });
      console.log(user, 'user found');
      res.send(user);
      // res.render('index', { user: user[0].name });
    } catch (error) {
      console.log(error);
    }
  }
);

router.put(
  '/api/users/:username',
  isAuthenticated,
  // isAuthorized,
  async (req, res) => {
    try {
      const username = req.params.username;
      const user = await User.findOneAndUpdate({ name: username }, req.body);
      res.send(user.password);
    } catch (error) {
      console.log(error);
    }
  }
);

router.post(
  '/api/users',
  isAuthenticated,
  // isAuthorized,
  async (req, res) => {
    try {
      console.log('in post users');
      const newUser = new User(req.body);
      const addingUser = await newUser.save();
      res.send(addingUser);
    } catch (error) {
      res.send(error);
    }
  }
);

router.delete(
  '/api/users/:username',
  isAuthenticated,
  // isAuthorized,
  async (req, res) => {
    try {
      const username = req.params.username;
      const user = await User.deleteOne({ name: username });
      res.status(200).send('Ok');
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
