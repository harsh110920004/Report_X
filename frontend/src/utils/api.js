import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const reportAPI = {
  create: (data) => api.post('/reports', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  trackByTrackId: (trackId) => api.get(`/reports/track/${trackId}`),
  getMyReports: () => api.get('/reports/my-reports'),
};


export const adminAPI = {
  getReports: (filters) => api.get('/admin/reports', { params: filters }),
  getStatistics: () => api.get('/admin/statistics'),
  updateReport: (id, data) => api.put(`/admin/reports/${id}`, data),
  deleteReport: (id) => api.delete(`/admin/reports/${id}`),
};

export default api;
