const mongoose = require('mongoose');
const DB = process.env.DB || 'mongodb';
const DB_HOST = process.env.HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '27017';

console.log(`${DB}://${DB_HOST}:${DB_PORT}/testApp`);
mongoose
  .connect(`${process.env.MONGODB_URL}`, {
    // .connect(`mongodb://localhost:27017/testApp`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connection succesfull');
  })
  .catch((e) => {
    console.log(`No connection due to ${e}`);
  });
