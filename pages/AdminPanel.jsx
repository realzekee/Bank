import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/middleware.js';
import { getUsers } from '../lib/auth.js';
import { getTransactions, getAuditLogs } from '../lib/db.js';
import { formatCurrency } from '../lib/validation.js';
import UserTable from '../components/Admin/UserTable.jsx';
import AuditLog from '../components/Admin/AuditLog.jsx';

export default function AdminPanel() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBalance: 0,
    totalTransactions: 0,
    activeUsers: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const users = await getUsers();
      const transactions = getTransactions();
      const auditLogs = getAuditLogs();

      const regularUsers = users.filter(u => u.role !== 'admin');
      const totalBalance = regularUsers.reduce((sum, u) => sum + u.balance, 0);
      const activeUsers = regularUsers.filter(u => !u.locked).length;

      setStats({
        totalUsers: regularUsers.length,
        totalBalance,
        totalTransactions: transactions.length,
        activeUsers,
        auditEntries: auditLogs.length
      });
    } catch (error) {
      console.error('Error loading admin stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading || loadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neonPurple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-cyber">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'audit', label: 'Audit Logs', icon: '📋' }
  ];

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
            Admin Control Panel
          </h1>
          <p className="text-gray-400 font-cyber">
            System administration and user management interface
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-black/40 backdrop-blur-lg rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-3 text-center font-cyber transition-all duration-300 rounded-lg ${
                  activeTab === tab.id
                    ? 'bg-neonPurple text-white shadow-lg shadow-neonPurple/50'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-black/60 to-neonPurple/20 backdrop-blur-lg p-6 rounded-xl border border-neonPurple/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-cyber text-gray-300">Total Users</h3>
                    <div className="w-12 h-12 bg-neonPurple/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                  </div>
                  <div className="text-3xl font-cyber font-bold text-neonPurple mb-2">
                    {stats.totalUsers}
                  </div>
                  <div className="text-sm text-gray-400 font-cyber">
                    {stats.activeUsers} active
                  </div>
                </div>

                <div className="bg-gradient-to-br from-black/60 to-neonTeal/20 backdrop-blur-lg p-6 rounded-xl border border-neonTeal/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-cyber text-gray-300">Total Balance</h3>
                    <div className="w-12 h-12 bg-neonTeal/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                  </div>
                  <div className="text-3xl font-cyber font-bold text-neonTeal mb-2">
                    {formatCurrency(stats.totalBalance)}
                  </div>
                  <div className="text-sm text-gray-400 font-cyber">
                    System-wide
                  </div>
                </div>

                <div className="bg-gradient-to-br from-black/60 to-neonGreen/20 backdrop-blur-lg p-6 rounded-xl border border-neonGreen/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-cyber text-gray-300">Transactions</h3>
                    <div className="w-12 h-12 bg-neonGreen/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🔄</span>
                    </div>
                  </div>
                  <div className="text-3xl font-cyber font-bold text-neonGreen mb-2">
                    {stats.totalTransactions}
                  </div>
                  <div className="text-sm text-gray-400 font-cyber">
                    All time
                  </div>
                </div>

                <div className="bg-gradient-to-br from-black/60 to-neonPink/20 backdrop-blur-lg p-6 rounded-xl border border-neonPink/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-cyber text-gray-300">Audit Logs</h3>
                    <div className="w-12 h-12 bg-neonPink/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📋</span>
                    </div>
                  </div>
                  <div className="text-3xl font-cyber font-bold text-neonPink mb-2">
                    {stats.auditEntries || 0}
                  </div>
                  <div className="text-sm text-gray-400 font-cyber">
                    Admin actions
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-black/40 backdrop-blur-lg p-6 rounded-xl border border-neonTeal/30">
                <h3 className="text-xl font-cyber text-neonTeal mb-4">System Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-neonGreen rounded-full animate-pulse"></div>
                    <span className="font-cyber text-gray-300">Banking System: Online</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-neonGreen rounded-full animate-pulse"></div>
                    <span className="font-cyber text-gray-300">Transaction Engine: Active</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-neonGreen rounded-full animate-pulse"></div>
                    <span className="font-cyber text-gray-300">Security Layer: Protected</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <UserTable onUserUpdate={loadStats} />
          )}

          {/* Audit Tab */}
          {activeTab === 'audit' && (
            <AuditLog />
          )}
        </div>
      </div>
    </div>
  );
}
