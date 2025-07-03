import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  tags: string[];
  folder?: string;
  userId: mongoose.Types.ObjectId;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [10000, 'Content cannot be more than 10000 characters']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [20, 'Tag cannot be more than 20 characters']
  }],
  folder: {
    type: String,
    trim: true,
    maxlength: [50, 'Folder name cannot be more than 50 characters']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPinned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create text index for search functionality
noteSchema.index({
  title: 'text',
  content: 'text',
  tags: 'text'
});

// Create compound index for user and pinned status
noteSchema.index({ userId: 1, isPinned: -1, updatedAt: -1 });

// Create index for user and folder
noteSchema.index({ userId: 1, folder: 1 });

// Create index for user and tags
noteSchema.index({ userId: 1, tags: 1 });

export default mongoose.model<INote>('Note', noteSchema); 