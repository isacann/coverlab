import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Home, Wand2, BarChart3, FlaskConical } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold text-white">CoverLab</span>
          </Link>

          {/* Center Menu */}
          <div className="hidden md:flex items-center gap-8 bg-slate-800/50 px-6 py-3 rounded-full border border-slate-700">
            <Link to="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <Home size={20} />
              <span className="text-sm">Home</span>
            </Link>
            <Link to="/create" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
              <Wand2 size={20} />
              <span className="text-sm">Create</span>
            </Link>
            <Link to="/analyze" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <BarChart3 size={20} />
              <span className="text-sm">Analyze</span>
            </Link>
            <Link to="/test" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <FlaskConical size={20} />
              <span className="text-sm">Test</span>
            </Link>
          </div>

          {/* Right Buttons */}
          <div className="flex items-center gap-3">
            <Link to="/pricing" className="text-slate-300 hover:text-white transition-colors text-sm font-medium hidden sm:block">
              Pricing
            </Link>
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
              Login
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;