function error(err, req, res, next) {
  res.status(500);
  res.render('404', {
    token: req.cookies['jwt'],
    error: 'Internal server error',
  });
}

module.exports = error;
