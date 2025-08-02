import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../lib/validation.js';

export default function BalanceCard({ balance, username }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-black/60 to-neonPurple/20 backdrop-blur-lg p-8 rounded-xl border border-neonPurple/30 shadow-2xl shadow-neonPurple/20 relative"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-cyber text-gray-300 mb-1">Account Balance</h3>
          <p className="text-sm font-cyber text-gray-500">Welcome back, {username}</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-neonPurple to-neonTeal rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-4xl font-cyber font-bold text-white mb-2">
            {formatCurrency(balance)}
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((balance / 10000) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-gradient-to-r from-neonPurple to-neonTeal h-2 rounded-full"
            />
          </div>
          <p className="text-sm text-gray-400 font-cyber mt-2">
            Account Status: <span className="text-neonTeal">Active</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-cyber text-neonTeal">₱0.00</div>
            <div className="text-sm text-gray-400 font-cyber">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-cyber text-neonGreen">₱{(balance * 0.02).toFixed(2)}</div>
            <div className="text-sm text-gray-400 font-cyber">Interest</div>
          </div>
        </div>
      </div>

      {/* Cyberpunk elements */}
      <div className="absolute top-2 right-2 w-2 h-2 bg-neonTeal rounded-full animate-pulse" />
      <div className="absolute bottom-2 left-2 w-1 h-1 bg-neonPurple rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
    </motion.div>
  );
}
