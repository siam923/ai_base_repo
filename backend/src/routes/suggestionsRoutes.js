// routes/suggestionsRoutes.js
import express from 'express';
import { getSuggestions } from '#src/controllers/suggestionsController.js';
import authenticator  from '#src/middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticator);
// GET /api/suggestions?documentId=...
router.get('/suggestions', getSuggestions);

export default router;
