import React from 'react';
import { Button } from './ui/button';

const SecondSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://customer-assets.emergentagent.com/job_youclicker/artifacts/6omip6r1_KF8fPDK6JRMin713LfOwL.png")',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Headline */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Lorem Ipsum Dolor Sit Amet
        </h2>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-slate-200 mb-10 leading-relaxed" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
          Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
        </p>

        {/* CTA Button */}
        <Button 
          size="lg"
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg px-8 py-6 rounded-lg shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
          style={{ fontFamily: 'Geist Sans, sans-serif' }}
        >
          Hemen Başla
        </Button>
      </div>
    </section>
  );
};

export default SecondSection;
