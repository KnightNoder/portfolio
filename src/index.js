require('dotenv').config({ path: '.env' });
require('./db/conn');

const express = require('express');
const app = express();
const router = require('./routers/users');
const path = require('path');
const hbs = require('hbs');
const favicon = require('serve-favicon');
const PORT = process.env.PORT || 3000;
const bcrypt = require('bcryptjs');
// const isAuthenticated = require('./middleware/authentication');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const axios = require('axios');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);

const exceptionsHandler = require('./helpers/errorHandler');
const User = require('../src/models/user');
const badRequestHandler = require('./helpers/badRequestHandler');
app.use(cookieParser());
app.use(favicon(path.join(__dirname, '../public/icons/favicon.ico')));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../public/templates/views'));
hbs.registerPartials(path.join(__dirname, '../public/templates/partials'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

app.get('/', async (req, res) => {
  try {
    const loggedIn = req.session.user ? true : false;
    console.log(loggedIn, 'logged in');
    // const userFound = await User.findOne({ token: req.cookies['jwt'] });
    res.render('homepage', { isLoggedOut: !loggedIn, user: req.session.user });
  } catch (error) {}
});

app.get('/about', (req, res) => {
  console.log(req.session.user, 'user in about');
  const loggedIn = req.session.user ? true : false;
  res.render('about', { isLoggedOut: !loggedIn, user: req.session.user });
});

app.get('/signin', (req, res) => {
  // const user = User.findOne({ token: req.cookies['jwt'] });
  const loggedIn = req.session.user ? true : false;
  console.log(loggedIn, 'log in val');
  if (loggedIn) {
    res.redirect('/');
  } else {
    res.render('signin', { isLoggedOut: !loggedIn, user: req.session.user });
  }
});

app.get('/signup', (req, res) => {
  console.log(req.session.user, 'user in /signup');
  const loggedIn = req.session.user ? true : false;
  res.render('signup', { isLoggedOut: !loggedIn });
});

app.get('/resume', (req, res) => {
  const file = path.join(__dirname, '../public/files/atlas-shrugged.pdf');
  res.download(file);
});

app.get('/logout', (req, res) => {
  console.log(req.session.user, 'user in /');
  try {
    console.log(req.user, 'req.user ');
    res.clearCookie('jwt');
    req.session.destroy((err) => {
      console.log('req.session destroyed');
    });
    res.redirect('/');
  } catch (error) {
    // const user = User.findOne({ token: req.cookies['jwt'] });
    const loggedIn = req.session.user ? true : false;
    res.send(error, { isLoggedOut: !loggedIn, user: req.session.user });
  }
});

app.get('/dashboard', async (req, res) => {
  try {
    console.log(req.session.user, 'session data in dash');
    const loggedIn = req.session.user ? true : false;
    res.render('loggedIn', {
      user: req.session.user,
      isLoggedOut: !loggedIn,
    });
  } catch (error) {
    console.log(error, 'caught error in user dashboard');
    res.redirect('/error');
  }
});

app.post('/signin', async (req, res) => {
  const loggedIn = req.session.user ? true : false;
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ name: username });
    if (Object.keys(user).length) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        // let userToken = await user.generateToken();
        req.session.user = user;
        console.log(req.session, 'session data');
        // res.cookie('jwt', userToken, {
        //   expires: new Date(Date.now() + 300000),
        //   httpOnly: true,
        //   secure: true,
        // });
        res.redirect('/dashboard');
      } else {
        res.render('404', {
          error: 'Invalid password',
          isLoggedOut: !loggedIn,
        });
      }
    }
  } catch (err) {
    res.render('404', {
      error: 'Invalid username',
      isLoggedOut: !loggedIn,
    });
  }
});

app.post('/signup', async (req, res) => {
  const loggedIn = req.session.user ? true : false;
  try {
    if (loggedIn) {
      res.redirect('/');
    } else {
      const password = req.body.password;
      const cn_password = req.body.cnf_password;
      console.log(req.body, 'form body');
      const role = 'user';
      if (cn_password === password) {
        console.log('in if');
        const newUser = new User({
          name: req.body.username,
          password: req.body.password,
          role: 'user',
        });
        console.log(newUser, 'new user');
        const saveUser = await newUser.save();
        res.redirect('/');
      } else {
        res.render('404', {
          error: 'Error:Passwords are not matching',
          isLoggedOut: !loggedIn,
        });
      }
    }
  } catch (err) {
    res.render('404', {
      error: err,
      isLoggedOut: !loggedIn,
    });
  }
});

app.use(exceptionsHandler);

app.get('*', badRequestHandler);

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
