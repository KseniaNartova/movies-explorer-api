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

router.get('/', getMovie);
router.post('/', createMovieValidator, createMovie);
router.delete('/:movieId', deleteMovieValidator, deleteMovie);

module.exports = router;
