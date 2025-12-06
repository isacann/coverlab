import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the OAuth callback
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Redirect to Create page (main generator tool) after successful login
        navigate('/olustur', { replace: true });
      } else {
        // Redirect to login if no session
        navigate('/login', { replace: true });
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-white text-xl" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Giriş yapılıyor...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
