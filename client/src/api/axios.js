import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api` || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ...existing interceptors and exports...
export default api;
