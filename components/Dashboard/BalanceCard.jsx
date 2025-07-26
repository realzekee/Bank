import React from 'react';

export default function BalanceCard({ balance }) {
  return (
    <div className="bg-glass p-6 rounded-xl shadow-neon text-neonPurple text-2xl font-cyber mb-4">
      Balance: ${balance?.toLocaleString()}
    </div>
  );
}
