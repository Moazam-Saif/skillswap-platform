import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../api/auth';

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    const handleVerification = async () => {
      try {
        const response = await verifyEmail(token);
        setStatus('success');
        setMessage(response.message);
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed.');
      }
    };

    handleVerification();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4" style={{fontFamily: "'Josefin Sans', sans-serif"}}>
      <div className="w-full max-w-md">
        <div 
          className="rounded-2xl shadow-2xl shadow-black/30 p-8 text-center"
          style={{
            backgroundColor: 'rgba(231, 111, 81, 0.9)',
            backdropFilter: 'blur(4px)'
          }}
        >
          {status === 'verifying' && (
            <>
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-[#264653] mb-2">Verifying Email...</h2>
              <p className="text-white/80">Please wait while we verify your email address.</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#264653] mb-2">Email Verified!</h2>
              <p className="text-white/80 mb-4">{message}</p>
              <p className="text-sm text-white/60">Redirecting to login page...</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#264653] mb-2">Verification Failed</h2>
              <p className="text-white/80 mb-6">{message}</p>
              <button 
                onClick={() => navigate('/signup')} 
                className="bg-[#264653] text-white px-6 py-2 rounded-lg hover:bg-[#1a4d4a] transition-colors"
              >
                Back to Signup
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}