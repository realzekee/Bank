import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { hashPassword, comparePassword, getUsers } from '../utils/auth.js';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const users = await getUsers();
    const user = users.find(u => u.username === username);
    if (!user) return setError('User not found');
    if (user.locked) return setError('Account locked');
    if (!comparePassword(password, user.password)) return setError('Invalid password');
    localStorage.setItem('session', JSON.stringify({ username: user.username, role: user.role }));
    window.location.href = user.role === 'admin' ? '/admin' : '/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-glass p-8 rounded-xl shadow-neon w-96"
        onSubmit={handleLogin}
      >
        <h2 className="text-3xl font-cyber text-neonPurple mb-6">Login</h2>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full mb-4 px-4 py-2 rounded bg-black text-white border-b-2 border-neonTeal focus:outline-none" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full mb-4 px-4 py-2 rounded bg-black text-white border-b-2 border-neonPink focus:outline-none" />
        {error && <div className="text-neonPink mb-2">{error}</div>}
        <button type="submit" className="w-full py-3 bg-neonPurple rounded-full font-bold text-white shadow-neon hover:bg-neonTeal transition">Login</button>
        <a href="/register" className="block mt-4 text-neonTeal hover:underline">Register</a>
      </motion.form>
    </div>
  );
}
