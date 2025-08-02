import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../lib/middleware.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-neonPurple/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-neonPurple to-neonTeal rounded-lg flex items-center justify-center">
              <span className="text-white font-cyber font-bold">Z</span>
            </div>
            <span className="text-2xl font-cyber text-white">
              Zyn<span className="text-neonPurple">Pay</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-300 hover:text-neonTeal transition-colors duration-300 font-cyber"
                >
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="text-gray-300 hover:text-neonPurple transition-colors duration-300 font-cyber"
                  >
                    Admin
                  </Link>
                )}
                <div className="text-gray-400 font-cyber">
                  Welcome, <span className="text-neonTeal">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg font-cyber hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-500/50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-neonTeal transition-colors duration-300 font-cyber"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="bg-gradient-to-r from-neonPurple to-neonTeal text-white px-4 py-2 rounded-lg font-cyber hover:shadow-lg hover:shadow-neonPurple/50 transition-all duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}