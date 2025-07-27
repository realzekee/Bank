import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { comparePassword, getUsers } from '../../utils/auth.js';

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const users = await getUsers();
      const user = users.find(u => u.username === username);
      if (!user) {
        setError('User not found');
        return;
      }
      if (user.locked) {
        setError('Account locked');
        return;
      }
      if (!comparePassword(password, user.password)) {
        setError('Invalid password');
        return;
      }
      onLogin(user);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="bg-glass p-8 rounded-xl shadow-neon w-96"
      onSubmit={handleLogin}
      aria-labelledby="login-form-title"
    >
      <h2 id="login-form-title" className="text-3xl font-cyber text-neonPurple mb-6">Login</h2>
      <label htmlFor="username" className="sr-only">Username</label>
      <input
        id="username"
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded bg-black text-white border-b-2 border-neonTeal focus:outline-none"
        required
      />
      <label htmlFor="password" className="sr-only">Password</label>
      <input
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded bg-black text-white border-b-2 border-neonPink focus:outline-none"
        required
      />
      {error && <div className="text-neonPink mb-2" role="alert">{error}</div>}
      <button
        type="submit"
        className="w-full py-3 bg-neonPurple rounded-full font-bold text-white shadow-neon hover:bg-neonTeal transition"
      >
        Login
      </button>
    </motion.form>
  );
}
