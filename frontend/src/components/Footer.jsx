import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Wand2, BarChart3, FlaskConical, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-slate-950 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 w-fit">
              <span className="text-2xl font-bold text-white tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 font-extrabold italic" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>C</span>
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>overLab</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm mb-4" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
              YouTube thumbnail'larınızı yapay zeka ile oluşturun, test edin ve analiz edin.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Ürün</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/olustur" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm w-fit" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  <Wand2 size={16} />
                  Oluştur
                </Link>
              </li>
              <li>
                <Link to="/analiz" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm w-fit" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  <BarChart3 size={16} />
                  Analiz Et
                </Link>
              </li>
              <li>
                <Link to="/test" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm w-fit" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  <FlaskConical size={16} />
                  Test Et
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="inline-block text-slate-400 hover:text-white transition-colors text-sm w-fit" style={{ fontFamily: 'Geist Sans, sans-serif' }}>Fiyatlandırma</Link>
              </li>
            </ul>
          </div>

          {/* By Operiqo - Orta */}
          <div className="flex flex-col items-center justify-start">
            <a 
              href="https://www.operiqo.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span className="text-slate-500 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>By</span>
              <img 
                src="https://customer-assets.emergentagent.com/job_coverlab-studio/artifacts/x6npr0ux_Ads%C4%B1z%20tasar%C4%B1m%20%286%29.png" 
                alt="Operiqo" 
                className="h-12"
              />
            </a>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Yasal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="inline-block text-slate-400 hover:text-white transition-colors text-sm w-fit" style={{ fontFamily: 'Geist Sans, sans-serif' }}>Gizlilik Politikası</Link>
              </li>
              <li>
                <Link to="/terms" className="inline-block text-slate-400 hover:text-white transition-colors text-sm w-fit" style={{ fontFamily: 'Geist Sans, sans-serif' }}>Kullanım Koşulları</Link>
              </li>
              <li>
                <Link to="/cookies" className="inline-block text-slate-400 hover:text-white transition-colors text-sm w-fit" style={{ fontFamily: 'Geist Sans, sans-serif' }}>Çerez Politikası</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* By Operiqo - Sol Alt Köşe */}
            <a 
              href="https://www.operiqo.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span className="text-slate-500 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>By</span>
              <img 
                src="https://customer-assets.emergentagent.com/job_coverlab-studio/artifacts/x6npr0ux_Ads%C4%B1z%20tasar%C4%B1m%20%286%29.png" 
                alt="Operiqo" 
                className="h-6"
              />
            </a>

            {/* Copyright & Email - Sağ Alt */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <p className="text-slate-500 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                © 2025 CoverLab. Tüm hakları saklıdır.
              </p>
              <div className="inline-flex items-center gap-2">
                <Mail size={16} className="text-slate-500" />
                <a href="mailto:team@operiqo.com" className="text-slate-400 hover:text-white transition-colors text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  team@operiqo.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
