import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { validateTransfer, validateDeposit, validateWithdraw, formatCurrency } from '../../lib/validation.js';
import { createTransaction, getUsers, updateUserBalance } from '../../lib/db.js';
import Button from '../Button.jsx';

export default function TransferForm({ currentUser, onTransactionComplete }) {
  const [activeTab, setActiveTab] = useState('transfer');
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const users = await getUsers();
      const recipient = users.find(u => 
        u.username === formData.recipient || u.email === formData.recipient
      );

      if (!recipient) {
        setError('Recipient not found');
        setLoading(false);
        return;
      }

      if (recipient.locked) {
        setError('Recipient account is locked');
        setLoading(false);
        return;
      }

      const validation = validateTransfer(
        currentUser.id, 
        recipient.id, 
        formData.amount, 
        currentUser.balance
      );

      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        setLoading(false);
        return;
      }

      const amount = parseFloat(formData.amount);

      // Update sender balance
      await updateUserBalance(currentUser.id, currentUser.balance - amount);
      
      // Update recipient balance
      await updateUserBalance(recipient.id, recipient.balance + amount);

      // Create transaction record
      createTransaction(
        currentUser.id,
        recipient.id,
        amount,
        'transfer',
        formData.description || `Transfer to ${recipient.username}`
      );

      setSuccess(`Successfully transferred ${formatCurrency(amount)} to ${recipient.username}`);
      setFormData({ recipient: '', amount: '', description: '' });
      
      if (onTransactionComplete) {
        onTransactionComplete();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const validation = validateDeposit(formData.amount);
      
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        setLoading(false);
        return;
      }

      const amount = parseFloat(formData.amount);

      // Update user balance
      await updateUserBalance(currentUser.id, currentUser.balance + amount);

      // Create transaction record
      createTransaction(
        'system',
        currentUser.id,
        amount,
        'deposit',
        formData.description || 'Self deposit'
      );

      setSuccess(`Successfully deposited ${formatCurrency(amount)}`);
      setFormData({ recipient: '', amount: '', description: '' });
      
      if (onTransactionComplete) {
        onTransactionComplete();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const validation = validateWithdraw(formData.amount, currentUser.balance);
      
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        setLoading(false);
        return;
      }

      const amount = parseFloat(formData.amount);

      // Update user balance
      await updateUserBalance(currentUser.id, currentUser.balance - amount);

      // Create transaction record
      createTransaction(
        currentUser.id,
        'system',
        amount,
        'withdraw',
        formData.description || 'Cash withdrawal'
      );

      setSuccess(`Successfully withdrew ${formatCurrency(amount)}`);
      setFormData({ recipient: '', amount: '', description: '' });
      
      if (onTransactionComplete) {
        onTransactionComplete();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'transfer', label: 'Transfer', icon: '↗️' },
    { id: 'deposit', label: 'Deposit', icon: '⬇️' },
    { id: 'withdraw', label: 'Withdraw', icon: '⬆️' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-black/40 backdrop-blur-lg rounded-xl border border-neonPurple/30 overflow-hidden"
    >
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 p-4 text-center font-cyber transition-colors duration-300 ${
              activeTab === tab.id
                ? 'bg-neonPurple/20 text-neonPurple border-b-2 border-neonPurple'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        <form onSubmit={
          activeTab === 'transfer' ? handleTransfer :
          activeTab === 'deposit' ? handleDeposit :
          handleWithdraw
        }>
          {/* Transfer fields */}
          {activeTab === 'transfer' && (
            <div className="mb-4">
              <label htmlFor="recipient" className="block text-sm font-cyber text-gray-300 mb-2">
                Recipient (Username or Email)
              </label>
              <input
                id="recipient"
                name="recipient"
                type="text"
                required
                value={formData.recipient}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/50 border border-neonTeal/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonTeal focus:ring-1 focus:ring-neonTeal transition-colors duration-300 font-cyber"
                placeholder="Enter username or email"
              />
            </div>
          )}

          {/* Amount field (all tabs) */}
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-cyber text-gray-300 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-cyber">₱</span>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                max="1000000"
                required
                value={formData.amount}
                onChange={handleChange}
                className="w-full pl-8 pr-4 py-3 bg-black/50 border border-neonPink/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonPink focus:ring-1 focus:ring-neonPink transition-colors duration-300 font-cyber"
                placeholder="0.00"
              />
            </div>
            {activeTab === 'withdraw' && (
              <p className="text-sm text-gray-400 font-cyber mt-1">
                Available: {formatCurrency(currentUser.balance)}
              </p>
            )}
          </div>

          {/* Description field (optional) */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-cyber text-gray-300 mb-2">
              Description (Optional)
            </label>
            <input
              id="description"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/50 border border-neonGreen/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonGreen focus:ring-1 focus:ring-neonGreen transition-colors duration-300 font-cyber"
              placeholder="Add a note (optional)"
            />
          </div>

          {/* Error and Success Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg font-cyber text-sm mb-4"
              role="alert"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-900/30 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg font-cyber text-sm mb-4"
              role="alert"
            >
              {success}
            </motion.div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Processing...' : 
             activeTab === 'transfer' ? 'Send Transfer' :
             activeTab === 'deposit' ? 'Deposit Funds' :
             'Withdraw Funds'}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}