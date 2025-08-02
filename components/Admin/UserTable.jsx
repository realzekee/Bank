import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUsers, addFunds, deductFunds, toggleUserLock, resetUserPassword, deleteUser, createMockUsers } from '../../lib/auth.js';
import { formatCurrency, formatDate } from '../../lib/validation.js';
import Button from '../Button.jsx';

export default function UserTable({ onUserUpdate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionValue, setActionValue] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const userData = await getUsers();
      setUsers(userData.filter(u => u.role !== 'admin')); // Don't show admin in user table
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setActionValue('');
    setShowActionModal(true);
  };

  const executeAction = async () => {
    if (!selectedUser) return;

    const actionKey = `${actionType}-${selectedUser.id}`;
    setActionLoading({ ...actionLoading, [actionKey]: true });

    try {
      switch (actionType) {
        case 'addFunds':
          await addFunds(selectedUser.id, parseFloat(actionValue));
          break;
        case 'deductFunds':
          await deductFunds(selectedUser.id, parseFloat(actionValue));
          break;
        case 'toggleLock':
          await toggleUserLock(selectedUser.id);
          break;
        case 'resetPassword':
          await resetUserPassword(selectedUser.id, actionValue);
          break;
        case 'deleteUser':
          await deleteUser(selectedUser.id);
          break;
      }

      await loadUsers();
      if (onUserUpdate) onUserUpdate();
      setShowActionModal(false);
    } catch (error) {
      console.error('Error executing action:', error);
    } finally {
      setActionLoading({ ...actionLoading, [actionKey]: false });
    }
  };

  const createTestUsers = async () => {
    setLoading(true);
    try {
      await createMockUsers();
      await loadUsers();
      if (onUserUpdate) onUserUpdate();
    } catch (error) {
      console.error('Error creating test users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-black/40 backdrop-blur-lg p-8 rounded-xl border border-neonPurple/30 text-center">
        <div className="w-8 h-8 border-2 border-neonPurple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400 font-cyber">Loading users...</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-black/40 backdrop-blur-lg rounded-xl border border-neonPurple/30 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-cyber text-neonPurple mb-2">User Management</h3>
            <p className="text-gray-400 font-cyber text-sm">Manage all user accounts</p>
          </div>
          <Button onClick={createTestUsers} variant="secondary" size="sm">
            Create Test Users
          </Button>
        </div>

        {users.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-neonPurple to-neonTeal rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-cyber text-gray-300 mb-2">No Users Found</h4>
            <p className="text-gray-500 font-cyber mb-4">Create some test users to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-cyber text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-cyber text-gray-400 uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-4 text-left text-xs font-cyber text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-cyber text-gray-400 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-cyber text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="hover:bg-white/5 transition-colors duration-300"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-cyber text-white">{user.username}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-cyber text-neonTeal">
                        {formatCurrency(user.balance)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-cyber rounded-full ${
                        user.locked 
                          ? 'bg-red-900/30 text-red-300 border border-red-500/30'
                          : 'bg-green-900/30 text-green-300 border border-green-500/30'
                      }`}>
                        {user.locked ? 'Locked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-cyber">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAction(user, 'addFunds')}
                          className="text-neonGreen hover:text-green-300 font-cyber text-sm transition-colors duration-300"
                        >
                          Add $
                        </button>
                        <button
                          onClick={() => handleAction(user, 'deductFunds')}
                          className="text-neonPink hover:text-pink-300 font-cyber text-sm transition-colors duration-300"
                        >
                          Deduct $
                        </button>
                        <button
                          onClick={() => handleAction(user, 'toggleLock')}
                          className="text-neonTeal hover:text-teal-300 font-cyber text-sm transition-colors duration-300"
                        >
                          {user.locked ? 'Unlock' : 'Lock'}
                        </button>
                        <button
                          onClick={() => handleAction(user, 'resetPassword')}
                          className="text-yellow-400 hover:text-yellow-300 font-cyber text-sm transition-colors duration-300"
                        >
                          Reset PW
                        </button>
                        <button
                          onClick={() => handleAction(user, 'deleteUser')}
                          className="text-red-400 hover:text-red-300 font-cyber text-sm transition-colors duration-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 backdrop-blur-lg p-6 rounded-xl border border-neonPurple/30 max-w-md w-full mx-4"
          >
            <h4 className="text-lg font-cyber text-neonPurple mb-4">
              {actionType === 'addFunds' && 'Add Funds'}
              {actionType === 'deductFunds' && 'Deduct Funds'}
              {actionType === 'toggleLock' && (selectedUser?.locked ? 'Unlock Account' : 'Lock Account')}
              {actionType === 'resetPassword' && 'Reset Password'}
              {actionType === 'deleteUser' && 'Delete User'}
            </h4>

            <p className="text-gray-400 font-cyber mb-4">
              User: <span className="text-white">{selectedUser?.username}</span>
            </p>

            {(actionType === 'addFunds' || actionType === 'deductFunds') && (
              <div className="mb-4">
                <label className="block text-sm font-cyber text-gray-300 mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={actionValue}
                  onChange={(e) => setActionValue(e.target.value)}
                  className="w-full px-4 py-2 bg-black/50 border border-neonTeal/30 rounded-lg text-white font-cyber"
                  placeholder="Enter amount"
                />
              </div>
            )}

            {actionType === 'resetPassword' && (
              <div className="mb-4">
                <label className="block text-sm font-cyber text-gray-300 mb-2">New Password</label>
                <input
                  type="password"
                  value={actionValue}
                  onChange={(e) => setActionValue(e.target.value)}
                  className="w-full px-4 py-2 bg-black/50 border border-neonTeal/30 rounded-lg text-white font-cyber"
                  placeholder="Enter new password"
                />
              </div>
            )}

            {actionType === 'deleteUser' && (
              <div className="bg-red-900/30 border border-red-500/30 text-red-300 p-4 rounded-lg mb-4">
                <p className="font-cyber text-sm">
                  This action cannot be undone. The user account will be permanently deleted.
                </p>
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                onClick={() => setShowActionModal(false)}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={executeAction}
                variant={actionType === 'deleteUser' ? 'danger' : 'primary'}
                loading={actionLoading[`${actionType}-${selectedUser?.id}`]}
                className="flex-1"
              >
                Confirm
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}