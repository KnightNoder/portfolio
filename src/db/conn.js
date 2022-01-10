const mongoose = require('mongoose');

const DB_URL =
  process.env.NODE_ENV === 'prod'
    ? `${process.env.MONGODB_URL}`
    : `${process.env.DB_URL}`;

console.log(DB_URL, 'db url');

mongoose
  .connect(`${DB_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connection succesfull');
  })
  .catch((e) => {
    console.log(`No connection due to ${e}`);
  });

// console.log(`${DB}://${DB_HOST}:${DB_PORT}/testApp`);
// .connect(`mongodb://localhost:27017/testApp`, {
