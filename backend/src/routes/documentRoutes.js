// routes/documentRoutes.js
import express from 'express';
import {
  getDocument,
  createOrUpdateDocument,
  deleteDocumentsAfterTimestamp,
} from '#src/controllers/documentController.js';
import authenticator from '#src/middlewares/authMiddleware.js';


const router = express.Router();


router.use(authenticator);
// GET /api/document?id=...
router.get('/document', getDocument);

// POST /api/document?id=...
router.post('/document',  createOrUpdateDocument);

// PATCH /api/document?id=...
router.patch('/document', deleteDocumentsAfterTimestamp);

export default router;
