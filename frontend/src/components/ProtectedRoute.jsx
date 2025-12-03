import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading only during initial auth check
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <div className="text-white text-xl" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Yükleniyor...
          </div>
        </div>
      </div>
    );
  }

  // If not loading and no user, redirect to login
  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists, render children
  return <>{children}</>;
};

export default ProtectedRoute;
