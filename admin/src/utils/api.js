import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://jobboard-gl6p.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// Job API endpoints
export const jobAPI = {
  // Extract job details from image
  extractDetails: (formData) => {
    return api.post('/jobs/extract', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Create new job
  createJob: (jobData) => api.post('/jobs', jobData),
  
  // Get all jobs (admin)
  getAllJobs: () => api.get('/jobs/admin/all'),
  
  // Update job
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  
  // Delete job
  deleteJob: (id) => api.delete(`/jobs/${id}`),
};

export default api;