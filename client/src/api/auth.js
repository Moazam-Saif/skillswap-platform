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

export const searchSkills = async (query) => {
  const res = await api.get('/skills/find', {
    params: { query }
  });
  return res.data;
};

export const getUser = async (userId, accessToken) => {
  const res = await api.get(`/users/profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};
export const updateUser = async (userId, data, accessToken) => {
  const res = await api.put(`/users/profile/${userId}`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const getAllUsers = async () => {
  const res = await api.get('/users/all');
  return res.data;
};

export const getSkillMatches = async (accessToken) => {
  const res = await api.get('/users/matches', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.data;
};

export const getPartialSkillMatches = async (accessToken) => {
  const res = await api.get('/users/partial-matches', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.data;
};

export const getCategorySkillMatches = async (accessToken) => {
  const res = await api.get('/users/category-matches', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.data;
};

export const sendSwapRequest = async (data, accessToken) => {
  const res = await api.post('/users/swap-request', data, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.data;
};