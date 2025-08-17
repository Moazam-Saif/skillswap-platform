import api from './axios';

export const login = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const verifyEmail = async (token) => {
  try {
    const response = await api.get(`/auth/verify-email?token=${token}`);
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

// ✅ UPDATED: Support both old approach (timeSlots) and new approach (selectedAvailabilityIds)
export const sendSwapRequest = async (data, accessToken) => {
  // ✅ APPROACH 2: Send availability slot IDs instead of converting times
  if (data.selectedAvailabilityIds) {
    console.log('🎯 Sending swap request with availability slot IDs:', data.selectedAvailabilityIds);
    
    const requestData = {
      toUserId: data.toUserId,
      offerSkill: data.offerSkill,
      wantSkill: data.wantSkill,
      days: data.days,
      selectedAvailabilityIds: data.selectedAvailabilityIds // ✅ Send slot IDs
      // ✅ No timezone needed - backend looks up UTC from availability
    };
    
    const res = await api.post('/users/swap-request', requestData, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return res.data;
  }
  
  // ✅ FALLBACK: Support old approach for backward compatibility
  else if (data.timeSlots) {
    console.log('🌐 Sending swap request with time slots (old approach):', data.timeSlots);
    
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const requestData = {
      ...data,
      timezone: data.timezone || userTimezone
    };
    
    const res = await api.post('/users/swap-request', requestData, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return res.data;
  }
  
  // ✅ ERROR: Neither approach provided
  else {
    throw new Error('Must provide either selectedAvailabilityIds or timeSlots');
  }
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

// ✅ NEW: API functions for meeting access
export const getMeetingAccess = async (sessionId, slotIndex, accessToken) => {
  const res = await api.get(`/users/meeting/${sessionId}/${slotIndex}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.data;
};

export const validateMeetingAccess = async (sessionId, slotIndex, accessToken) => {
  const res = await api.get(`/users/meeting/${sessionId}/${slotIndex}/validate`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.data;
};

// ...existing functions unchanged...

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

export const getUserById = async (userId, accessToken) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const res = await api.get(`/users/profile/show/${userId}?viewerTimezone=${userTimezone}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
};

export const setUserAvailability = async (availability, accessToken) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const res = await api.post('/users/availability', {
    availability,
    timezone: userTimezone 
  }, {
    headers: { Authorization: `Bearer ${accessToken}` }
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