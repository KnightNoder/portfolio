const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');

const isAuthenticated = async function authentication(req, res, next) {
  try {
    const userToken = req.cookies.jwt;
    console.log(userToken, 'usertoken from cookies');
    const user = await User.find({ token: userToken });
    const verifyUser = jwt.verify(userToken, process.env.SECRET_KEY);
    if (verifyUser) {
      console.log('inside verify');
      next();
    } else {
      res.send('err');
    }
  } catch (error) {
    res.redirect('/signin');
  }
};

function isLoggedIn(key) {
  return new Promise((resolve, reject) => {
    const userPromise = User.find({ api_key: key });
    userPromise
      .then((user) => {
        resolve(user[0]);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = isAuthenticated;
