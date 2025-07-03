import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { notesAPI } from '../services/api';
import { Note, SearchParams } from '../types';
import NoteCard from '../components/NoteCard';
import Button from '../components/Button';
import Input from '../components/Input';
import { 
  Plus, 
  Search, 
  Filter, 
  LogOut, 
  User,
  Folder,
  Tag,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import NoteModal from '../components/NoteModal';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [folders, setFolders] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalNotes: 0,
    hasNext: false,
    hasPrev: false,
  });

  useEffect(() => {
    fetchNotes();
    fetchFolders();
    fetchTags();
  }, [selectedFolder, selectedTags, pagination.currentPage]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const params: SearchParams = {
        page: pagination.currentPage,
        limit: 12,
      };

      if (selectedFolder) params.folder = selectedFolder;
      if (selectedTags.length > 0) params.tags = selectedTags;

      const response = await notesAPI.getNotes(params);
      setNotes(response.notes);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await notesAPI.getFolders();
      setFolders(response.folders);
    } catch (error) {
      console.error('Failed to fetch folders:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await notesAPI.getTags();
      setTags(response.tags);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchNotes();
      return;
    }

    try {
      setLoading(true);
      const response = await notesAPI.searchNotes(searchQuery, 1, 12);
      setNotes(response.notes);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setShowNoteModal(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowNoteModal(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await notesAPI.deleteNote(noteId);
      toast.success('Note deleted successfully');
      fetchNotes();
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const handlePinNote = async (noteId: string, isPinned: boolean) => {
    try {
      await notesAPI.updateNote(noteId, { isPinned });
      toast.success(isPinned ? 'Note pinned' : 'Note unpinned');
      fetchNotes();
    } catch (error) {
      toast.error('Failed to update note');
    }
  };

  const handleNoteSaved = () => {
    setShowNoteModal(false);
    fetchNotes();
    fetchFolders();
    fetchTags();
  };

  const clearFilters = () => {
    setSelectedFolder('');
    setSelectedTags([]);
    setSearchQuery('');
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">MyNotes</h1>
              <div className="flex items-center space-x-2">
                <User size={20} className="text-gray-400" />
                <span className="text-sm text-gray-600">{user?.name}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={logout}
              className="flex items-center space-x-2"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Actions */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <Search size={20} />
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter size={16} />
                <span>Filters</span>
              </Button>
              <Button
                onClick={handleCreateNote}
                className="flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>New Note</span>
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                >
                  <X size={14} />
                  <span>Clear all</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Folder Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Folder size={14} className="inline mr-1" />
                    Folder
                  </label>
                  <select
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All folders</option>
                    {folders.map((folder) => (
                      <option key={folder} value={folder}>
                        {folder}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag size={14} className="inline mr-1" />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSelectedTags(prev =>
                            prev.includes(tag)
                              ? prev.filter(t => t !== tag)
                              : [...prev, tag]
                          );
                        }}
                        className={`px-2 py-1 text-xs rounded-full border ${
                          selectedTags.includes(tag)
                            ? 'bg-primary-100 text-primary-700 border-primary-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedFolder || selectedTags.length > 0
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first note'
              }
            </p>
            {!searchQuery && !selectedFolder && selectedTags.length === 0 && (
              <Button onClick={handleCreateNote}>
                <Plus size={16} className="mr-2" />
                Create your first note
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onPin={handlePinNote}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={!pagination.hasPrev}
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={!pagination.hasNext}
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <NoteModal
          note={editingNote}
          onClose={() => setShowNoteModal(false)}
          onSave={handleNoteSaved}
        />
      )}
    </div>
  );
};

export default Dashboard; 