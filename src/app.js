// const express = require('express');
// const app = express();
// const fs = require('fs');
// const path = require('path');
// const hbs = require('hbs');
// const cookieParser = require('cookie-parser');

// app.use(cookieParser());
// app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, '../public/templates/views'));
// hbs.registerPartials(path.join(__dirname, '../public/templates/partials'));
// app.use(express.static(path.join(__dirname, '../public')));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// app.get('/', (req, res) => {
//   res.cookie('one', 'lava', {
//     expires: new Date(Date.now + 60000),
//   });

//   res.cookie('bcd', 'lava', {
//     expires: new Date(Date.now + 60000),
//   });
//   res.render('index');
// });

// app.get('/hello', (req, res) => {
//   console.log('hello');
//   res.send('ehlo');
// });

// app.listen(2000, () => {
//   console.log('server on');
// });

const b = ['abc', 'jwt='];
let c = false;

b.forEach((element) => {
  if (element.startsWith('jwt', 0)) {
    c = true;
  }
});
console.log(c, 'c');
