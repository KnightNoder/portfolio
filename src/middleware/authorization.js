const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');

const isAuthorized = async function authorization(req, res, next) {
  try {
    const userToken = req.cookies.jwt;
    const username = req.params.username;

    const user = await User.findOne({ name: username });
    if (userToken === user.token) {
      console.log('inside verify');
      next();
    } else {
      res.send('Not authorized');
    }
  } catch (error) {
    res.send('error');
  }
};

module.exports = isAuthorized;
