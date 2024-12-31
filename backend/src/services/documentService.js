// services/documentService.js
import Document from '../models/Document.js';

/**
 * Create a new document
 * @param {Object} docData - { title, content, kind, chatId }
 * @returns {Promise<Document>}
 */
export const createDocument = async ({ title, content, kind, chatId }) => {
  try {
    const document = new Document({ title, content, kind, chatId });
    return await document.save();
  } catch (error) {
    console.error('Failed to create document:', error);
    throw error;
  }
};

/**
 * Get document by ID
 * @param {String} id
 * @returns {Promise<Document|null>}
 */
export const getDocumentById = async (id) => {
  try {
    return await Document.findById(id).exec();
  } catch (error) {
    console.error('Failed to get document by ID:', error);
    throw error;
  }
};

/**
 * Get all documents for a chat
 * @param {String} chatId
 * @returns {Promise<Array<Document>>}
 */
export const getDocumentsByChatId = async (chatId) => {
  try {
    return await Document.find({ chatId }).sort({ createdAt: 1 }).exec();
  } catch (error) {
    console.error('Failed to get documents by chat ID:', error);
    throw error;
  }
};

/**
 * Update a document by ID
 * @param {String} id
 * @param {Object} updateData
 * @returns {Promise<Document|null>}
 */
export const updateDocumentById = async (id, updateData) => {
  try {
    return await Document.findByIdAndUpdate(id, updateData, { new: true }).exec();
  } catch (error) {
    console.error('Failed to update document:', error);
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
      _id: id,
      createdAt: { $gt: timestamp },
    }).exec();
    return result;
  } catch (error) {
    console.error('Failed to delete documents by ID after timestamp:', error);
    throw error;
  }
};
