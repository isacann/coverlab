import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SecondSection from './components/SecondSection';
import ThirdSection from './components/ThirdSection';
import FourthSection from './components/FourthSection';
import Footer from './components/Footer';
import CreatePage from './pages/CreatePage';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <Hero />
      <SecondSection />
      <ThirdSection />
      <FourthSection />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<><Navbar /><CreatePage /></>} />
          <Route path="/dashboard" element={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Dashboard Page</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;