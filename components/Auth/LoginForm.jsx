import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { loginUser } from '../../lib/auth.js';
import Button from '../Button.jsx';

export default function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await loginUser(formData.emailOrUsername, formData.password);
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-black/40 backdrop-blur-lg p-8 rounded-xl border border-neonPurple/30 shadow-2xl shadow-neonPurple/20 w-full max-w-md"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-cyber text-neonPurple mb-2">Access Terminal</h2>
        <p className="text-gray-400 font-cyber">Enter your credentials to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="emailOrUsername" className="block text-sm font-cyber text-gray-300 mb-2">
            Username or Email
          </label>
          <input
            id="emailOrUsername"
            name="emailOrUsername"
            type="text"
            required
            value={formData.emailOrUsername}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-black/50 border border-neonTeal/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonTeal focus:ring-1 focus:ring-neonTeal transition-colors duration-300 font-cyber"
            placeholder="Enter username or email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-cyber text-gray-300 mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-black/50 border border-neonPink/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonPink focus:ring-1 focus:ring-neonPink transition-colors duration-300 font-cyber"
            placeholder="Enter password"
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg font-cyber text-sm"
            role="alert"
          >
            {error}
          </motion.div>
        )}

        <Button
          type="submit"
          loading={loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Authenticating...' : 'Login'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400 font-cyber text-sm">
          Don't have an account?{' '}
          <a href="/register" className="text-neonTeal hover:text-neonPurple transition-colors duration-300">
            Register here
          </a>
        </p>
      </div>
    </motion.div>
  );
}
