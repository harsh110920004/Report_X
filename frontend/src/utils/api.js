import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔐 AUTH APIs
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
};

// 📄 REPORT APIs
export const reportAPI = {
  create: (data) => api.post('/api/reports', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  trackByTrackId: (trackId) => api.get(`/api/reports/track/${trackId}`),
  getMyReports: () => api.get('/api/reports/my-reports'),
};

// 🧠 ADMIN APIs
export const adminAPI = {
  getReports: (filters) => api.get('/api/admin/reports', { params: filters }),
  getStatistics: () => api.get('/api/admin/statistics'),
  updateReport: (id, data) => api.put(`/api/admin/reports/${id}`, data),
  deleteReport: (id) => api.delete(`/api/admin/reports/${id}`),
};

export default api;