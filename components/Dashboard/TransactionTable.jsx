import React from 'react';
import { motion } from 'framer-motion';

export default function TransactionTable({ transactions }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left bg-black bg-opacity-60 rounded-lg">
        <thead>
          <tr className="text-neonTeal">
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <motion.tr
              key={tx.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="border-b border-neonPurple"
            >
              <td>{new Date(tx.date).toLocaleString()}</td>
              <td className={tx.type === 'deposit' ? 'text-neonGreen' : 'text-neonPink'}>{tx.type}</td>
              <td>${tx.amount.toLocaleString()}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
