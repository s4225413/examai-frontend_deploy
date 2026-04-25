import axios from 'axios';

const API_BASE = 'http://16.16.204.86/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('examai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401s globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('examai_token');
      localStorage.removeItem('examai_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Exams
export const examsAPI = {
  getAll: () => api.get('/exams'),
  getById: (id) => api.get(`/exams/${id}`),
  create: (data) => api.post('/exams', data),
  update: (id, data) => api.put(`/exams/${id}`, data),
  delete: (id) => api.delete(`/exams/${id}`),
};

// Questions
export const questionsAPI = {
  getAll: (params) => api.get('/questions', { params }),
  create: (data) => api.post('/questions', data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
  generate: (data) => api.post('/questions/generate', data),
};

// Submissions
export const submissionsAPI = {
  submit: (data) => api.post('/submissions', data),
  getByExam: (examId) => api.get(`/submissions/exam/${examId}`),
  getByStudent: (studentId) => api.get(`/submissions/student/${studentId}`),
  getById: (id) => api.get(`/submissions/${id}`),
};

// Proctoring
export const proctorAPI = {
  analyzeFrame: (data) => api.post('/proctor/analyze-frame', data),
  logEvent: (data) => api.post('/proctor/log-event', data),
  getLogs: (examId, studentId) => api.get(`/proctor/logs/${examId}/${studentId}`),
  getTrustScore: (examId, studentId) => api.get(`/proctor/trust-score/${examId}/${studentId}`),
};

// Admin
export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  updateRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getStats: () => api.get('/admin/stats'),
};

// Monitoring
export const monitoringAPI = {
  getLive: (examId) => api.get(`/monitoring/live/${examId}`),
  getAILogs: (params) => api.get('/monitoring/logs/ai', { params }),
  getSystemLogs: () => api.get('/monitoring/logs/system'),
};

// Chatbot (calls backend → OpenAI, API key never touches frontend)
export const chatbotAPI = {
  sendMessage: (message) => api.post('/chatbot/message', { message }),
};

export default api;
