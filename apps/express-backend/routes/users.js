const express = require('express');
const router = express.Router();
const userController = require('../controllers').users;
const passport = require('passport');
require('../config/passport')(passport);


/* GET users listing. */
router.get('/', passport.authenticate('jwt', { session: false }),
    userController.list);
router.get('/:id', passport.authenticate('jwt', { session: false }),
    userController.getById);
router.post('/', userController.add);
router.put('/:id', passport.authenticate('jwt', { session: false }),
    userController.update);

module.exports = router;
