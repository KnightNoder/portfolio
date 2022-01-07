const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');

const isAuthenticated = async function authentication(req, res, next) {
  try {
    const userToken = req.cookies.jwt;
    console.log(userToken, 'usertoken from cookies');
    const user = await User.find({ token: userToken });
    req.user = user;
    console.log(req.user, 'req user data');
    req.token = userToken;
    const verifyUser = jwt.verify(userToken, process.env.SECRET_KEY);
    if (verifyUser._id) {
      console.log('inside verify');
      next();
    } else {
      res.send('err');
    }
  } catch (error) {
    res.redirect('/signin');
  }
};

module.exports = isAuthenticated;
