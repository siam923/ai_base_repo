// models/Suggestion.ts
import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';


const SuggestionSchema = new Schema(
  {
    documentId: {
      type: String,
      ref: 'Document',
      required: true,
    },
    originalText: {
      type: String,
      required: true,
      trim: true,
    },
    suggestedText: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    isResolved: {
      type: Boolean,
      required: true,
      default: false,
    },
    chatId: {
      type: String,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Suggestion = mongoose.model('Suggestion', SuggestionSchema);
export default Suggestion;
