function error(err, req, res, next) {
  const isLoggedIn = req.session.user ? true : false;
  res.render('404', {
    token: req.cookies['jwt'],
    error: 'Internal server error',
  });
}

module.exports = error;
