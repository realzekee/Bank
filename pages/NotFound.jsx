import React from 'react';
import CyberpunkVisuals from '../components/Visuals/CyberpunkVisuals.jsx';

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <CyberpunkVisuals />
      <div className="z-10 text-center p-8 rounded-xl bg-glass shadow-neon">
        <h1 className="text-5xl font-cyber text-neonPink mb-4 drop-shadow-lg">404</h1>
        <p className="text-neonTeal text-xl mb-6">Page Not Found</p>
        <a href="/" className="px-6 py-3 bg-neonPurple rounded-full font-bold text-white shadow-neon hover:bg-neonTeal transition">Go Home</a>
      </div>
    </div>
  );
}
