// routes/documentRoutes.js
import express from 'express';
import {
  getDocuments,
  saveDocumentHandler,
  deleteDocumentsAfterTimestamp,
  getDocument,
} from '#src/controllers/documentController.js';
import authenticator from '#src/middlewares/authMiddleware.js';


const router = express.Router();


router.use(authenticator);
// GET /api/document/id=... 
// gets the latest doc of an id 
router.get('/:id', getDocument);

// GET /api/documents/id/all...
router.get('/:id/all', getDocuments);

// POST /api/document?id=...
router.post('/',  saveDocumentHandler);

// PATCH /api/document?id=...
router.patch('/', deleteDocumentsAfterTimestamp);

export default router;
