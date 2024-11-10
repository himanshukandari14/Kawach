import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import DocumentPage from './pages/DocumentPage';
import PrintView from './pages/PrintView';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute'; // Import the ProtectedRoute component

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/accounts/emailsignup" element={<SignUpPage />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/document/:id" element={<ProtectedRoute element={<DocumentPage />} />} />
        <Route path="/print/:documentId/:token"  element={<PrintView />} />
        
        {/* Redirect to home by default */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;