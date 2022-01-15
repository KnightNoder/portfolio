require('dotenv').config({ path: '.env' });
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
const axios = require('axios');

app.use(cookieParser());
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../public/templates/views'));
hbs.registerPartials(path.join(__dirname, '../public/templates/partials'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const queryString = require('query-string');

const stringifiedParams = queryString.stringify({
  client_id:
    '634419064511-3obubhmdu89b0a9jtmfaja3vgjfj6ob5.apps.googleusercontent.com',
  redirect_uri: 'http://localhost:2000/authenticate/google',
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ].join(' '), // space seperated string
  response_type: 'code',
  access_type: 'offline',
  prompt: 'consent',
});

const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

app.get('/', (req, res) => {
  res.render('index', { link: googleLoginUrl });
});

app.get('/authenticate/google', (req, res) => {
  console.log('hello');
  const urlParams = req.params.code;

  console.log(req.params, 'params');

  res.send('got code');

  console.log(token, 'refresh token');

  // if (urlParams.error) {
  //   console.log(`An error occurred: ${urlParams.error}`);
  // } else {
  //   console.log(`The code is: ${urlParams.code}`);
  // }
});

app.get('/code', async (req, res) => {
  const access_token = await getAccessTokenFromCode();
  console.log(access_token, 'token access');
  res.send('token sent');
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

async function getAccessTokenFromCode() {
  const code =
    '4%2F0AX4XfWjrAGKzne4RKRpn7gBsI1nIGsfP5gPcglZVPyr05twsupSnfmDq-B94DC_KAeWPPQ&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&authuser=0&prompt=consent#';
  const { data } = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: 'post',
    data: {
      client_id:
        '634419064511-3obubhmdu89b0a9jtmfaja3vgjfj6ob5.apps.googleusercontent.com',
      client_secret: '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',
      redirect_uri: 'http://localhost:2000/authenticate/google',
      grant_type: 'authorization_code',
      code,
    },
  });
  return data.access_token;
}
