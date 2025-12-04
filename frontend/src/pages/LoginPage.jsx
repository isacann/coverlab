import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { supabase } from '../utils/supabase';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setProfile } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging in with Google:', error);
      alert('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    try {
      setLoading(true);
      console.log('🔑 Admin backdoor login triggered...');

      // Mock admin user object
      const adminUser = {
        id: '6fbc8193-fd49-4b33-847f-93dd457c0886',
        email: 'admin@coverlab.dev',
        user_metadata: {
          full_name: 'Admin User',
          avatar_url: 'https://ui-avatars.com/api/?name=Admin&background=06b6d4&color=fff'
        }
      };

      // Mock admin profile
      const adminProfile = {
        id: '6fbc8193-fd49-4b33-847f-93dd457c0886',
        credits: 999,
        subscription_plan: 'pro'
      };

      console.log('✅ Setting admin user:', adminUser);
      console.log('✅ Setting admin profile:', adminProfile);

      // Manually set user and profile in AuthContext
      setUser(adminUser);
      setProfile(adminProfile);

      alert('🎉 Admin girişi başarılı!');
      navigate('/create');
    } catch (error) {
      console.error('❌ Admin login error:', error);
      alert('Admin girişi başarısız!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
      {/* Background Image - Same as Hero */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://customer-assets.emergentagent.com/job_326e649c-429d-481a-8bf3-c99e4276d28c/artifacts/bhrosu5k_8nNOHsP6PbEJMwWSth7Jb.png")',
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="text-4xl font-bold text-white tracking-tight">
                <span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 font-extrabold italic" 
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  C
                </span>
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>overLab</span>
              </span>
            </div>
            <p 
              className="text-slate-400 text-sm"
              style={{ fontFamily: 'Geist Sans, sans-serif' }}
            >
              Viral YouTube thumbnails için yapay zeka
            </p>
          </div>

          {/* Google Login Button */}
          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-6 rounded-lg flex items-center justify-center gap-3 shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Geist Sans, sans-serif' }}
          >
            {/* Google Logo SVG */}
            <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            {loading ? 'Yönlendiriliyor...' : 'Google ile devam et'}
          </Button>

          {/* Admin Backdoor Button */}
          <Button
            onClick={handleAdminLogin}
            disabled={loading}
            className="w-full mt-3 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-medium py-6 rounded-lg flex items-center justify-center gap-3 shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Geist Sans, sans-serif' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            {loading ? 'Yönlendiriliyor...' : 'Admin Giriş'}
          </Button>

          {/* Terms Text */}
          <p 
            className="text-slate-500 text-xs text-center mt-6 leading-relaxed"
            style={{ fontFamily: 'Geist Sans, sans-serif' }}
          >
            By signing up, you agree to our{' '}
            <a href="/terms" className="text-blue-400 hover:text-blue-300 underline">
              Terms of Service
            </a>
            {' & '}
            <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
