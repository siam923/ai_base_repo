// utils/deleteChat.ts
import mongoose from 'mongoose';

import Chat from '#src/models/Chat.js';
import Document from '#src/models/Document.js';
import Message from '#src/models/Message.js';
import Suggestion from '#src/models/Suggestion.js';

export async function deleteChat(chatId) {
  // Start a MongoDB session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Delete the chat
    const deletedChat = await Chat.deleteOne({ _id: chatId }).session(session);

    if (!deletedChat.deletedCount) {
      throw new Error('Chat not found');
    }

    // Delete all related documents
    await Document.deleteMany({ chatId }).session(session);

    // Delete all related messages
    await Message.deleteMany({ chatId }).session(session);

    // Delete all related suggestions
    await Suggestion.deleteMany({ chatId }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    return true;

  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    throw error;
  } finally {
    // End the session
    session.endSession();
  }
}