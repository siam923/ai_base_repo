// models/Chat.ts
import mongoose, { Schema } from 'mongoose';

const ChatSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // user identification:
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },

    projectId: {
      type: String,
      ref: 'Project',
    },
  },
  {
    timestamps: true, 
  }
);

ChatSchema.index({ userId: 1 });

const Chat = mongoose.model('Chat', ChatSchema);
export default Chat;
