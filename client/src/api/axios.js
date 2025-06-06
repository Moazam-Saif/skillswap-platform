import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust to your backend
  withCredentials: true, // Send HTTP-only cookie (refreshToken)
});

export default api;
