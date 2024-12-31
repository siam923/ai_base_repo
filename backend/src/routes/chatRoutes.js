// routes/historyRoutes.js
import express from 'express';

import authenticator from '#src/middlewares/authMiddleware.js';
import { postChat } from '#src/controllers/chatController.js';
import { weatherChat } from '#src/controllers/weatherChat.js';

const router = express.Router();

router.use(authenticator);
// GET /api/history
router.post('/send', postChat);
router.post('/weather-ai', weatherChat)

export default router;
