// models/Message.js
import mongoose, {  Schema } from 'mongoose';
import { generateUUID } from '#src/utils/dbUtils.js';

const MessageSchema = new Schema(
  {
    id: {
      type: String,
      default: generateUUID,
      unique: true,
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
  }
);

MessageSchema.index({ chatId: 1 });

const Message = mongoose.model('Message', MessageSchema);
export default Message;
