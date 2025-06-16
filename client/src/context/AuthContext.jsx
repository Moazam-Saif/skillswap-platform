// AuthContext.jsx
import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const res = await axios.post(
          'http://localhost:5000/api/auth/refresh-token',
          {},
          { withCredentials: true }
        );
        setAccessToken(res.data.accessToken);
        setUserId(res.data.userId);
      } catch (err) {
        setAccessToken(null); // Don't redirect!
        setUserId(null);
      } finally {
        setLoading(false);
      }
    };

    tryRefresh();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken,userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};
