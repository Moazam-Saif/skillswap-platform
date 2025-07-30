import api from './axios';

export const login = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const verifyEmail = async (token) => {
  try {
    const response = await axios.get(`/auth/verify-email?token=${token}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (data) => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

export const googleAuth = async (credential) => {
  const res = await api.post('/auth/google', { credential });
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

export const getUserRequests = async (accessToken) => {
  const res = await api.get(`/users/swap-requests`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.data;
};

export const getUserSessions = async (accessToken) => {
  const res = await api.get('/users/sessions', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.data;
};

export const createSession = async (data, accessToken) => {
  const res = await api.post('/users/create-session', data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
};

// ...existing code...

export const searchUsersBySkill = async (skillName) => {
  const res = await api.get(`/search/skill/${encodeURIComponent(skillName)}`);
  return res.data;
};

export const searchUsersByCategory = async (category) => {
  const res = await api.get(`/search/category/${encodeURIComponent(category)}`);
  return res.data;
};

export const searchUsersByName = async (name) => {
  const res = await api.get(`/search/name/${encodeURIComponent(name)}`);
  return res.data;
};

// ...existing code...

export const getUserById = async (userId, accessToken) => {
 const res = await api.get(`/users/profile/show/${userId}`,{
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
};

export const getUserImage = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/image`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user image:', error);
    throw error;
  }
};