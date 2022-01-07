function badRequestHandler(req, res) {
  res.render('404', {
    error: 'Error:500, Bad request',
    token: req.cookies['jwt'],
  });
}

module.exports = badRequestHandler;
