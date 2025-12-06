import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Home, Wand2, BarChart3, FlaskConical, Settings, LogOut, Zap, FolderOpen, Play, CreditCard, Wallet, Loader2, Menu, X, Receipt } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Navbar = () => {
  const { user, profile, credits, signOut, loading } = useAuth();
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
      await signOut();
      navigate('/', { replace: true });
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

    try {
      // 1. Disable button and show loading toast
      setIsRedirecting(true);
      toast.loading('Stripe paneline yönlendiriliyorsunuz, lütfen bekleyin...', {
        id: 'subscription-redirect',
        duration: 30000 // 30 saniye timeout
      });

      console.log('🔗 Redirecting to subscription portal for user:', user.id);

      // 2. Make API call to n8n webhook with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
      
      const response = await fetch('https://n8n.getoperiqo.com/webhook/INVALID-ENDPOINT-TEST', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`N8N yanıt hatası: ${response.status} - ${response.statusText}`);
      }

      // Try to parse response as JSON, but handle non-JSON responses
      let result;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
        console.log('N8N JSON response:', result);
        
        // Check if we got a redirect URL in JSON
        if (result.redirect_url || result.url) {
          const redirectUrl = result.redirect_url || result.url;
          toast.success('Stripe paneline yönlendiriliyorsunuz...', { id: 'subscription-redirect' });
          
          // Wait a moment then redirect
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 1000);
          return;
        }
      } else {
        // Non-JSON response - might be HTML redirect or plain text URL
        const responseText = await response.text();
        console.log('N8N text response:', responseText);
        
        // Check if response text looks like a URL
        if (responseText.startsWith('http')) {
          toast.success('Stripe paneline yönlendiriliyorsunuz...', { id: 'subscription-redirect' });
          
          // Wait a moment then redirect
          setTimeout(() => {
            window.location.href = responseText.trim();
          }, 1000);
          return;
        } else if (responseText.includes('http')) {
          // Extract URL from HTML or other format
          const urlMatch = responseText.match(/(https?:\/\/[^\s<>"]+)/);
          if (urlMatch) {
            const redirectUrl = urlMatch[1];
            toast.success('Stripe paneline yönlendiriliyorsunuz...', { id: 'subscription-redirect' });
            
            setTimeout(() => {
              window.location.href = redirectUrl;
            }, 1000);
            return;
          }
        }
      }
      
      // If we reach here, we couldn't find a redirect URL
      throw new Error('N8N yanıtında yönlendirme URL\'si bulunamadı');

    } catch (error) {
      console.error('Subscription redirect error:', error);
      
      let errorMessage = 'Bilinmeyen hata oluştu';
      
      if (error.name === 'AbortError') {
        errorMessage = 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin';
      } else if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
        errorMessage = 'Bağlantı hatası. İnternet bağlantınızı kontrol edin';
      } else {
        errorMessage = error.message;
      }
      
      // Show error toast
      toast.error(`Abonelik paneli yüklenemedi: ${errorMessage}`, {
        id: 'subscription-redirect',
        duration: 5000
      });
      
      // Re-enable button
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
              className={`flex items-center gap-2 transition-colors ${
                isActive('/') 
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
              className={`flex items-center gap-2 transition-colors ${
                isActive('/olustur')
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
              className={`flex items-center gap-2 transition-colors ${
                isActive('/analiz')
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
              className={`flex items-center gap-2 transition-colors ${
                isActive('/test')
                  ? 'text-white font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
              style={{ fontFamily: 'Geist Sans, sans-serif' }}
            >
              <Play size={20} />
              <span className="text-sm">Test</span>
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
                  <button className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all min-w-[140px] ${
                    profile?.subscription_plan === 'pro'
                      ? 'bg-slate-800/50 hover:bg-slate-800 border border-orange-500/30 hover:border-orange-500/50'
                      : 'bg-slate-800/50 hover:bg-slate-800 border border-slate-700/30'
                  }`}>
                    {/* User Avatar */}
                    <img 
                      src={user?.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=' + (user?.email || 'User')}
                      alt="User Avatar"
                      className={`w-8 h-8 rounded-full flex-shrink-0 ${profile?.subscription_plan === 'pro' ? 'ring-1 ring-orange-400/40' : ''}`}
                    />
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      {/* User Name */}
                      <span className="text-white text-sm font-medium truncate max-w-[100px]" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                      </span>
                      {/* Pro Badge */}
                      {profile?.subscription_plan === 'pro' && (
                        <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400 -mt-0.5">
                          PRO
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
                  
                  {/* Subscription */}
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home size={20} />
                <span>Anasayfa</span>
              </Link>
              <Link 
                to="/olustur" 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/olustur') ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-cyan-400 hover:bg-slate-800/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Wand2 size={20} />
                <span>Oluştur</span>
              </Link>
              <Link 
                to="/analiz" 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/analiz') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BarChart3 size={20} />
                <span>Analiz</span>
              </Link>
              <Link 
                to="/test" 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/test') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Play size={20} />
                <span>Test</span>
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
