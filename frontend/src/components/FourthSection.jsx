import React from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const FourthSection = () => {
  return (
    <section className="relative min-h-screen flex items-start justify-center overflow-hidden bg-slate-950 pt-24">
      {/* Smooth Gradient Transition from Previous Section */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10"></div>
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://customer-assets.emergentagent.com/job_youclicker/artifacts/v1sys46q_wR3U7DziddIAl0z6EQXfA.png")',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
        {/* Headline */}
        <h2 
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" 
          style={{ 
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.8), 0 2px 10px rgba(0, 0, 0, 0.9)'
          }}
        >
          Vitrinde Nasıl Görünüyorsunuz? Canlı Simülatör
        </h2>

        {/* Subheadline */}
        <p 
          className="text-lg md:text-xl text-slate-200 mb-10 leading-relaxed" 
          style={{ 
            fontFamily: 'Geist Sans, sans-serif',
            textShadow: '0 3px 15px rgba(0, 0, 0, 0.8), 0 1px 8px rgba(0, 0, 0, 0.9)'
          }}
        >
          Thumbnail'iniz MrBeast'in yanında sönük mü kalıyor yoksa parlıyor mu? YouTube anasayfasını simüle edin, rakiplerinizle yan yana test edin ve yayına girmeden kazananı belirleyin.
        </p>

        {/* CTA Button */}
        <Link to="/test">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg px-8 py-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            style={{ 
              fontFamily: 'Geist Sans, sans-serif',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6), 0 0 40px rgba(6, 182, 212, 0.3)'
            }}
          >
            Test Et
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default FourthSection;
