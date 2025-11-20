import axios from 'axios';

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:80' : "/api"; 


const api = axios.create({
  baseURL: API_URL, 
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// AUTH
export const authAPI = {
  register: async (name, email, password) => {
    const r = await api.post('/auth/register', { name, email, password });
    return r.data;
  },

  login: async (email, password) => {
    const r = await api.post('/auth/login', { email, password });
    return r.data;
  },

  logout: async () => {
    const r = await api.post('/auth/logout');
    return r.data;
  },

  getMe: async () => {
    const r = await api.get('/auth/me');
    return r.data;
  },
};

// BOARDS
export const boardAPI = {
  getAll: async () => {
    const r = await api.get('/boards');
    return r.data;
  },

  getById: async (id) => {
    const r = await api.get(`/boards/${id}`);
    return r.data;
  },

  create: async (name) => {
    const r = await api.post('/boards', { name });
    return r.data;
  },

  invite: async (boardId, email) => {
    const r = await api.post(`/boards/${boardId}/invite`, { email });
    return r.data;
  },

  addCard: async (boardId, cardData) => {
    const r = await api.post(`/boards/${boardId}/cards`, cardData);
    return r.data;
  },

  updateCard: async (boardId, cardId, cardData) => {
    const r = await api.put(`/boards/${boardId}/cards/${cardId}`, cardData);
    return r.data;
  },

  getRecommendations: async (boardId, cardId) => {
    const r = await api.get(`/boards/${boardId}/cards/${cardId}/recommendations`);
    return r.data;
  },
};

export default api;
