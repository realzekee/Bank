import React from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="bg-black/80 backdrop-blur-md border-t border-neonPurple/30 mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-neonPurple to-neonTeal rounded-lg flex items-center justify-center">
                <span className="text-white font-cyber font-bold">Z</span>
              </div>
              <span className="text-xl font-cyber text-white">
                Zyn<span className="text-neonPurple">Pay</span>
              </span>
            </div>
            <p className="text-gray-400 font-cyber text-sm">
              The future of cyberpunk banking. Secure, fast, and neon-powered transactions.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-neonTeal font-cyber font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-neonPurple transition-colors duration-300 font-cyber text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-gray-400 hover:text-neonPurple transition-colors duration-300 font-cyber text-sm">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-400 hover:text-neonPurple transition-colors duration-300 font-cyber text-sm">
                  Login
                </a>
              </li>
              <li>
                <a href="/register" className="text-gray-400 hover:text-neonPurple transition-colors duration-300 font-cyber text-sm">
                  Register
                </a>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="space-y-4">
            <h3 className="text-neonTeal font-cyber font-bold">Powered By</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 font-cyber text-sm">React + Vite</li>
              <li className="text-gray-400 font-cyber text-sm">Three.js + R3F</li>
              <li className="text-gray-400 font-cyber text-sm">Tailwind CSS</li>
              <li className="text-gray-400 font-cyber text-sm">Framer Motion</li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 font-cyber text-sm">
              © 2024 ZynPay. All rights reserved. Built for the cyberpunk future.
            </p>
            <div className="flex space-x-6">
              <span className="text-gray-500 font-cyber text-sm">
                🔒 Local Storage Only
              </span>
              <span className="text-gray-500 font-cyber text-sm">
                ⚡ Powered by WebGL
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}