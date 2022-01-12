function error(req, res) {
  const isLoggedIn = req.session.user ? true : false;
  res.render('404', {
    isLoggedOut: !isLoggedIn,
    error: 'Internal server error',
  });
}

module.exports = error;
