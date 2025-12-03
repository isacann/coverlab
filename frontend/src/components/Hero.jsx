import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://customer-assets.emergentagent.com/job_326e649c-429d-481a-8bf3-c99e4276d28c/artifacts/bhrosu5k_8nNOHsP6PbEJMwWSth7Jb.png")',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Tahmin Etmeyi Bırakın. <br />Tıklanmaya Başlayın.
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-slate-200 mb-10 leading-relaxed">
          Viral YouTube kapaklarını tek platformda Oluşturun, Test Edin ve Analiz Edin.
        </p>

        {/* CTA Button */}
        <Button 
          onClick={() => navigate('/dashboard')}
          size="lg"
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg px-8 py-6 rounded-lg shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
        >
          Tek Tıkla Oluştur
        </Button>
      </div>
    </section>
  );
};

export default Hero;