// controllers/historyController.js
import Chat from '#src/models/Chat.js';
import { deleteMessagesByChatIdAfterTimestamp, getMessagesByChatId } from '#src/services/messageService.js';
import { deleteChatById, getChatById, getChatsByUserId } from '../services/chatService.js';

/**
 * GET /api/history
 * Fetches all chats associated with the authenticated user.
 */
export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id; 
    const chats = await getChatsByUserId(userId);
    if (!chats) {
      return res.status(404).json({ message: 'No chats found' });
    }
    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteChat = async (req, res) => {
  try {
    // Extract chat ID from query parameters
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Chat ID is required' });
    }

    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user.id.toString();

    // Fetch the chat by ID
    const chat = await getChatById(id);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if the chat belongs to the authenticated user
    if (chat.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden: You cannot delete this chat' });
    }
    // Delete the chat
    await deleteChatById(id);

    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getChatByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await getChatById(id);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    return res.status(200).json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
}


export const getMessagesByChatIdHandler = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await getMessagesByChatId(chatId);
    if (!messages) {
      return res.status(404).json({ message: 'No messages found' });
    }
    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const deleteMessageAfterTimestampHandler = async (req, res) => {
  try {

    const { chatId, timestamp } = req.body;
    const res = await deleteMessagesByChatIdAfterTimestamp(chatId, timestamp);
    if (!res) {
      return res.status(404).json({ message: 'No messages found' });
    }
    return res.status(200).json({"message":'Messages deleted successfully'});
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

