import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/middleware.js';
import Button from '../components/Button.jsx';

export default function Home() {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="text-6xl md:text-8xl font-cyber font-bold mb-6">
            <span className="text-white">Zyn</span>
            <span className="text-transparent bg-gradient-to-r from-neonPurple to-neonTeal bg-clip-text">Pay</span>
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-neonPurple to-neonTeal mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-gray-300 font-cyber mb-4">
            The Future of Cyberpunk Banking
          </p>
          <p className="text-lg text-gray-400 font-cyber max-w-2xl mx-auto">
            Experience next-generation financial services with neon-powered security, 
            holographic transactions, and neural-link account management.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-black/40 backdrop-blur-lg p-6 rounded-xl border border-neonPurple/30 hover:border-neonPurple/60 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-neonPurple to-neonTeal rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-cyber text-neonPurple mb-3">Quantum Security</h3>
            <p className="text-gray-400 font-cyber text-sm">
              Military-grade encryption with neural-pattern authentication for ultimate account protection.
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-lg p-6 rounded-xl border border-neonTeal/30 hover:border-neonTeal/60 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-neonTeal to-neonGreen rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-cyber text-neonTeal mb-3">Lightning Fast</h3>
            <p className="text-gray-400 font-cyber text-sm">
              Instant transfers powered by quantum processors and holographic verification networks.
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-lg p-6 rounded-xl border border-neonPink/30 hover:border-neonPink/60 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-neonPink to-neonPurple rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-cyber text-neonPink mb-3">AI Powered</h3>
            <p className="text-gray-400 font-cyber text-sm">
              Smart financial insights with predictive analytics and automated portfolio optimization.
            </p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {user ? (
            <Link to="/dashboard">
              <Button size="xl" className="px-12">
                Access Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button size="xl" className="px-12">
                  Join the Revolution
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="xl" className="px-12">
                  Access Terminal
                </Button>
              </Link>
            </>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-cyber font-bold text-neonTeal mb-2">99.9%</div>
            <div className="text-gray-400 font-cyber text-sm">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-cyber font-bold text-neonPurple mb-2">0.01s</div>
            <div className="text-gray-400 font-cyber text-sm">Transaction Speed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-cyber font-bold text-neonGreen mb-2">256-bit</div>
            <div className="text-gray-400 font-cyber text-sm">Encryption</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-cyber font-bold text-neonPink mb-2">24/7</div>
            <div className="text-gray-400 font-cyber text-sm">Neural Support</div>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-neonTeal rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-1/3 right-16 w-1 h-1 bg-neonPurple rounded-full animate-pulse opacity-80" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-neonPink rounded-full animate-pulse opacity-70" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-neonGreen rounded-full animate-pulse opacity-90" style={{ animationDelay: '0.5s' }}></div>
      </motion.div>
    </div>
  );
}
