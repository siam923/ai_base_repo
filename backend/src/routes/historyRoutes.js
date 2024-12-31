// routes/historyRoutes.js
import express from 'express';
import { deleteChat, deleteMessageAfterTimestampHandler, getChatByIdHandler, getHistory, getMessagesByChatIdHandler } from '#src/controllers/historyController.js';
import authenticator from '#src/middlewares/authMiddleware.js';
import { getChatById } from '#src/services/chatService.js';

const router = express.Router();

router.use(authenticator);
// GET /api/history
router.get('/',  getHistory);
router.get('/:id', getChatByIdHandler);
router.delete('/', deleteChat);

// messages per chat 
router.get('/messages/:chatId', getMessagesByChatIdHandler);
router.delete('/message', deleteMessageAfterTimestampHandler);

export default router;
