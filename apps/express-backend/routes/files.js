const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport')(passport);
const fileController = require('../controllers').files;

router.get('/:filename', passport.authenticate('jwt', { session: false }),
    fileController.getFile)
router.post('/:folderId/:userId', passport.authenticate('jwt', { session: false }), fileController.add);
router.get('/:filename/download', fileController.downloadFile)

module.exports = router;
