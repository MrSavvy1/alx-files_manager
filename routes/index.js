const express = require('express');
const AppController = require('../controllers/AppController');
const router = express.Router();
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');

router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);
router.post('/users', UsersController.postNew);
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

module.exports = router;
