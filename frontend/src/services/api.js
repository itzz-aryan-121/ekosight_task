import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  register: async (name, email, password) => {
    const response = await api.post('/api/auth/register', { name, email, password });
    return response.data;
  },
  
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

export const boardAPI = {
  getAll: async () => {
    const response = await api.get('/api/boards');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/api/boards/${id}`);
    return response.data;
  },
  
  create: async (name) => {
    const response = await api.post('/api/boards', { name });
    return response.data;
  },
  
  invite: async (boardId, email) => {
    const response = await api.post(`/api/boards/${boardId}/invite`, { email });
    return response.data;
  },
  
  addCard: async (boardId, cardData) => {
    const response = await api.post(`/api/boards/${boardId}/cards`, cardData);
    return response.data;
  },
  
  updateCard: async (boardId, cardId, cardData) => {
    const response = await api.put(`/api/boards/${boardId}/cards/${cardId}`, cardData);
    return response.data;
  },
  
  getRecommendations: async (boardId, cardId) => {
    const response = await api.get(`/api/boards/${boardId}/cards/${cardId}/recommendations`);
    return response.data;
  },
};

export default api;

