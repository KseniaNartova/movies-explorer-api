const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const users = require('./user');
const movies = require('./movie');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controller/user');
const { loginValidator, createUserValidator } = require('../middlewares/validation');

router.post('/signin', loginValidator, login);
router.post('/signup', createUserValidator, createUser);
router.use('/users', users);
router.use('/movies', movies);

router.use(auth);
router.all('*', (req, res, next) => {
  next(new NotFoundError('Cтраницa не существует'));
});

module.exports = router;
