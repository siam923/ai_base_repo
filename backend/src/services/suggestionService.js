// services/suggestionService.js
import Suggestion from '../models/Suggestion.js';

/**
 * Create a new suggestion
 * @param {Object} suggestionData - { documentId, originalText, suggestedText, description, chatId }
 * @returns {Promise<Suggestion>}
 */
export const createSuggestion = async ({
  documentId,
  originalText,
  suggestedText,
  description = '',
  chatId,
}) => {
  try {
    const suggestion = new Suggestion({
      documentId,
      originalText,
      suggestedText,
      description,
      chatId,
    });
    return await suggestion.save();
  } catch (error) {
    console.error('Failed to create suggestion:', error);
    throw error;
  }
};

/**
 * Get suggestion by ID
 * @param {String} id
 * @returns {Promise<Suggestion|null>}
 */
export const getSuggestionById = async (id) => {
  try {
    return await Suggestion.findById(id).exec();
  } catch (error) {
    console.error('Failed to get suggestion by ID:', error);
    throw error;
  }
};

/**
 * Get all suggestions for a document
 * @param {String} documentId
 * @returns {Promise<Array<Suggestion>>}
 */
export const getSuggestionsByDocumentId = async (documentId) => {
  try {
    return await Suggestion.find({ documentId }).exec();
  } catch (error) {
    console.error('Failed to get suggestions by document ID:', error);
    throw error;
  }
};

/**
 * Update a suggestion by ID
 * @param {String} id
 * @param {Object} updateData
 * @returns {Promise<Suggestion|null>}
 */
export const updateSuggestionById = async (id, updateData) => {
  try {
    return await Suggestion.findByIdAndUpdate(id, updateData, { new: true }).exec();
  } catch (error) {
    console.error('Failed to update suggestion:', error);
    throw error;
  }
};

/**
 * Delete a suggestion by ID
 * @param {String} id
 * @returns {Promise<Suggestion|null>}
 */
export const deleteSuggestionById = async (id) => {
  try {
    return await Suggestion.findByIdAndDelete(id).exec();
  } catch (error) {
    console.error('Failed to delete suggestion:', error);
    throw error;
  }
};

/**
 * Delete suggestions by document ID after a certain timestamp
 * @param {String} documentId
 * @param {Date} timestamp
 * @returns {Promise<Object>}
 */
export const deleteSuggestionsByDocumentIdAfterTimestamp = async (documentId, timestamp) => {
  try {
    const result = await Suggestion.deleteMany({
      documentId,
      createdAt: { $gt: timestamp },
    }).exec();
    return result;
  } catch (error) {
    console.error('Failed to delete suggestions by document ID after timestamp:', error);
    throw error;
  }
};
