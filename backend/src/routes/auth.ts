import express from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { auth } from '../middleware/auth';
import { validateRequest, registerSchema, loginSchema } from '../middleware/validation';

const router = express.Router();

// POST /api/auth/register
router.post('/register', validateRequest(registerSchema), register);

// POST /api/auth/login
router.post('/login', validateRequest(loginSchema), login);

// GET /api/auth/profile
router.get('/profile', auth, getProfile);

export default router; 