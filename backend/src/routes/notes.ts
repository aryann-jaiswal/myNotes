import express from 'express';
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  searchNotes,
  getFolders,
  getTags
} from '../controllers/noteController';
import { auth } from '../middleware/auth';
import { validateRequest, createNoteSchema, updateNoteSchema } from '../middleware/validation';

const router = express.Router();

// All routes require authentication
router.use(auth);

// POST /api/notes
router.post('/', validateRequest(createNoteSchema), createNote);

// GET /api/notes
router.get('/', getNotes);

// GET /api/notes/search
router.get('/search', searchNotes);

// GET /api/notes/folders
router.get('/folders', getFolders);

// GET /api/notes/tags
router.get('/tags', getTags);

// GET /api/notes/:id
router.get('/:id', getNoteById);

// PUT /api/notes/:id
router.put('/:id', validateRequest(updateNoteSchema), updateNote);

// DELETE /api/notes/:id
router.delete('/:id', deleteNote);

export default router; 