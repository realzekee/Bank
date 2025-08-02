import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../lib/middleware.js';
import Home from './Home.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import Dashboard from './Dashboard.jsx';
import AdminPanel from './AdminPanel.jsx';
import NotFound from './NotFound.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import CyberpunkVisuals from '../components/Visuals/CyberpunkVisuals.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-black text-white relative">
          {/* 3D Background */}
          <CyberpunkVisuals />
          
          {/* Main Content */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            
            <main className="flex-1 pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}
