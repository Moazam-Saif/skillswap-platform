import { useState, useContext, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { signup, googleAuth } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { setAccessToken, setUserId } = useContext(AuthContext);
  const navigate = useNavigate();

  // Google Auth Functions
 // Update the handleGoogleResponse function

const handleGoogleResponse = async (response) => {
  try {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    console.log('Google response received:', response.credential ? 'Yes' : 'No');
    
    const result = await googleAuth(response.credential);
    console.log('Google auth result:', result);
    
    setAccessToken(result.accessToken);
    setUserId(result.userId);
    
    setSuccess('Google authentication successful! Redirecting...');
    
    setTimeout(() => {
      navigate(`/dashboard/${result.userId}`);
    }, 1000);
    
  } catch (err) {
    console.error('Google auth error:', err);
    setError(
      err.response?.data?.message || 
      'Google authentication failed. Please try again.'
    );
  } finally {
    setIsLoading(false);
  }
};

  const initializeGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signup-button"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
          text: 'signup_with',
          shape: 'rounded',
        }
      );
    }
  };

  // Load Google Sign-In script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

 // Update only the handleSignUp function in your existing component

const handleSignUp = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');
  setSuccess('');
  
  // Your existing validation
  if (password !== confirmPassword) {
    setError('Passwords do not match.');
    setIsLoading(false);
    return;
  }

  if (password.length < 6) {
    setError('Password must be at least 6 characters long.');
    setIsLoading(false);
    return;
  }
  
  try {
    const response = await signup({ name, email, password });
    setIsLoading(false);
    
    // UPDATED: Handle verification response
    if (response.requiresVerification) {
      setSuccess('Account created! Please check your email and click the verification link to complete registration.');
      
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      // Don't redirect - let user know to check email
    } else {
      // Fallback for existing flow
      setSuccess('Account created successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
    
  } catch (err) {
    setError(err.response?.data?.message || 'Sign up failed. Please try again.');
    console.error('Sign up error:', err);
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div
          className="rounded-2xl shadow-2xl shadow-black/30 p-8"
          style={{
            backgroundColor: 'rgba(231, 111, 81, 0.9)',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.05)'
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#264653] mb-2">Create Account</h1>
            <p className="text-[#264653]">Join us today and get started</p>
          </div>

          {/* Google Sign Up Button */}
          <div className="mb-6">
            <div id="google-signup-button" className="w-full flex justify-center"></div>
          </div>

          {/* Divider */}
          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/70 font-medium">Or create account with email</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSignUp}>
            {/* Success Message */}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center">
                <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-[#264653] text-sm font-medium block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-100 rounded-lg px-11 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[#264653] text-sm font-medium block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-100 rounded-lg px-11 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-[#264653] text-sm font-medium block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-100 rounded-lg px-11 py-3 pr-11 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                  placeholder="Create a password"
                  required
                  minLength="6"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-[#264653]/70 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="text-[#264653] text-sm font-medium block">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full bg-stone-100 rounded-lg px-11 py-3 pr-11 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    confirmPassword === '' 
                      ? 'focus:ring-orange-400' 
                      : password === confirmPassword 
                        ? 'focus:ring-green-400 border-green-300' 
                        : 'focus:ring-red-400 border-red-300'
                  } focus:border-transparent`}
                  placeholder="Confirm your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword !== '' && (
                <p className={`text-xs mt-1 ${
                  password === confirmPassword 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#264653] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign in link */}
          <p className="text-center text-white/70 text-sm mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}