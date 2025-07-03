import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
    return;
  }
};

export const generateToken = (userId: string, email: string): string => {
  return jwt.sign(
    { id: userId, email },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
  );
}; 