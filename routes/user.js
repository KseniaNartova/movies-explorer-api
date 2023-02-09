const router = require('express').Router();
const {
  updateUser,
  getUserInfo,
} = require('../controller/user');
const { updateUserValidator } = require('../middlewares/validation');
const auth = require('../middlewares/auth');

router.use(auth);
router.get('/me', getUserInfo);
router.patch('/me', updateUserValidator, updateUser);

module.exports = router;
