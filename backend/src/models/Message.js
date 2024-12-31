// models/Message.js
import { v4 as uuidv4 } from 'uuid';
import mongoose, {  Schema } from 'mongoose';

const MessageSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    
    chatId: {
      type: String,
      ref: 'Chat',
      required: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: Schema.Types.Mixed, // Stores any JSON
      required: true,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

MessageSchema.index({ chatId: 1 });

const Message = mongoose.model('Message', MessageSchema);
export default Message;
