const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const {
  USER_NOT_FOUND,
  INCORRECT_DATA,
  EMAIL_ALREADY_EXISTS,
} = require('../utils/constants');

const { SECRET_JWT = 'dev-secret' } = process.env;

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError(USER_NOT_FOUND))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(INCORRECT_DATA));
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError(USER_NOT_FOUND))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(INCORRECT_DATA));
      }
      if (err.code === 11000) {
        return next(new ConflictError(EMAIL_ALREADY_EXISTS));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        process.env.NODE_ENV === 'production' ? SECRET_JWT : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      name,
      _id: user._id,
      email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(INCORRECT_DATA));
      }
      if (err.code === 11000) {
        return next(new ConflictError(EMAIL_ALREADY_EXISTS));
      }
      return next(err);
    });
};
