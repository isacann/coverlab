import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Home, Wand2, BarChart3, FlaskConical, Settings, LogOut, Zap, FolderOpen, Play } from 'lucide-react';

const Navbar = () => {
  const { user, profile, credits, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/40 backdrop-blur-lg border-b border-slate-800/30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 font-extrabold italic" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>C</span>
              <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>overLab</span>
            </span>
          </Link>

          {/* Center Menu - Visible to All Users */}
          <div className="hidden md:flex items-center gap-8 bg-slate-900/30 px-6 py-3 rounded-full border border-slate-700/30 backdrop-blur-sm">
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
              to="/create" 
              className={`flex items-center gap-2 transition-colors ${
                isActive('/create')
                  ? 'text-cyan-300 font-semibold'
                  : 'text-cyan-400 hover:text-cyan-300'
              }`}
              style={{ fontFamily: 'Geist Sans, sans-serif' }}
            >
              <Wand2 size={20} />
              <span className="text-sm">Oluştur</span>
            </Link>
            <Link 
              to="/analyze" 
              className={`flex items-center gap-2 transition-colors ${
                isActive('/analyze')
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
          <div className="flex items-center gap-6">
            <Link to="/pricing" className="text-slate-300 hover:text-white transition-colors text-sm font-medium" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
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
                  <button className="flex items-center gap-3 bg-slate-800/50 hover:bg-slate-800 px-4 py-2 rounded-full border border-slate-700/30 transition-all">
                    {/* User Avatar */}
                    <img 
                      src={user?.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=' + (user?.email || 'User')}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    {/* User Name */}
                    <span className="text-white text-sm font-medium hidden sm:block" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                    </span>
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
                    <Archive size={16} className="mr-2" />
                    Laboratuvarım
                  </DropdownMenuItem>
                  
                  {/* Settings */}
                  <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                    <Settings size={16} className="mr-2" />
                    Ayarlar
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;