import { Request } from 'express';

export interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  folder?: string;
  userId: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tags?: string[];
  folder?: string;
  isPinned?: boolean;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  tags?: string[];
  folder?: string;
  isPinned?: boolean;
}

export interface SearchNotesRequest {
  query?: string;
  tags?: string[];
  folder?: string;
  page?: number;
  limit?: number;
} 