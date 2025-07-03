import { Request, Response } from 'express';
import Note from '../models/Note';
import { AuthRequest } from '../types';

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, tags, folder, isPinned } = req.body;
    const userId = req.user!.id;

    const note = new Note({
      title,
      content,
      tags: tags || [],
      folder,
      isPinned: isPinned || false,
      userId
    });

    await note.save();

    res.status(201).json({
      message: 'Note created successfully',
      note
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 10, folder, tags, isPinned } = req.query;

    const query: any = { userId };

    if (folder) query.folder = folder;
    if (tags) query.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    if (isPinned !== undefined) query.isPinned = isPinned === 'true';

    const notes = await Note.find(query)
      .sort({ isPinned: -1, updatedAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Note.countDocuments(query);

    res.json({
      notes,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalNotes: total,
        hasNext: Number(page) * Number(limit) < total,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getNoteById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const note = await Note.findOne({ _id: id, userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    return res.json({ note });
  } catch (error) {
    console.error('Get note by id error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const updateData = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    return res.json({
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    console.error('Update note error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const note = await Note.findOneAndDelete({ _id: id, userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    return res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const searchNotes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { query, page = 1, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchQuery = {
      userId,
      $text: { $search: query as string }
    };

    const notes = await Note.find(searchQuery)
      .sort({ score: { $meta: 'textScore' }, updatedAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Note.countDocuments(searchQuery);

    return res.json({
      notes,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalNotes: total,
        hasNext: Number(page) * Number(limit) < total,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Search notes error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getFolders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const folders = await Note.distinct('folder', { 
      userId, 
      folder: { $exists: true, $ne: null } 
    });

    res.json({ folders });
  } catch (error) {
    console.error('Get folders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTags = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const tags = await Note.distinct('tags', { userId });

    res.json({ tags });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 