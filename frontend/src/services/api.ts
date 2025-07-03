import axios from 'axios';
import { 
  AuthResponse, 
  NotesResponse, 
  Note, 
  CreateNoteData, 
  UpdateNoteData,
  FoldersResponse,
  TagsResponse,
  SearchParams
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Notes API
export const notesAPI = {
  getNotes: async (params?: SearchParams): Promise<NotesResponse> => {
    const response = await api.get('/notes', { params });
    return response.data;
  },

  getNote: async (id: string): Promise<{ note: Note }> => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  createNote: async (data: CreateNoteData): Promise<{ message: string; note: Note }> => {
    const response = await api.post('/notes', data);
    return response.data;
  },

  updateNote: async (id: string, data: UpdateNoteData): Promise<{ message: string; note: Note }> => {
    const response = await api.put(`/notes/${id}`, data);
    return response.data;
  },

  deleteNote: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },

  searchNotes: async (query: string, page = 1, limit = 10): Promise<NotesResponse> => {
    const response = await api.get('/notes/search', { 
      params: { query, page, limit } 
    });
    return response.data;
  },

  getFolders: async (): Promise<FoldersResponse> => {
    const response = await api.get('/notes/folders');
    return response.data;
  },

  getTags: async (): Promise<TagsResponse> => {
    const response = await api.get('/notes/tags');
    return response.data;
  },
};

export default api; 