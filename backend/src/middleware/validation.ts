import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: 'Validation failed',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
        return;
      }
      next(error);
    }
  };
};

// Validation schemas
export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const createNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  content: z.string().min(1, 'Content is required').max(10000, 'Content too long'),
  tags: z.array(z.string().max(20)).optional(),
  folder: z.string().max(50).optional(),
  isPinned: z.boolean().optional()
});

export const updateNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long').optional(),
  content: z.string().min(1, 'Content is required').max(10000, 'Content too long').optional(),
  tags: z.array(z.string().max(20)).optional(),
  folder: z.string().max(50).optional(),
  isPinned: z.boolean().optional()
}); 