import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { googleAuth } from '../api/auth';

export default function GoogleAuthButton({ mode = 'signin' }) {
  const { setAccessToken, setUserId } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoogleResponse = async (response) => {
    try {
      const { accessToken, userId } = await googleAuth(response.credential);
      setAccessToken(accessToken);
      setUserId(userId);
      navigate(`/dashboard/${userId}`);
    } catch (err) {
      console.error('Google auth error:', err);
      alert('Google authentication failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    console.error('Google Sign-In was unsuccessful');
    alert('Google authentication was unsuccessful. Please try again.');
  };

  const initializeGoogleSignIn = () => {
    // Use Vite's import.meta.env instead of process.env
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      console.error('Google Client ID not found. Please check your .env file.');
      return;
    }

    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
          text: mode === 'signup' ? 'signup_with' : 'signin_with',
          shape: 'rounded',
        }
      );
    }
  };

  // Initialize when component mounts
  useEffect(() => {
    // Check if script already exists to prevent duplicates
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    
    if (existingScript) {
      // Script already loaded, just initialize
      if (window.google) {
        initializeGoogleSignIn();
      } else {
        // Script loaded but Google not ready yet
        existingScript.onload = initializeGoogleSignIn;
      }
      return;
    }

    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    script.onerror = () => {
      console.error('Failed to load Google Sign-In script');
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup - safer cleanup
      const scriptToRemove = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (scriptToRemove) {
        try {
          document.body.removeChild(scriptToRemove);
        } catch (e) {
          // Script might already be removed
          console.warn('Script cleanup failed:', e);
        }
      }
    };
  }, []);

  return (
    <div id="google-signin-button" className="w-full"></div>
  );
}