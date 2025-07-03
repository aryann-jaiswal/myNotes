export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  folder?: string;
  userId: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface NotesResponse {
  notes: Note[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalNotes: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FoldersResponse {
  folders: string[];
}

export interface TagsResponse {
  tags: string[];
}

export interface CreateNoteData {
  title: string;
  content: string;
  tags?: string[];
  folder?: string;
  isPinned?: boolean;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  tags?: string[];
  folder?: string;
  isPinned?: boolean;
}

export interface SearchParams {
  query?: string;
  tags?: string[];
  folder?: string;
  page?: number;
  limit?: number;
} 