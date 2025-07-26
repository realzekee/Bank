import React from 'react';

export default function NeonButton({ children, ...props }) {
  return (
    <button {...props} className="px-6 py-2 bg-neonPurple rounded-full font-bold text-white shadow-neon hover:bg-neonTeal transition glitch">
      {children}
    </button>
  );
}
