const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport')(passport);
const systemController = require('../controllers').system;

router.post('/items/:id', passport.authenticate('jwt', { session: false }),
    systemController.updateItem)
router.get('/recent/:userId', passport.authenticate('jwt', { session: false }),
    systemController.recentFiles)
router.get('/home/:userId', passport.authenticate('jwt', { session: false }),
    systemController.getUserHomeFolder)
router.get('/address/:fileAddress',
    systemController.getFileByAddress)
router.get('/contents/:parentFolderId', passport.authenticate('jwt', { session: false }),
    systemController.getContentsOfFolder)
router.post('/folder/:parentFolderId/:userId', passport.authenticate('jwt', { session: false }),
    systemController.createFolderForUser)
router.post('/items', passport.authenticate('jwt', { session: false }),
    systemController.deleteItems)
router.post('/ai/message', passport.authenticate('jwt', { session: false }),
    systemController.sendAIMessage)

module.exports = router;
