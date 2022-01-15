require('dotenv').config({ path: '.env' });
require('./db/conn');

const express = require('express');
const app = express();
const User = require('../src/models/user');
const router = require('./routers/users');
const path = require('path');
const hbs = require('hbs');
const favicon = require('serve-favicon');
const PORT = process.env.PORT || 3000;
const bcrypt = require('bcryptjs');
// const isAuthenticated = require('./middleware/authentication');
const session = require('express-session');
const {
  googleLoginUrl,
  getGoogleAccessToken,
  getGoogleUserInfo,
} = require('./helpers/googleLogin');
const {
  githubLoginUrl,
  getGithubAccessToken,
  getGithubInfo,
} = require('./helpers/githubLogin');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 300000 },
  })
);

app.use(favicon(path.join(__dirname, '../public/icons/bat.ico')));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../public/templates/views'));
hbs.registerPartials(path.join(__dirname, '../public/templates/partials'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const badRequestHandler = require('./helpers/badRequestHandler');
app.use(router);

app.get('/', checkSignIn, async (req, res) => {
  const loggedIn = req.session.user ? true : false;
  try {
    // const userFound = await User.findOne({ token: req.cookies['jwt'] });
    res.render('loggedIn', {
      isLoggedOut: !loggedIn,
      user: req.session.user,
    });
  } catch (err) {
    res.render('404', {
      error: err,
      isLoggedOut: !loggedIn,
    });
  }
});

app.get('/homepage', (req, res) => {
  const loggedIn = req.session.user ? true : false;
  try {
    console.log(req.session.user, 'user in about');
    res.render('homepage', { isLoggedOut: !loggedIn, user: req.session.user });
  } catch (err) {
    res.render('404', {
      error: err,
      isLoggedOut: !loggedIn,
    });
  }
});

app.get('/about', (req, res) => {
  const loggedIn = req.session.user ? true : false;
  try {
    console.log(req.session.user, 'user in about');
    res.render('about', { isLoggedOut: !loggedIn, user: req.session.user });
  } catch (err) {
    res.render('404', {
      error: err,
      isLoggedOut: !loggedIn,
    });
  }
});

app.get('/signin', (req, res) => {
  // const user = User.findOne({ token: req.cookies['jwt'] });
  const loggedIn = req.session.user ? true : false;
  console.log(githubLoginUrl, 'url');
  try {
    if (loggedIn) {
      res.redirect('/');
    } else {
      res.render('signin', {
        isLoggedOut: !loggedIn,
        user: req.session.user,
        loginWithGoogleLink: googleLoginUrl,
        loginWithGithubLink: githubLoginUrl,
      });
    }
  } catch (err) {
    res.render('404', {
      error: err,
      isLoggedOut: !loggedIn,
    });
  }
});

app.get('/signup', (req, res) => {
  const loggedIn = req.session.user ? true : false;
  try {
    console.log(req.session.user, 'user in /signup');
    res.render('signup', { isLoggedOut: !loggedIn });
  } catch (err) {
    res.render('404', {
      error: err,
      isLoggedOut: !loggedIn,
    });
  }
});

app.get('/resume', checkSignIn, (req, res) => {
  const loggedIn = req.session.user ? true : false;
  try {
    const file = path.join(__dirname, '../public/files/atlas-shrugged.pdf');
    res.download(file);
  } catch (err) {
    res.render('404', {
      error: err,
      isLoggedOut: !loggedIn,
    });
  }
});

app.get('/logout', checkSignIn, (req, res) => {
  console.log(req.session.user, 'user in /');
  const loggedIn = req.session.user ? true : false;
  try {
    console.log(req.user, 'req.user ');
    res.clearCookie('jwt');
    req.session.destroy((err) => {
      if (err) {
        res.render('404', {
          error: err,
          isLoggedOut: !loggedIn,
        });
      } else {
        res.header(
          'Cache-Control',
          'private, no-cache, no-store, must-revalidate'
        );
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.redirect('/');
        console.log('req.session destroyed');
      }
    });
  } catch (error) {
    // const user = User.findOne({ token: req.cookies['jwt'] });
    res.render('404', {
      error: err,
      isLoggedOut: !loggedIn,
    });
  }
});

app.get('/dashboard', checkSignIn, async (req, res) => {
  const loggedIn = req.session.user ? true : false;
  try {
    console.log(req.session.user, 'session data in dash');
    res.render('loggedIn', {
      user: req.session.user,
      isLoggedOut: !loggedIn,
    });
  } catch (err) {
    res.render('404', {
      error: err,
      isLoggedOut: !loggedIn,
    });
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

app.get('/authenticate/google', async (req, res) => {
  const loggedIn = req.session.user ? true : false;
  const code = req.query.code;
  const response = getGoogleAccessToken(code);
  console.log(response, 'resp data');
  response
    .then(async (access_token) => {
      console.log(access_token, 'token');
      const userInfo = getGoogleUserInfo(access_token);
      userInfo
        .then((username) => {
          req.session.user = { name: username, role: 'user' };
          res.redirect('/dashboard');
        })
        .catch((err) => {
          res.render('404', {
            error: err,
            isLoggedOut: !loggedIn,
          });
        });
    })
    .catch((err) => {
      res.render('404', {
        error: err,
        isLoggedOut: !loggedIn,
      });
    });
});

app.get('/authenticate/github', async (req, res) => {
  const loggedIn = req.session.user ? true : false;
  const code = req.query.code;
  const response = getGithubAccessToken(code);
  console.log(response, 'resp data');
  response
    .then(async (access_token) => {
      console.log(access_token, 'token');
      const userInfo = getGithubInfo(access_token);
      userInfo
        .then((username) => {
          req.session.user = { name: username, role: 'user' };
          res.redirect('/dashboard');
        })
        .catch((err) => {
          res.render('404', {
            error: err,
            isLoggedOut: !loggedIn,
          });
        });
    })
    .catch((err) => {
      res.render('404', {
        error: err,
        isLoggedOut: !loggedIn,
      });
    });
});

app.get('*', badRequestHandler);

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});

function checkSignIn(req, res, next) {
  if (req.session.user) {
    next(); //If session exists, proceed to page
  } else {
    res.redirect('/signin'); //Error, trying to access unauthorized page!
  }
}
