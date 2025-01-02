// models/Document.ts
import mongoose, { Schema } from 'mongoose';

const DocumentSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
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
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: false, // Disable Mongoose's default timestamps
  }
);

// Compound index to ensure uniqueness of (id, createdAt)
DocumentSchema.index({ id: 1, createdAt: 1 }, { unique: true });

const DocumentModel = mongoose.model('Document', DocumentSchema);
export default DocumentModel;
