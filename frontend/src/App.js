import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SecondSection from './components/SecondSection';
import ThirdSection from './components/ThirdSection';
import FourthSection from './components/FourthSection';
import Footer from './components/Footer';
import CreatePage from './pages/CreatePage';
import AnalyzePage from './pages/AnalyzePage';
import TestPage from './pages/TestPage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import AuthCallback from './pages/AuthCallback';
import LabPage from './pages/LabPage';
// import AIVideoPage from './pages/AIVideoPage';

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

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Dashboard
        </h1>
        <p style={{ fontFamily: 'Geist Sans, sans-serif' }}>
          Hoş geldiniz! Dashboard yakında hazır olacak.
        </p>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<><Navbar /><PricingPage /></>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Tool Pages - Turkish URLs */}
            <Route path="/olustur" element={<><Navbar /><CreatePage /></>} />
            <Route path="/analiz" element={<><Navbar /><AnalyzePage /></>} />
            <Route path="/test" element={<><Navbar /><TestPage /></>} />
            <Route path="/lab" element={<><Navbar /><LabPage /></>} />
            {/* <Route path="/ai-video" element={<><Navbar /><AIVideoPage /></>} /> */}

            {/* Dashboard - Protected */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
