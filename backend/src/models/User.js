// models/User.ts
import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    companyId: {
        type: String,
        required: true
    },
    createdBy: {
      type: String,
      required: true
    },
  
  },
  {
    timestamps: true, 
  }
);

// Implement compound unique indexes for the user schema 
UserSchema.index({ companyId: 1, createdBy: 1 }, { unique: true });

const User = mongoose.model('User', UserSchema);
export default User;
