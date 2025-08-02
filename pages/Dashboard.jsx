import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/middleware.js';
import { getUserById } from '../lib/auth.js';
import { getUserTransactions } from '../lib/db.js';
import BalanceCard from '../components/Dashboard/BalanceCard.jsx';
import TransactionList from '../components/Dashboard/TransactionList.jsx';
import TransferForm from '../components/Dashboard/TransferForm.jsx';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      // Get updated user data
      const userData = await getUserById(user.id);
      setCurrentUser({ ...userData, ...user }); // Merge with current session data
      
      // Get user transactions
      const userTransactions = getUserTransactions(user.id);
      setTransactions(userTransactions);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleTransactionComplete = () => {
    // Reload user data after transaction
    loadUserData();
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neonPurple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-cyber">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.locked) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-900/30 backdrop-blur-lg p-8 rounded-xl border border-red-500/30 text-center max-w-md"
        >
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-cyber text-red-300 mb-2">Account Locked</h2>
          <p className="text-gray-400 font-cyber">Your account has been locked by an administrator. Please contact support.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-cyber font-bold text-white mb-2">
            Banking Dashboard
          </h1>
          <p className="text-gray-400 font-cyber">
            Welcome to your cyberpunk financial command center, {currentUser?.username}
          </p>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Balance & Transactions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Balance Card */}
            <BalanceCard 
              balance={currentUser?.balance || 0} 
              username={currentUser?.username} 
            />

            {/* Transactions */}
            <TransactionList 
              transactions={transactions} 
              currentUserId={user.id} 
            />
          </div>

          {/* Right Column - Transfer Form */}
          <div className="lg:col-span-1">
            <TransferForm 
              currentUser={currentUser} 
              onTransactionComplete={handleTransactionComplete} 
            />
          </div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-black/40 backdrop-blur-lg p-6 rounded-xl border border-neonTeal/30 text-center">
            <div className="text-2xl font-cyber font-bold text-neonTeal mb-2">
              {transactions.length}
            </div>
            <div className="text-gray-400 font-cyber text-sm">Total Transactions</div>
          </div>

          <div className="bg-black/40 backdrop-blur-lg p-6 rounded-xl border border-neonGreen/30 text-center">
            <div className="text-2xl font-cyber font-bold text-neonGreen mb-2">
              {transactions.filter(t => t.toUserId === user.id && t.type === 'transfer').length}
            </div>
            <div className="text-gray-400 font-cyber text-sm">Received</div>
          </div>

          <div className="bg-black/40 backdrop-blur-lg p-6 rounded-xl border border-neonPink/30 text-center">
            <div className="text-2xl font-cyber font-bold text-neonPink mb-2">
              {transactions.filter(t => t.fromUserId === user.id && t.type === 'transfer').length}
            </div>
            <div className="text-gray-400 font-cyber text-sm">Sent</div>
          </div>

          <div className="bg-black/40 backdrop-blur-lg p-6 rounded-xl border border-neonPurple/30 text-center">
            <div className="text-2xl font-cyber font-bold text-neonPurple mb-2">
              Active
            </div>
            <div className="text-gray-400 font-cyber text-sm">Account Status</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
