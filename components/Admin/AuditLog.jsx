import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAuditLogs } from '../../lib/db.js';
import { formatDate } from '../../lib/validation.js';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const auditLogs = getAuditLogs();
      setLogs(auditLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = filter === 'all' ? logs : logs.filter(log => log.action === filter);

  const getActionIcon = (action) => {
    switch (action) {
      case 'ADD_FUNDS':
        return '💰';
      case 'DEDUCT_FUNDS':
        return '💸';
      case 'TOGGLE_LOCK':
        return '🔒';
      case 'RESET_PASSWORD':
        return '🔑';
      case 'DELETE_USER':
        return '🗑️';
      case 'CREATE_MOCK_USERS':
        return '👥';
      default:
        return '📝';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'ADD_FUNDS':
        return 'text-neonGreen';
      case 'DEDUCT_FUNDS':
        return 'text-neonPink';
      case 'TOGGLE_LOCK':
        return 'text-yellow-400';
      case 'RESET_PASSWORD':
        return 'text-neonTeal';
      case 'DELETE_USER':
        return 'text-red-400';
      case 'CREATE_MOCK_USERS':
        return 'text-neonPurple';
      default:
        return 'text-gray-400';
    }
  };

  const formatActionText = (log) => {
    const { action, details } = log;
    
    switch (action) {
      case 'ADD_FUNDS':
        return `Added ₱${details.amount} to user ${details.userId}`;
      case 'DEDUCT_FUNDS':
        return `Deducted ₱${details.amount} from user ${details.userId}`;
      case 'TOGGLE_LOCK':
        return `${details.locked ? 'Locked' : 'Unlocked'} account for ${details.username}`;
      case 'RESET_PASSWORD':
        return `Reset password for ${details.username}`;
      case 'DELETE_USER':
        return `Deleted user ${details.username} (${details.email})`;
      case 'CREATE_MOCK_USERS':
        return `Created ${details.count} test users: ${details.usernames.join(', ')}`;
      default:
        return action.replace(/_/g, ' ').toLowerCase();
    }
  };

  if (loading) {
    return (
      <div className="bg-black/40 backdrop-blur-lg p-8 rounded-xl border border-neonTeal/30 text-center">
        <div className="w-8 h-8 border-2 border-neonTeal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400 font-cyber">Loading audit logs...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-black/40 backdrop-blur-lg rounded-xl border border-neonTeal/30 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-cyber text-neonTeal mb-2">Admin Audit Log</h3>
            <p className="text-gray-400 font-cyber text-sm">Track all administrative actions</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-cyber text-gray-400">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-black/50 border border-neonTeal/30 rounded-lg px-3 py-2 text-white font-cyber text-sm focus:outline-none focus:border-neonTeal"
            >
              <option value="all">All Actions</option>
              <option value="ADD_FUNDS">Add Funds</option>
              <option value="DEDUCT_FUNDS">Deduct Funds</option>
              <option value="TOGGLE_LOCK">Lock/Unlock</option>
              <option value="RESET_PASSWORD">Reset Password</option>
              <option value="DELETE_USER">Delete User</option>
              <option value="CREATE_MOCK_USERS">Create Users</option>
            </select>
          </div>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-neonTeal to-neonPurple rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="text-lg font-cyber text-gray-300 mb-2">No Audit Logs</h4>
          <p className="text-gray-500 font-cyber">Administrative actions will be logged here</p>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {filteredLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="p-4 border-b border-gray-800 last:border-b-0 hover:bg-white/5 transition-colors duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-lg">{getActionIcon(log.action)}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-cyber text-sm ${getActionColor(log.action)}`}>
                      {log.action.replace(/_/g, ' ')}
                    </h4>
                    <span className="text-xs text-gray-500 font-cyber">
                      {formatDate(log.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 font-cyber text-sm mb-2">
                    {formatActionText(log)}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500 font-cyber">
                    <span>Admin: {log.admin}</span>
                    <span>ID: {log.id}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredLogs.length > 0 && (
        <div className="p-4 bg-gray-900/50 border-t border-gray-700">
          <p className="text-sm text-gray-400 font-cyber text-center">
            Showing {filteredLogs.length} of {logs.length} total logs
          </p>
        </div>
      )}
    </motion.div>
  );
}