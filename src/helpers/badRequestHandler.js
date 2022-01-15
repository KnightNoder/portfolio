function badRequestHandler(req, res) {
  const loggedIn = req.session.user ? true : false;
  res.render('404', {
    error: 'Error:500, Bad request',
    isLoggedOut: !loggedIn,
  });
}

module.exports = badRequestHandler;
