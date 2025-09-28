import axios from "axios";

const api = axios.create({
  baseURL: "https://jambostays-backend-v2.onrender.com/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to automatically include JWT token
api.interceptors.request.use(
  (config) => {
    // FIXED: Use 'access_token' to match what's stored in AuthPage
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
  
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear both token formats for cleanup
      localStorage.removeItem('access_token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optionally redirect to login
      window.location.href = '/auth';
    }
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;