// controllers/suggestionsController.js
import { getSuggestionsByDocumentId } from '../services/suggestionService.js';

/**
 * GET /api/suggestions?documentId=...
 * Fetches suggestions for a given document ID.
 */
export const getSuggestions = async (req, res) => {
  try {
    const { documentId } = req.query;

    if (!documentId) {
      return res.status(404).json({ message: 'Document ID not provided' });
    }

    const suggestions = await getSuggestionsByDocumentId({ documentId });

    if (suggestions.length === 0) {
      return res.status(200).json([]);
    }

    // Authorization: Ensure the user owns the suggestions
    const userId = req.user._id.toString();
    const isAuthorized = suggestions.every(suggestion => suggestion.chatId.toString() === userId);

    if (!isAuthorized) {
      return res.status(401).json({ message: 'Unauthorized: Access denied' });
    }

    res.status(200).json(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
