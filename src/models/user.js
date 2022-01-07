const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
});

userSchema.methods.generateToken = async function () {
  try {
    console.log(process.env.SECRET_KEY, 'secret key');
    const newToken = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    // this.tokens = this.tokens.concat({ token: newToken });
    this.token = newToken;
    console.log(newToken);
    await this.save();
    return newToken;
  } catch (error) {
    console.log(error);
  }
};

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
    console.log(`password is ${this.password} `);
  }
  next();
});

const User = new mongoose.model('UserModel', userSchema);

module.exports = User;
