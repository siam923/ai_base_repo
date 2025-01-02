// services/documentService.js
import Document from '../models/Document.js';

/**
 * Save a new version of the document or replace it
 * @param {Object} docData - { id, title, content, kind, chatId }
 * @returns {Promise<Document>}
 */
export const saveDocument = async ({ id, title, content, kind, chatId }) => {
  try {
    // Create a new version with a unique `createdAt` timestamp
    const document = new Document({
      id,
      title,
      content,
      kind,
      chatId,
      createdAt: new Date(),
    });
    return await document.save();
  } catch (error) {
    if (error.code === 11000) {
      console.error('Duplicate key error: id and createdAt must be unique.');
    }
    console.error('Failed to save document:', error);
    throw error;
  }
};

/**
 * Get all versions of a document by ID
 * @param {String} id
 * @returns {Promise<Document[]>}
 */
export const getDocumentsById = async (id) => {
  try {
    return await Document.find({ id }).sort({ createdAt: 1 });
  } catch (error) {
    console.error('Failed to get documents by ID:', error);
    throw error;
  }
};

/**
 * Get the latest version of a document by ID
 * @param {String} id
 * @returns {Promise<Document|null>}
 */
export const getDocumentById = async (id) => {
  try {
    return await Document.findOne({ id }).sort({ createdAt: -1 });
  } catch (error) {
    console.error('Failed to get the latest document by ID:', error);
    throw error;
  }
};



/**
 * Delete a document by ID
 * @param {String} id
 * @returns {Promise<Document|null>}
 */
export const deleteDocumentById = async (id) => {
  try {
    return await Document.findByIdAndDelete(id).exec();
  } catch (error) {
    console.error('Failed to delete document:', error);
    throw error;
  }
};

/**
 * Delete documents by ID after a certain timestamp
 * @param {String} id
 * @param {Date} timestamp
 * @returns {Promise<Object>}
 */
export const deleteDocumentsByIdAfterTimestamp = async (id, timestamp) => {
  try {
    const result = await Document.deleteMany({
      id: id,
      createdAt: { $gt: timestamp },
    }).exec();
    return result;
  } catch (error) {
    console.error('Failed to delete documents by ID after timestamp:', error);
    throw error;
  }
};
