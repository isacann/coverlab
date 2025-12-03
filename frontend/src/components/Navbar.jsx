import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Home, Wand2, BarChart3, FlaskConical } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/40 backdrop-blur-lg border-b border-slate-800/30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-white tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 font-extrabold italic" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>C</span>
              <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>overLab</span>
            </span>
          </Link>

          {/* Center Menu */}
          <div className="hidden md:flex items-center gap-8 bg-slate-900/30 px-6 py-3 rounded-full border border-slate-700/30 backdrop-blur-sm">
            <Link to="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
              <Home size={20} />
              <span className="text-sm">Home</span>
            </Link>
            <Link to="/create" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
              <Wand2 size={20} />
              <span className="text-sm">Create</span>
            </Link>
            <Link to="/analyze" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
              <BarChart3 size={20} />
              <span className="text-sm">Analyze</span>
            </Link>
            <Link to="/test" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
              <FlaskConical size={20} />
              <span className="text-sm">Test</span>
            </Link>
          </div>

          {/* Right Buttons */}
          <div className="flex items-center gap-6">
            <Link to="/pricing" className="text-slate-300 hover:text-white transition-colors text-sm font-medium" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
              Pricing
            </Link>
            <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
              Login
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;