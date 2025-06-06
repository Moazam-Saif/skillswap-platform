import React, { useState } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // ✅ Make sure this is at the top


export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 const { setAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ email, password });
      setAccessToken(accessToken);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
