import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { readJSON, writeJSON } from '../utils/fileOps.js';
import CyberpunkVisuals from '../components/Visuals/CyberpunkVisuals.jsx';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [action, setAction] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('session'));
    if (!session || session.role !== 'admin') window.location.href = '/login';
    readJSON('./data/users.json').then(setUsers);
    readJSON('./data/transactions.json').then(setTransactions);
    readJSON('./data/logs.json').then(setLogs);
  }, []);

  const logAction = async (desc) => {
    const newLog = { id: Date.now().toString(), desc, date: new Date().toISOString() };
    await writeJSON('./data/logs.json', [...logs, newLog]);
    setLogs([...logs, newLog]);
  };

  const handleFund = async (type) => {
    if (!selectedUser || !amount || isNaN(amount)) return setMessage('Invalid input');
    const user = users.find(u => u.id === selectedUser);
    const newBalance = type === 'add' ? user.balance + Number(amount) : user.balance - Number(amount);
    const updatedUser = { ...user, balance: newBalance };
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    await writeJSON('./data/users.json', updatedUsers);
    setUsers(updatedUsers);
    await logAction(`${type === 'add' ? 'Added' : 'Deducted'} $${amount} to ${user.username}`);
    setMessage('Action successful');
    setAmount('');
  };

  const handleLock = async (lock) => {
    if (!selectedUser) return setMessage('Select a user');
    const user = users.find(u => u.id === selectedUser);
    const updatedUser = { ...user, locked: lock };
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    await writeJSON('./data/users.json', updatedUsers);
    setUsers(updatedUsers);
    await logAction(`${lock ? 'Locked' : 'Unlocked'} account for ${user.username}`);
    setMessage('Action successful');
  };

  const handleDelete = async () => {
    if (!selectedUser) return setMessage('Select a user');
    const user = users.find(u => u.id === selectedUser);
    const updatedUsers = users.filter(u => u.id !== user.id);
    await writeJSON('./data/users.json', updatedUsers);
    setUsers(updatedUsers);
    await logAction(`Deleted user ${user.username}`);
    setMessage('User deleted');
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return setMessage('Select a user');
    const user = users.find(u => u.id === selectedUser);
    const updatedUser = { ...user, password: 'admin' };
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    await writeJSON('./data/users.json', updatedUsers);
    setUsers(updatedUsers);
    await logAction(`Reset password for ${user.username}`);
    setMessage('Password reset');
  };

  const handleMockUser = async () => {
    const newUser = {
      id: Date.now().toString(),
      username: `mock${Date.now()}`,
      password: 'mockpw',
      role: 'user',
      locked: false,
      balance: Math.floor(Math.random() * 10000),
      createdAt: new Date().toISOString()
    };
    await writeJSON('./data/users.json', [...users, newUser]);
    setUsers([...users, newUser]);
    await logAction(`Created mock user ${newUser.username}`);
    setMessage('Mock user created');
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <CyberpunkVisuals />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 text-center p-8 rounded-xl bg-glass shadow-neon w-full max-w-3xl"
      >
        <h2 className="text-4xl font-cyber text-neonPurple mb-4">Admin Panel</h2>
        <div className="mb-6">
          <select value={selectedUser || ''} onChange={e => setSelectedUser(e.target.value)} className="px-4 py-2 rounded bg-black text-white border-b-2 border-neonTeal focus:outline-none">
            <option value="">Select User</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
          </select>
        </div>
        <div className="flex gap-4 mb-6">
          <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="px-4 py-2 rounded bg-black text-white border-b-2 border-neonTeal focus:outline-none" />
          <button onClick={() => handleFund('add')} className="px-6 py-2 bg-neonGreen rounded-full font-bold text-black shadow-neon hover:bg-neonTeal transition">Add Funds</button>
          <button onClick={() => handleFund('deduct')} className="px-6 py-2 bg-neonPink rounded-full font-bold text-white shadow-neon hover:bg-neonPurple transition">Deduct Funds</button>
        </div>
        <div className="flex gap-4 mb-6">
          <button onClick={() => handleLock(true)} className="px-6 py-2 bg-neonPurple rounded-full font-bold text-white shadow-neon hover:bg-neonTeal transition">Lock Account</button>
          <button onClick={() => handleLock(false)} className="px-6 py-2 bg-neonTeal rounded-full font-bold text-black shadow-neon hover:bg-neonPurple transition">Unlock Account</button>
          <button onClick={handleDelete} className="px-6 py-2 bg-neonPink rounded-full font-bold text-white shadow-neon hover:bg-neonGreen transition">Delete Account</button>
          <button onClick={handleResetPassword} className="px-6 py-2 bg-neonGreen rounded-full font-bold text-black shadow-neon hover:bg-neonPink transition">Reset Password</button>
        </div>
        <button onClick={handleMockUser} className="mb-6 px-6 py-2 bg-neonTeal rounded-full font-bold text-black shadow-neon hover:bg-neonPurple transition">Create Mock User</button>
        <div className="mb-6">
          <h3 className="text-xl font-cyber text-neonPurple mb-2">Audit Log</h3>
          <div className="overflow-x-auto max-h-40">
            <table className="w-full text-left bg-black bg-opacity-60 rounded-lg">
              <thead>
                <tr className="text-neonTeal">
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(-20).reverse().map(log => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="border-b border-neonPurple"
                  >
                    <td>{new Date(log.date).toLocaleString()}</td>
                    <td>{log.desc}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <button onClick={() => { localStorage.removeItem('session'); window.location.href = '/login'; }} className="mt-8 px-6 py-2 bg-neonPurple rounded-full font-bold text-white shadow-neon hover:bg-neonTeal transition glitch">Logout</button>
        {message && <div className="text-neonGreen mt-4">{message}</div>}
      </motion.div>
    </div>
  );
}
