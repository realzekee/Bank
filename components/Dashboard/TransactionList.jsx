import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency, formatDate } from '../../lib/validation.js';

export default function TransactionList({ transactions, currentUserId }) {
  if (!transactions || transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-black/40 backdrop-blur-lg p-8 rounded-xl border border-neonTeal/30 text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-r from-neonTeal to-neonPurple rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-xl font-cyber text-gray-300 mb-2">No Transactions Yet</h3>
        <p className="text-gray-500 font-cyber">Your transaction history will appear here once you start banking.</p>
      </motion.div>
    );
  }

  const getTransactionIcon = (type, fromUserId, toUserId) => {
    if (type === 'deposit' || (type === 'transfer' && toUserId === currentUserId)) {
      return (
        <svg className="w-5 h-5 text-neonGreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5 text-neonPink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      );
    }
  };

  const getTransactionText = (transaction) => {
    const { type, fromUserId, toUserId, description } = transaction;
    
    if (type === 'deposit') {
      return fromUserId === 'system' ? 'Admin Deposit' : 'Deposit';
    } else if (type === 'withdraw') {
      return toUserId === 'system' ? 'Admin Deduction' : 'Withdrawal';
    } else if (type === 'transfer') {
      return fromUserId === currentUserId ? `Transfer to ${toUserId}` : `Transfer from ${fromUserId}`;
    }
    
    return description || 'Transaction';
  };

  const getAmountColor = (type, fromUserId, toUserId) => {
    if (type === 'deposit' || (type === 'transfer' && toUserId === currentUserId)) {
      return 'text-neonGreen';
    } else {
      return 'text-neonPink';
    }
  };

  const getAmountPrefix = (type, fromUserId, toUserId) => {
    if (type === 'deposit' || (type === 'transfer' && toUserId === currentUserId)) {
      return '+';
    } else {
      return '-';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-black/40 backdrop-blur-lg rounded-xl border border-neonTeal/30 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-xl font-cyber text-neonTeal mb-2">Transaction History</h3>
        <p className="text-gray-400 font-cyber text-sm">Recent account activity</p>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="p-4 border-b border-gray-800 last:border-b-0 hover:bg-white/5 transition-colors duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                  {getTransactionIcon(transaction.type, transaction.fromUserId, transaction.toUserId)}
                </div>
                <div>
                  <div className="font-cyber text-white text-sm">
                    {getTransactionText(transaction)}
                  </div>
                  <div className="text-gray-400 font-cyber text-xs">
                    {formatDate(transaction.timestamp)}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-cyber font-bold ${getAmountColor(transaction.type, transaction.fromUserId, transaction.toUserId)}`}>
                  {getAmountPrefix(transaction.type, transaction.fromUserId, transaction.toUserId)}
                  {formatCurrency(transaction.amount)}
                </div>
                <div className="text-gray-500 font-cyber text-xs uppercase">
                  {transaction.type}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}