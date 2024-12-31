// services/chatService.js
import Chat from '#src/models/Chat.js';
import { generateTitleFromUserMessage } from './aiService.js';

/**
 * Create a new chat
 * @param {Object} chatData - { title, userId }
 * @returns {Promise<Chat>}
 */
const createChat = async ({ id, title, userId, projectId }) => {
  try {
    const chat = new Chat({ id, title, userId, projectId });
    return await chat.save();
  } catch (error) {
    console.error('Failed to create chat:', error);
    throw error;
  }
};

const getOrCreateChat = async (chatId, userId, userMessage, projectId='') => {
  let chat = await getChatById(chatId);
  if (!chat) {
    const title = await generateTitleFromUserMessage({ message: userMessage });
    chat = await createChat({ userId, title, projectId });
  }
  return chat;
};


/**
 * Get chat by ID
 * @param {String} id
 * @returns {Promise<Chat|null>}
 */
const getChatById = async (id) => {
  try {
    if (!id) return null;
    return await Chat.findOne({ id }).exec();
  } catch (error) {
    console.error('Failed to get chat by ID:', error);
    throw error;
  }
};

/**
 * Get all chats for a user
 * @param {String} userId
 * @returns {Promise<Array<Chat>>}
 */
const getChatsByUserId = async (userId) => {
  try {
    return await Chat.find({ userId }).sort({ createdAt: -1 }).exec();
  } catch (error) {
    console.error('Failed to get chats by user ID:', error);
    throw error;
  }
};

/**
 * Update a chat by ID
 * @param {String} id
 * @param {Object} updateData
 * @returns {Promise<Chat|null>}
 */
const updateChatById = async (id, updateData) => {
  try {
    return await Chat.findByIdAndUpdate(id, updateData, { new: true }).exec();
  } catch (error) {
    console.error('Failed to update chat:', error);
    throw error;
  }
};

/**
 * Delete a chat by ID
 * @param {String} id
 * @returns {Promise<Chat|null>}
 */
const deleteChatById = async (id) => {
  try {
    return await Chat.findOneAndDelete({ id: id });
  } catch (error) {
    console.error('Failed to delete chat:', error);
    throw error;
  }
};



export {
  createChat,
  getOrCreateChat,
  getChatById,
  getChatsByUserId,
  updateChatById,
  deleteChatById,
}