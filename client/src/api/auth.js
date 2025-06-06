import api from './axios';

export const login = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const signup = async (data) => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

export const refreshToken = async () => {
  const res = await api.post('/auth/refresh-token');
  return res.data;
};

export const logout = async () => {
  await api.post('/auth/logout');
};
