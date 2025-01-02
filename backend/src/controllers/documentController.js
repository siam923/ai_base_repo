// controllers/documentController.js
import {
    getDocumentById,
    deleteDocumentsByIdAfterTimestamp,
    saveDocument,
    getDocumentsById,
  } from '#src/services/documentService.js';
  
  /**
   * GET /api/document?id=...
   * Fetches documents by ID.
   */
  export const getDocument = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ message: 'Missing document ID' });
      }
  
      const document = await getDocumentById(id); // Retrieves the latest version of the document
  
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }
  
      res.status(200).json(document);
    } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  export const getDocuments = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ message: 'Missing document ID' });
      }
  
      const documents = await getDocumentsById(id); // Fetches all versions
  
      if (documents.length === 0) {
        return res.status(404).json({ message: 'No documents found' });
      }
  
  
      res.status(200).json(documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

  export const saveDocumentHandler = async (req, res) => {
    try {
      const { id } = request.query
      const {  title, content, kind, chatId } = req.body;
  
      // Validate input fields
      if (!id || !title || !kind || !chatId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // Save the new version of the document
      const newDocument = await saveDocument({
        id,
        title,
        content,
        kind,
        chatId,
      });
  
      res.status(201).json(newDocument);
    } catch (error) {
      if (error.code === 11000) {
        // Handle unique constraint error gracefully
        return res.status(400).json({ message: 'Duplicate document version detected' });
      }
  
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
  