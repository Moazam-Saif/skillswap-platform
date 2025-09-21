import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../api/auth';

export default function TestUserLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAccessToken, setUserId } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleTestLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Get test user credentials from environment variables
      const testEmail = import.meta.env.VITE_TEST_USER_EMAIL;
      const testPassword = import.meta.env.VITE_TEST_USER_PASSWORD;

      if (!testEmail || !testPassword) {
        throw new Error('Test user credentials not configured');
      }

      const { accessToken, userId } = await login({
        email: testEmail,
        password: testPassword
      });

      setAccessToken(accessToken);
      setUserId(userId);
      navigate(`/dashboard/${userId}`);
    } catch (err) {
      setError('Failed to login with test user. Please try again.');
      console.error('Test login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <button
        onClick={handleTestLogin}
        disabled={isLoading}
        className="w-full bg-[#264653] text-white font-semibold py-4 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#264653] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
            Logging in as Test User...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span className="mr-2">🚀</span>
            Login as Test User
          </div>
        )}
      </button>
      
      <p className="text-sm text-gray-500">
        This will log you in with pre-configured test data to explore all features.
      </p>
    </div>
  );
}