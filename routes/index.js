import express from 'express';
import { getStatus, getStats } from '../controllers/AppController.js';
import { getConnect, getDisconnect } from '../controllers/AuthController.js';
import { getMe, postNew } from '../controllers/UsersController.js';

const router = express.Router();

router.get('/connect', getConnect);
router.get('/disconnect', getDisconnect);
router.get('/users/me', getMe);
router.post('/users', postNew);
router.get('/status', getStatus);
router.get('/stats', getStats);

export default router;
