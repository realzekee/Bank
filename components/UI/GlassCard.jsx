import React from 'react';

export default function GlassCard({ children, className = '' }) {
  return (
    <div className={`bg-glass rounded-xl shadow-neon p-6 ${className}`}>{children}</div>
  );
}
