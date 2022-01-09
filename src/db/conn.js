const mongoose = require('mongoose');
const DB = process.env.DB || 'mongodb';
const DB_HOST = process.env.HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '27017';

mongoose
  .connect(
    `mongodb+srv://lava:password_123@freecluster.siwam.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('connection succesfull');
  })
  .catch((e) => {
    console.log(`No connection due to ${e}`);
  });

// console.log(`${DB}://${DB_HOST}:${DB_PORT}/testApp`);
// .connect(`mongodb://localhost:27017/testApp`, {
