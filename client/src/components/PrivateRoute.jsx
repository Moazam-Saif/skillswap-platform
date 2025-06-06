// components/PrivateRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { accessToken } = useContext(AuthContext);

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return children;
}
