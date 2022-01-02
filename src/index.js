const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const PORT = process.env.PORT || 3000;

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../public/templates/views'));
hbs.registerPartials(path.join(__dirname, '../public/templates/partials'));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('*', (req, res) => {
  res.render('404', {
    error: 'Error:500, Bad request',
  });
});
app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
