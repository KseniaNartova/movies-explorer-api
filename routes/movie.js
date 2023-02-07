const router = require('express').Router();
const {
  getMovie,
  createMovie,
  deleteMovie,
} = require('../controller/movie');
const {
  createMovieValidator,
  deleteMovieValidator,
} = require('../middlewares/validation');
const auth = require('../middlewares/auth');

router.use(auth);
router.get('/', getMovie);
router.post('/', createMovieValidator, createMovie);
router.delete('/:movieId', deleteMovieValidator, deleteMovie);

module.exports = router;
