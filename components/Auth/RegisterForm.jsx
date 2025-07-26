import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { hashPassword, getUsers, saveUsers } from '../../utils/auth.js';

export default function RegisterForm({ onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const users = await getUsers();
    if (users.find(u => u.username === username)) {
      setError('Username already exists');
      return;
    }
    const newUser = {
      id: Date.now().toString(),
      username,
      password: hashPassword(password),
      role: 'user',
      locked: false,
      balance: 0,
      createdAt: new Date().toISOString()
    };
    await saveUsers([...users, newUser]);
    setSuccess('Registration successful!');
    setError('');
    onRegister(newUser);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="bg-glass p-8 rounded-xl shadow-neon w-96"
      onSubmit={handleRegister}
    >
      <h2 className="text-3xl font-cyber text-neonTeal mb-6">Register</h2>
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full mb-4 px-4 py-2 rounded bg-black text-white border-b-2 border-neonTeal focus:outline-none" />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full mb-4 px-4 py-2 rounded bg-black text-white border-b-2 border-neonPink focus:outline-none" />
      {error && <div className="text-neonPink mb-2">{error}</div>}
      {success && <div className="text-neonGreen mb-2">{success}</div>}
      <button type="submit" className="w-full py-3 bg-neonTeal rounded-full font-bold text-white shadow-neon hover:bg-neonPurple transition">Register</button>
    </motion.form>
  );
}
