const express = require('express');
const app = express();
require('./db/conn');
const fs = require('fs');
const path = require('path');
const hbs = require('hbs');
const favicon = require('serve-favicon');
const PORT = process.env.PORT || 3000;

const router = require('./routers/users');
const User = require('../src/models/user');

app.use(router);
app.use(favicon(path.join(__dirname, '../public/icons/favicon.ico')));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../public/templates/views'));
hbs.registerPartials(path.join(__dirname, '../public/templates/partials'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/signin', (req, res) => {
  res.render('signin');
});

app.post('/signin', async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    console.log(req.body, 'req body');
    const user = await User.findOne({ name: username });
    console.log(user, 'name of user');
    res.render('main', { name: user.name });
  } catch (err) {
    res.render('404', {
      error: err,
    });
  }
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', async (req, res) => {
  // res.render('signup');
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
      const saveUser = await newUser.save();
      res.send('user saved');
    } else {
      res.render('404', {
        error: 'Error:Passwords are not matching',
      });
    }
  } catch (err) {
    res.render('404', {
      error: err,
    });
  }
});

app.get('/resume', (req, res) => {
  const file = path.join(__dirname, '../public/files/atlas-shrugged.pdf');
  res.download(file);
});

app.get('*', (req, res) => {
  res.render('404', {
    error: 'Error:500, Bad request',
  });
});

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
