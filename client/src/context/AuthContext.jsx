import React, { createContext, useContext, useState, useEffect } from 'react';
import { refreshToken } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-refresh token on page load
  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const { accessToken } = await refreshToken();
        setAccessToken(accessToken);
      } catch (err) {
        console.log('Refresh failed');
      } finally {
        setLoading(false);
      }
    };
    tryRefresh();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
