import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { readJSON, writeJSON } from '../utils/fileOps.js';
import CyberpunkVisuals from '../components/Visuals/CyberpunkVisuals.jsx';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('session'));
    if (!session) window.location.href = '/login';
    else {
      readJSON('./data/users.json').then(users => {
        setUser(users.find(u => u.username === session.username));
      });
      readJSON('./data/transactions.json').then(setTransactions);
    }
  }, []);

  const handleDeposit = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) return setError('Invalid amount');
    const newBalance = user.balance + Number(amount);
    const updatedUser = { ...user, balance: newBalance };
    const users = await readJSON('./data/users.json');
    const updatedUsers = users.map(u => u.username === user.username ? updatedUser : u);
    await writeJSON('./data/users.json', updatedUsers);
    const newTx = {
      id: Date.now().toString(),
      type: 'deposit',
      amount: Number(amount),
      user: user.username,
      date: new Date().toISOString()
    };
    await writeJSON('./data/transactions.json', [...transactions, newTx]);
    setSuccess('Deposit successful!');
    setError('');
    setUser(updatedUser);
    setTransactions([...transactions, newTx]);
    setAmount('');
  };

  const handleWithdraw = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) return setError('Invalid amount');
    if (user.balance < Number(amount)) return setError('Insufficient funds');
    const newBalance = user.balance - Number(amount);
    const updatedUser = { ...user, balance: newBalance };
    const users = await readJSON('./data/users.json');
    const updatedUsers = users.map(u => u.username === user.username ? updatedUser : u);
    await writeJSON('./data/users.json', updatedUsers);
    const newTx = {
      id: Date.now().toString(),
      type: 'withdraw',
      amount: Number(amount),
      user: user.username,
      date: new Date().toISOString()
    };
    await writeJSON('./data/transactions.json', [...transactions, newTx]);
    setSuccess('Withdrawal successful!');
    setError('');
    setUser(updatedUser);
    setTransactions([...transactions, newTx]);
    setAmount('');
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <CyberpunkVisuals />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 text-center p-8 rounded-xl bg-glass shadow-neon w-full max-w-2xl"
      >
        <h2 className="text-4xl font-cyber text-neonTeal mb-4">Welcome, {user?.username}</h2>
        <div className="mb-6 text-neonPurple text-2xl">Balance: ${user?.balance?.toLocaleString()}</div>
        <div className="flex gap-4 mb-6">
          <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="px-4 py-2 rounded bg-black text-white border-b-2 border-neonTeal focus:outline-none" />
          <button onClick={handleDeposit} className="px-6 py-2 bg-neonGreen rounded-full font-bold text-black shadow-neon hover:bg-neonTeal transition">Deposit</button>
          <button onClick={handleWithdraw} className="px-6 py-2 bg-neonPink rounded-full font-bold text-white shadow-neon hover:bg-neonPurple transition">Withdraw</button>
        </div>
        {error && <div className="text-neonPink mb-2">{error}</div>}
        {success && <div className="text-neonGreen mb-2">{success}</div>}
        <h3 className="text-xl font-cyber text-neonPurple mt-8 mb-2">Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left bg-black bg-opacity-60 rounded-lg">
            <thead>
              <tr className="text-neonTeal">
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.filter(tx => tx.user === user?.username).map(tx => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="border-b border-neonPurple"
                >
                  <td>{new Date(tx.date).toLocaleString()}</td>
                  <td className={tx.type === 'deposit' ? 'text-neonGreen' : 'text-neonPink'}>{tx.type}</td>
                  <td>${tx.amount.toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={() => { localStorage.removeItem('session'); window.location.href = '/login'; }} className="mt-8 px-6 py-2 bg-neonPurple rounded-full font-bold text-white shadow-neon hover:bg-neonTeal transition glitch">Logout</button>
      </motion.div>
    </div>
  );
}
