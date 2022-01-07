require('dotenv').config({ path: '.env' });
require('./db/conn');
const User = require('../src/models/user');

const express = require('express');
const app = express();
const router = require('./routers/users');
const path = require('path');
const hbs = require('hbs');
const favicon = require('serve-favicon');
const PORT = process.env.PORT || 3000;
const bcrypt = require('bcryptjs');
const isAuthenticated = require('./middleware/authentication');
const cookieParser = require('cookie-parser');
const exceptionsHandler = require('./helpers/errorHandler');
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

app.get('/', isAuthenticated, (req, res) => {
  res.render('index', { token: req.cookies['jwt'] });
});

app.get('/about', (req, res) => {
  res.render('about', { token: req.cookies['jwt'] });
});

app.get('/signin', (req, res) => {
  if (req.cookies['jwt']) {
    res.redirect('/');
  } else {
    res.render('signin', { token: req.cookies['jwt'] });
  }
});

app.get('/dashboard', async (req, res) => {
  const userData = await User.find({ token: req.cookies['jwt'] });
  console.log(userData, 'user data');
  if (req.cookies['jwt']) {
    res.render('loggedIn', { user: userData[0], token: req.cookies['jwt'] });
  } else {
    res.redirect('/');
  }
});

app.post('/signin', async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    console.log(req.body, 'req body');
    const user = await User.findOne({ name: username });
    console.log(user, 'found user');
    if (Object.keys(user).length) {
      console.log('in user found');
      const match = await bcrypt.compare(password, user.password);
      console.log(user.password, password, 'compare');
      console.log(match, 'match');
      if (match) {
        req.user = user;
        console.log(req.user, 'req user');
        let userToken = await user.generateToken();
        res.cookie('jwt', userToken, {
          expires: new Date(Date.now() + 300000),
          // secure: true,
        });
        console.log(req.cookies['jwt'], userToken, 'token in post sign in');
        res.render('loggedIn', { user: user, token: userToken });
      } else {
        res.render('404', {
          error: 'Invalid password',
        });
      }
    }
  } catch (err) {
    res.render('404', {
      error: 'Invalid username',
      token: req.cookies['jwt'],
    });
  }
});

app.get('/signup', (req, res) => {
  res.render('signup', { token: req.cookies['jwt'] });
});

app.post('/signup', async (req, res) => {
  try {
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
      const token = await newUser.generateToken();
      res.cookie('jwt', token, {
        expires: new Date(Date.now() + 30000),
        // httpOnly: true,
        // secure: true,
      });
      const saveUser = await newUser.save();
      res.render('index', { token: req.cookies['jwt'] });
    } else {
      res.render('404', {
        error: 'Error:Passwords are not matching',
        token: req.cookies['jwt'],
      });
    }
  } catch (err) {
    res.render('404', {
      error: err,
      token: req.cookies['jwt'],
    });
  }
});

app.get('/resume', isAuthenticated, (req, res) => {
  const file = path.join(__dirname, '../public/files/atlas-shrugged.pdf');
  res.download(file);
});

app.get('/logout', isAuthenticated, (req, res) => {
  try {
    console.log(req.user, 'req.user ');
    res.clearCookie('jwt');
    // await req.user.save();
    console.log('hello');
    res.redirect('/');
  } catch (error) {
    res.send(error, { token: req.cookies['jwt'] });
  }
});

app.use(exceptionsHandler);

app.get('*', badRequestHandler);

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
