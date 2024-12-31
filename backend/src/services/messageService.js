// services/messageService.js
import Message from '#src/models/Message.js';
import { sanitizeResponseMessages } from '#src/utils/ai/aiUtils.js';
import { generateUUID } from '#src/utils/dbUtils.js';

/**
 * Create a new message
 * @param {Object} messageData - { chatId, role, content }
 * @returns {Promise<Message>}
 */
const createMessage = async ({ id, chatId, role, content }) => {
  try {
    const message = new Message({ _id:id, chatId, role, content });
    return await message.save();
  } catch (error) {
    console.error('Failed to create message:', error);
    throw error;
  }
};

const createMultipleMessages = async ({ messages }) => {
  try {
    const createdMessages = await Message.insertMany(messages, { ordered: true });
    return createdMessages; // Mongoose ensures documents are inserted in order
  } catch (error) {
    console.error('Failed to create multiple messages:', error);
    throw error;
  }
};

/**
 * Get message by ID
 * @param {String} id
 * @returns {Promise<Message|null>}
 */
const getMessageById = async (id) => {
  try {
    return await Message.findById(id).exec();
  } catch (error) {
    console.error('Failed to get message by ID:', error);
    throw error;
  }
};

/**
 * Get all messages for a chat
 * @param {String} chatId
 * @returns {Promise<Array<Message>>}
 */
const getMessagesByChatId = async (chatId) => {
  try {
    return await Message.find({ chatId }).sort({ createdAt: 1 }).exec();
  } catch (error) {
    console.error('Failed to get messages by chat ID:', error);
    throw error;
  }
};

/**
 * Update a message by ID
 * @param {String} id
 * @param {Object} updateData
 * @returns {Promise<Message|null>}
 */
const updateMessageById = async (id, updateData) => {
  try {
    return await Message.findByIdAndUpdate(id, updateData, { new: true }).exec();
  } catch (error) {
    console.error('Failed to update message:', error);
    throw error;
  }
};

/**
 * Delete a message by ID
 * @param {String} id
 * @returns {Promise<Message|null>}
 */
const deleteMessageById = async (id) => {
  try {
    return await Message.findByIdAndDelete(id).exec();
  } catch (error) {
    console.error('Failed to delete message:', error);
    throw error;
  }
};

/**
 * Delete messages by chat ID after a certain timestamp
 * @param {String} chatId
 * @param {Date} timestamp
 * @returns {Promise<Object>}
 */
const deleteMessagesByChatIdAfterTimestamp = async (chatId, timestamp) => {
  try {
    const result = await Message.deleteMany({
      chatId,
      createdAt: { $gte: timestamp },
    }).exec();
    return result;
  } catch (error) {
    console.error('Failed to delete messages by chat ID after timestamp:', error);
    throw error;
  }
};

// helper functions ===========================================================
const processAndSaveUserMessage = async (userMessage, chatId) => {
  const userMessageId = generateUUID();
  await createMessage({
    ...userMessage,
    id: userMessageId,
    chatId,
  });
  return userMessageId;
};

const saveResponseMessages = async (responseMessages, chatId, dataStream) => {
  const sanitizedMessages = sanitizeResponseMessages(responseMessages);
  const messagesToSave = sanitizedMessages.map((message) => {
    const messageId = generateUUID();
    if (message.role === 'assistant') {
      dataStream.writeMessageAnnotation({
        messageIdFromServer: messageId,
      });
    }
    return {
      id: messageId,
      chatId,
      role: message.role,
      content: message.content,
    };
  });
  await createMultipleMessages({ messages: messagesToSave });
};

export {
  createMessage,
  createMultipleMessages,
  getMessageById,
  getMessagesByChatId,
  updateMessageById,
  deleteMessageById,
  deleteMessagesByChatIdAfterTimestamp,
  processAndSaveUserMessage,
  saveResponseMessages,
};