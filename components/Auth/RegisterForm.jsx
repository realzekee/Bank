import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { registerUser } from '../../lib/auth.js';
import { validateEmail, validateUsername, validatePassword, sanitizeInput } from '../../lib/validation.js';
import Button from '../Button.jsx';

export default function RegisterForm({ onRegister }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setFormData({
      ...formData,
      [name]: sanitizedValue
    });

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateUsername(formData.username)) {
      newErrors.username = 'Username must be 3-20 characters, alphanumeric and underscores only';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const user = await registerUser(formData.username, formData.email, formData.password);
      onRegister(user);
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-black/40 backdrop-blur-lg p-8 rounded-xl border border-neonTeal/30 shadow-2xl shadow-neonTeal/20 w-full max-w-md"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-cyber text-neonTeal mb-2">Create Account</h2>
        <p className="text-gray-400 font-cyber">Join the cyberpunk banking revolution</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-cyber text-gray-300 mb-2">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-black/50 border border-neonPurple/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonPurple focus:ring-1 focus:ring-neonPurple transition-colors duration-300 font-cyber"
            placeholder="Choose a username"
          />
          {errors.username && (
            <p className="mt-1 text-red-300 text-sm font-cyber">{errors.username}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-cyber text-gray-300 mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-black/50 border border-neonTeal/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonTeal focus:ring-1 focus:ring-neonTeal transition-colors duration-300 font-cyber"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="mt-1 text-red-300 text-sm font-cyber">{errors.email}</p>
          )}
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
            placeholder="Create a password"
          />
          {errors.password && (
            <p className="mt-1 text-red-300 text-sm font-cyber">{errors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-cyber text-gray-300 mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-black/50 border border-neonGreen/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonGreen focus:ring-1 focus:ring-neonGreen transition-colors duration-300 font-cyber"
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-red-300 text-sm font-cyber">{errors.confirmPassword}</p>
          )}
        </div>

        {errors.general && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg font-cyber text-sm"
            role="alert"
          >
            {errors.general}
          </motion.div>
        )}

        <Button
          type="submit"
          loading={loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Creating Account...' : 'Register'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400 font-cyber text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-neonPurple hover:text-neonTeal transition-colors duration-300">
            Login here
          </a>
        </p>
      </div>
    </motion.div>
  );
}
