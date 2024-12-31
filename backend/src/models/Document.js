// models/Document.ts
import mongoose, { Schema } from 'mongoose';


const DocumentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    kind: {
      type: String,
      enum: ['text', 'code'],
      required: true,
      default: 'text',
    },
    chatId: {
      type: String,
      ref: 'Chat',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


const DocumentModel = mongoose.model('Document', DocumentSchema);
export default DocumentModel;
