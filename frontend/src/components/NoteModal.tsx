import React, { useState, useEffect } from 'react';
import { Note, CreateNoteData, UpdateNoteData } from '../types';
import { notesAPI } from '../services/api';
import Button from './Button';
import Input from './Input';
import Textarea from './Textarea';
import { X, Pin, Tag, Folder } from 'lucide-react';
import toast from 'react-hot-toast';

interface NoteModalProps {
  note?: Note | null;
  onClose: () => void;
  onSave: () => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ note, onClose, onSave }) => {
  const [formData, setFormData] = useState<CreateNoteData>({
    title: '',
    content: '',
    tags: [],
    folder: '',
    isPinned: false,
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!note;

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        tags: note.tags,
        folder: note.folder || '',
        isPinned: note.isPinned,
      });
    }
  }, [note]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isEditing) {
        await notesAPI.updateNote(note._id, formData as UpdateNoteData);
        toast.success('Note updated successfully');
      } else {
        await notesAPI.createNote(formData);
        toast.success('Note created successfully');
      }
      onSave();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save note';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags?.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...(prev.tags || []), newTag]
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleTogglePin = () => {
    setFormData(prev => ({ ...prev, isPinned: !prev.isPinned }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="Enter note title..."
            required
          />

          {/* Content */}
          <Textarea
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            error={errors.content}
            placeholder="Write your note content..."
            rows={8}
            required
          />

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag size={14} className="inline mr-1" />
              Tags
            </label>
            <Input
              value={tagInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
              onKeyPress={handleAddTag}
              placeholder="Type a tag and press Enter..."
            />
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-700"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-primary-500 hover:text-primary-700"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Folder */}
          <Input
            label="Folder"
            name="folder"
            value={formData.folder}
            onChange={handleChange}
            placeholder="Enter folder name (optional)"
            icon={<Folder size={16} className="text-gray-400" />}
          />

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={handleTogglePin}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                  formData.isPinned
                    ? 'bg-primary-50 border-primary-200 text-primary-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Pin size={16} className={formData.isPinned ? 'fill-current' : ''} />
                <span className="text-sm font-medium">
                  {formData.isPinned ? 'Pinned' : 'Pin note'}
                </span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
              >
                {isEditing ? 'Update Note' : 'Create Note'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal; 