const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const AuthError = require('../errors/AuthError');
const { INCORRECT_TYPE_EMAIL, WRONG_DATA_OR_PASSWORD } = require('../utils/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => isEmail(email),
        message: () => INCORRECT_TYPE_EMAIL,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError(WRONG_DATA_OR_PASSWORD);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError(WRONG_DATA_OR_PASSWORD);
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
