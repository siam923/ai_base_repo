// controllers/documentController.js
import {
    getDocumentById,
    createDocument,
    deleteDocumentsByIdAfterTimestamp,
  } from '#src/services/documentService.js';
  
  /**
   * GET /api/document?id=...
   * Fetches documents by ID.
   */
  export const getDocument = async (req, res) => {
    try {
      const { id } = req.query;
  
      if (!id) {
        return res.status(400).json({ message: 'Missing document ID' });
      }
  
      const documents = await getDocumentById({ id });
  
      if (documents.length === 0) {
        return res.status(404).json({ message: 'Document not found' });
      }
  
      const document = documents[0];
  
      // Authorization: Ensure the user owns the document
      if (document.chatId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Unauthorized: Access denied' });
      }
  
      res.status(200).json(documents);
    } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  /**
   * POST /api/document?id=...
   * Creates or updates a document.
   */
  export const createOrUpdateDocument = async (req, res) => {
    try {
      const { id } = req.query;
  
      if (!id) {
        return res.status(400).json({ message: 'Missing document ID' });
      }
  
      const { content, title, kind } = req.body;
  
      if (!content || !title || !kind) {
        return res.status(400).json({ message: 'Missing required fields: content, title, or kind' });
      }
  
      const document = await createDocument({
        id,
        content,
        title,
        kind,
        userId: req.user._id.toString(),
      });
  
      res.status(200).json(document);
    } catch (error) {
      console.error('Error saving document:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  /**
   * PATCH /api/document?id=...
   * Deletes documents by ID after a certain timestamp.
   */
  export const deleteDocumentsAfterTimestamp = async (req, res) => {
    try {
      const { id } = req.query;
      const { timestamp } = req.body;
  
      if (!id) {
        return res.status(400).json({ message: 'Missing document ID' });
      }
  
      if (!timestamp) {
        return res.status(400).json({ message: 'Missing timestamp' });
      }
  
      const documents = await getDocumentById({ id });
  
      if (documents.length === 0) {
        return res.status(404).json({ message: 'Document not found' });
      }
  
      const document = documents[0];
  
      // Authorization: Ensure the user owns the document
      if (document.chatId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Unauthorized: Access denied' });
      }
  
      await deleteDocumentsByIdAfterTimestamp({
        id,
        timestamp: new Date(timestamp),
      });
  
      res.status(200).json({ message: 'Documents deleted successfully' });
    } catch (error) {
      console.error('Error deleting documents:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  