import React from 'react';
import { Note } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { Pin, Tag, Folder, Trash2, Edit } from 'lucide-react';
import { clsx } from 'clsx';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onPin: (noteId: string, isPinned: boolean) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onPin,
}) => {
  const truncatedContent = note.content.length > 150 
    ? `${note.content.substring(0, 150)}...` 
    : note.content;

  return (
    <div className={clsx(
      'bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow cursor-pointer',
      {
        'border-primary-200 bg-primary-50': note.isPinned,
        'border-gray-200': !note.isPinned
      }
    )}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 flex-1 mr-2">
          {note.title}
        </h3>
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPin(note._id, !note.isPinned);
            }}
            className={clsx(
              'p-1 rounded hover:bg-gray-100 transition-colors',
              {
                'text-primary-600': note.isPinned,
                'text-gray-400': !note.isPinned
              }
            )}
            title={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin size={16} className={clsx({ 'fill-current': note.isPinned })} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            title="Edit note"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note._id);
            }}
            className="p-1 rounded hover:bg-red-100 transition-colors text-gray-400 hover:text-red-600"
            title="Delete note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
        {truncatedContent}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-3">
          {note.folder && (
            <div className="flex items-center space-x-1">
              <Folder size={12} />
              <span>{note.folder}</span>
            </div>
          )}
          {note.tags.length > 0 && (
            <div className="flex items-center space-x-1">
              <Tag size={12} />
              <span>{note.tags.slice(0, 2).join(', ')}</span>
              {note.tags.length > 2 && (
                <span>+{note.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>
        <span>
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
};

export default NoteCard; 