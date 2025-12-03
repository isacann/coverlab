import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Wand2, BarChart3, FlaskConical, Mail, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-slate-950 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-white tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 font-extrabold italic" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>C</span>
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>overLab</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm mb-4" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
              YouTube thumbnail'larınızı yapay zeka ile oluşturun, test edin ve analiz edin.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                <Twitter size={18} className="text-slate-400" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                <Instagram size={18} className="text-slate-400" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                <Youtube size={18} className="text-slate-400" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Ürün</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/create" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  <Wand2 size={16} />
                  Oluştur
                </Link>
              </li>
              <li>
                <Link to="/analyze" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  <BarChart3 size={16} />
                  Analiz Et
                </Link>
              </li>
              <li>
                <Link to="/test" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  <FlaskConical size={16} />
                  Test Et
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Şirket</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>Hakkımızda</Link>
              </li>
              <li>
                <Link to="/pricing" className="text-slate-400 hover:text-white transition-colors text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>Fiyatlandırma</Link>
              </li>
              <li>
                <Link to="/blog" className="text-slate-400 hover:text-white transition-colors text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>İletişim</Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Yasal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>Gizlilik Politikası</Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-400 hover:text-white transition-colors text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>Kullanım Koşulları</Link>
              </li>
              <li>
                <Link to="/cookies" className="text-slate-400 hover:text-white transition-colors text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>Çerez Politikası</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
              © 2024 CoverLab. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-slate-500" />
              <a href="mailto:info@coverlab.com" className="text-slate-400 hover:text-white transition-colors text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                info@coverlab.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;