import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Home, Wand2, BarChart3, FlaskConical, Settings, LogOut, Zap, FolderOpen, Play, CreditCard, Wallet, Loader2, Menu, X, Receipt, Video } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Navbar = () => {
  const { user, profile, credits, signOut, loading, profileLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if current path matches
  const isActive = (path) => location.pathname === path;

  // Debug log
  console.log('Navbar - User:', user ? 'Logged in' : 'Guest', 'Credits:', credits);

  const handleLogout = async () => {
    try {
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      await signOut();
      // signOut already handles redirect, no need for navigate
    } catch (error) {
      console.error('Logout error:', error);
    }
  };


  const handleSubscription = async () => {
    // Close dropdown
    setIsDropdownOpen(false);

    // Check user ID
    if (!user?.id) {
      toast.error('Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }

    // 1. Show loading state
    setIsRedirecting(true);
    toast.loading('Stripe paneline yönlendiriliyorsunuz, lütfen bekleyin...', {
      id: 'subscription-redirect',
      duration: 30000
    });

    console.log('🔗 Requesting subscription portal for user:', user.id);

    try {
      // 2. Use fetch to get the redirect URL from n8n
      const response = await fetch('https://n8n.getoperiqo.com/webhook/068ca5b1-99a3-4a3e-ba4e-3246f7a1226a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.id }),
        redirect: 'manual' // Don't auto-follow redirects
      });

      console.log('📡 Response status:', response.status, 'Type:', response.type);

      // 3. Handle different response types
      let redirectUrl = null;

      // Case A: Redirect response (302/303) - get Location header
      if (response.type === 'opaqueredirect' || response.status === 302 || response.status === 303) {
        // For CORS, we can't access Location header directly, so we need to try URL from response
        // This usually means n8n is returning a redirect that we can't follow due to CORS
        console.log('⚠️ Got redirect response, checking for URL...');

        // Try to get URL from response headers (may not work with CORS)
        redirectUrl = response.headers.get('Location');

        if (!redirectUrl) {
          // Fallback: Try to refetch without redirect:manual to let browser handle it
          console.log('🔄 Trying direct navigation approach...');
          window.location.href = 'https://n8n.getoperiqo.com/webhook/068ca5b1-99a3-4a3e-ba4e-3246f7a1226a?user_id=' + encodeURIComponent(user.id);
          return;
        }
      }

      // Case B: JSON response with URL
      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        console.log('📦 JSON response:', data);

        // Check various URL field names
        redirectUrl = data.url || data.redirect_url || data.portal_url || data.billing_url;

        if (!redirectUrl && data.error) {
          throw new Error(data.error.message || data.error || 'Bilinmeyen hata');
        }
      }

      // Case C: Plain text URL response
      if (response.ok && !redirectUrl) {
        const text = await response.text();
        console.log('📄 Text response:', text.substring(0, 200));

        // Check if response is a URL
        if (text.startsWith('http')) {
          redirectUrl = text.trim();
        }
      }

      // 4. Redirect to Stripe portal - validate URL first
      if (redirectUrl && redirectUrl.startsWith('http')) {
        console.log('✅ Redirecting to:', redirectUrl);
        toast.success('Stripe paneline yönlendiriliyorsunuz...', {
          id: 'subscription-redirect'
        });
        window.location.href = redirectUrl;
      } else if (redirectUrl) {
        // Invalid URL received (e.g., n8n expression not evaluated)
        console.error('❌ Invalid URL received:', redirectUrl);
        toast.error('Geçersiz yönlendirme URL\'i alındı. Lütfen tekrar deneyin.', {
          id: 'subscription-redirect'
        });
        setIsRedirecting(false);
      } else {
        // Fallback: Use form method as last resort
        console.log('⚠️ No URL found, using form fallback...');
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://n8n.getoperiqo.com/webhook/068ca5b1-99a3-4a3e-ba4e-3246f7a1226a';
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'user_id';
        input.value = user.id;
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
      }

    } catch (error) {
      console.error('❌ Subscription portal error:', error);
      toast.error('Abonelik paneline erişilemedi. Lütfen tekrar deneyin.', {
        id: 'subscription-redirect'
      });
      setIsRedirecting(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/40 backdrop-blur-lg border-b border-slate-800/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <span className="text-2xl font-bold text-white tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 font-extrabold italic" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>C</span>
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>overLab</span>
              </span>
            </Link>

            {/* Center Menu - Visible to All Users */}
            <div className="hidden md:flex items-center gap-6 bg-slate-900/30 px-6 py-3 rounded-full border border-slate-700/30 backdrop-blur-sm flex-shrink-0">
              <Link
                to="/"
                className={`flex items-center gap-2 transition-colors ${isActive('/')
                  ? 'text-white font-semibold'
                  : 'text-slate-300 hover:text-white'
                  }`}
                style={{ fontFamily: 'Geist Sans, sans-serif' }}
              >
                <Home size={20} />
                <span className="text-sm">Anasayfa</span>
              </Link>
              <Link
                to="/olustur"
                className={`flex items-center gap-2 transition-colors ${isActive('/olustur')
                  ? 'text-cyan-300 font-semibold'
                  : 'text-cyan-400 hover:text-cyan-300'
                  }`}
                style={{ fontFamily: 'Geist Sans, sans-serif' }}
              >
                <Wand2 size={20} />
                <span className="text-sm">Oluştur</span>
              </Link>
              <Link
                to="/analiz"
                className={`flex items-center gap-2 transition-colors ${isActive('/analiz')
                  ? 'text-white font-semibold'
                  : 'text-slate-300 hover:text-white'
                  }`}
                style={{ fontFamily: 'Geist Sans, sans-serif' }}
              >
                <BarChart3 size={20} />
                <span className="text-sm">Analiz</span>
              </Link>
              <Link
                to="/test"
                className={`flex items-center gap-2 transition-colors ${isActive('/test')
                  ? 'text-white font-semibold'
                  : 'text-slate-300 hover:text-white'
                  }`}
                style={{ fontFamily: 'Geist Sans, sans-serif' }}
              >
                <Play size={20} />
                <span className="text-sm">Test</span>
              </Link>

              {/* AI Video - NEW Feature */}
              <Link
                to="/ai-video"
                className={`relative flex items-center gap-2 transition-all group ${isActive('/ai-video')
                  ? 'text-white font-semibold'
                  : 'text-slate-300 hover:text-white'
                  }`}
                style={{ fontFamily: 'Geist Sans, sans-serif' }}
              >
                {/* Glow effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-2">
                  <Video size={20} className="text-purple-400" />
                  <span className="text-sm bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-medium">AI Video</span>
                  {/* NEW Badge */}
                  <span className="absolute -top-3 -right-8 px-1.5 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-[9px] font-bold text-white rounded-full uppercase tracking-wider animate-pulse shadow-lg shadow-green-500/50">
                    YENİ
                  </span>
                </div>
              </Link>
            </div>

            {/* Right Side - Conditional Rendering */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <Link to="/pricing" className="hidden md:block text-slate-300 hover:text-white transition-colors text-sm font-medium" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                Fiyatlandırma
              </Link>

              {!user ? (
                // Guest User - Show Login Button
                <Link to="/login">
                  <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                    Login
                  </Button>
                </Link>
              ) : (
                // Logged In User - Show Profile Dropdown
                <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <button className={`flex items-center gap-3 px-3 py-2 rounded-full transition-all ${['pre', 'premium'].includes(profile?.subscription_plan)
                        ? 'bg-slate-800/50 hover:bg-slate-800 border border-purple-500/40'
                        : profile?.subscription_plan === 'pro'
                          ? 'bg-slate-800/50 hover:bg-slate-800 border border-orange-500/30'
                          : 'bg-slate-800/50 hover:bg-slate-800 border border-slate-700/30'
                      }`}>
                      {/* User Avatar */}
                      <img
                        src={user?.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=' + (user?.email || 'User')}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                      <div className="flex flex-col items-start flex-1 min-w-0">
                        {/* User Name */}
                        <span className="text-white text-sm font-medium truncate max-w-[100px]" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                          {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                        </span>
                        {/* Plan Badge */}
                        {profileLoading ? (
                          <span className="text-[10px] font-bold text-slate-400 -mt-0.5 animate-pulse">
                            ...
                          </span>
                        ) : ['pre', 'premium'].includes(profile?.subscription_plan) ? (
                          <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 -mt-0.5">
                            PREMIUM
                          </span>
                        ) : profile?.subscription_plan === 'pro' ? (
                          <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400 -mt-0.5">
                            PRO
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 -mt-0.5">
                            FREE
                          </span>
                        )}
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-700">
                    {/* Credits Badge */}
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/30">
                        <Zap size={16} className="text-blue-400" />
                        <span className="text-white font-semibold" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                          Kredi: {credits}
                        </span>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="bg-slate-700" />

                    {/* My Lab */}
                    <DropdownMenuItem
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/lab');
                      }}
                      className="text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                      style={{ fontFamily: 'Geist Sans, sans-serif' }}
                    >
                      <FolderOpen size={16} className="mr-2" />
                      Laboratuvarım
                    </DropdownMenuItem>

                    {/* Subscription - For Pro/Pre/Premium users */}
                    {['pro', 'pre', 'premium'].includes(profile?.subscription_plan) && (
                      <DropdownMenuItem
                        onClick={handleSubscription}
                        disabled={isRedirecting}
                        className={`text-slate-300 hover:text-white hover:bg-slate-800 ${isRedirecting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        style={{ fontFamily: 'Geist Sans, sans-serif' }}
                      >
                        {isRedirecting ? (
                          <Loader2 size={16} className="mr-2 animate-spin" />
                        ) : (
                          <Receipt size={16} className="mr-2" />
                        )}
                        Aboneliğim
                      </DropdownMenuItem>
                    )}

                    {/* Logout */}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-400 hover:text-red-300 hover:bg-slate-800 cursor-pointer"
                      style={{ fontFamily: 'Geist Sans, sans-serif' }}
                    >
                      <LogOut size={16} className="mr-2" />
                      Çıkış Yap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-800">
              <div className="flex flex-col gap-2 pt-4">
                <Link
                  to="/"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home size={20} />
                  <span>Anasayfa</span>
                </Link>
                <Link
                  to="/olustur"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/olustur') ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-cyan-400 hover:bg-slate-800/50'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Wand2 size={20} />
                  <span>Oluştur</span>
                </Link>
                <Link
                  to="/analiz"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/analiz') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BarChart3 size={20} />
                  <span>Analiz</span>
                </Link>
                <Link
                  to="/test"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/test') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Play size={20} />
                  <span>Test</span>
                </Link>
                {/* AI Video - NEW Feature */}
                <Link
                  to="/ai-video"
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors overflow-visible ${isActive('/ai-video') ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800/50'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Video size={20} className="text-purple-400" />
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-medium">AI Video</span>
                  {/* NEW Badge */}
                  <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-[10px] font-bold text-white rounded-full uppercase tracking-wider animate-pulse shadow-lg shadow-green-500/50">
                    YENİ
                  </span>
                </Link>
                <Link
                  to="/pricing"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800/50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Zap size={20} />
                  <span>Fiyatlandırma</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
