const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../public/templates/views'));
hbs.registerPartials(path.join(__dirname, '../public/templates/partials'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/hello', (req, res) => {
  console.log('hello');
  res.send('ehlo');
});

app.get('/flights/:from-:to', (req, res) => {
  console.log(req.params);
  res.send('ehlo');
});

app.get('/species/:family.:genus', (req, res) => {
  console.log(req.params);
  console.log(req.params.family);
  res.send('ehlo');
});

app.listen(2000, () => {
  console.log('server on');
});
