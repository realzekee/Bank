import React from 'react';
import { motion } from 'framer-motion';
import CyberpunkVisuals from '../components/Visuals/CyberpunkVisuals.jsx';
import '../index.css';

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <CyberpunkVisuals />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 text-center p-8 rounded-xl bg-glass shadow-neon"
      >
        <h1 className="text-5xl font-cyber text-neonPurple mb-4 drop-shadow-lg">ZynPay</h1>
        <p className="text-neonTeal text-xl mb-6">Cyberpunk Banking. Secure. Local. Futuristic.</p>
        <a href="/login" className="px-6 py-3 bg-neonPink rounded-full font-bold text-white shadow-neon hover:bg-neonPurple transition">Login</a>
      </motion.div>
    </div>
  );
}
