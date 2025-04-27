import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import VerifyOTPPage from './pages/VerifyOTPPage';
import Dashboard from './pages/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupPage setUserEmail={setUserEmail} setUserName={setUserName} />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} setUserEmail={setUserEmail} />} />
        <Route path="/verify" element={<VerifyOTPPage userEmail={userEmail} userName={userName} setIsAuthenticated={setIsAuthenticated} />} />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;