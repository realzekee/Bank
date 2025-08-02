import bcrypt from 'bcryptjs';

// File-based data storage paths
const DATA_DIR = '/home/runner/work/Bank/Bank/data';
const USERS_FILE = `${DATA_DIR}/users.json`;
const TRANSACTIONS_FILE = `${DATA_DIR}/transactions.json`;
const AUDIT_FILE = `${DATA_DIR}/audit.json`;

// Helper to read JSON files
async function readJsonFile(filepath) {
  try {
    const response = await fetch(filepath);
    if (!response.ok) throw new Error('File not found');
    return await response.json();
  } catch (error) {
    return [];
  }
}

// Helper to write JSON files (simulated with localStorage for frontend)
function writeJsonFile(filepath, data) {
  const key = filepath.split('/').pop().replace('.json', '');
  localStorage.setItem(key, JSON.stringify(data));
}

// Get users from storage
export async function getUsers() {
  try {
    const stored = localStorage.getItem('users');
    if (stored) return JSON.parse(stored);
    
    // Fallback to default data
    const defaultUsers = [
      {
        id: "admin",
        username: "Zeke",
        email: "admin@zynpay.com",
        password: await bcrypt.hash("admin", 10),
        role: "admin",
        locked: false,
        balance: 1000000,
        createdAt: new Date().toISOString()
      }
    ];
    
    localStorage.setItem('users', JSON.stringify(defaultUsers));
    return defaultUsers;
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
}

// Save users to storage
export function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Get transactions from storage
export function getTransactions() {
  try {
    const stored = localStorage.getItem('transactions');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
}

// Save transactions to storage
export function saveTransactions(transactions) {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Get audit logs from storage
export function getAuditLogs() {
  try {
    const stored = localStorage.getItem('audit');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading audit logs:', error);
    return [];
  }
}

// Save audit logs to storage
export function saveAuditLogs(logs) {
  localStorage.setItem('audit', JSON.stringify(logs));
}

// Add audit log entry
export function addAuditLog(action, details, adminUser = 'Zeke') {
  const logs = getAuditLogs();
  const newLog = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    admin: adminUser,
    action,
    details
  };
  
  logs.push(newLog);
  saveAuditLogs(logs);
  return newLog;
}

// Create new transaction
export function createTransaction(fromUserId, toUserId, amount, type, description = '') {
  const transactions = getTransactions();
  const newTransaction = {
    id: Date.now().toString(),
    fromUserId,
    toUserId,
    amount: parseFloat(amount),
    type, // 'deposit', 'withdraw', 'transfer'
    description,
    timestamp: new Date().toISOString()
  };
  
  transactions.push(newTransaction);
  saveTransactions(transactions);
  return newTransaction;
}

// Get user transactions
export function getUserTransactions(userId) {
  const transactions = getTransactions();
  return transactions.filter(t => 
    t.fromUserId === userId || t.toUserId === userId
  ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// Update user balance
export async function updateUserBalance(userId, newBalance) {
  const users = await getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex].balance = parseFloat(newBalance);
    saveUsers(users);
    return users[userIndex];
  }
  
  throw new Error('User not found');
}

// Add funds to user account
export async function addFunds(userId, amount, adminUser = 'Zeke') {
  const users = await getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    const oldBalance = users[userIndex].balance;
    users[userIndex].balance += parseFloat(amount);
    saveUsers(users);
    
    // Create transaction record
    createTransaction('system', userId, amount, 'deposit', 'Admin deposit');
    
    // Add audit log
    addAuditLog('ADD_FUNDS', {
      userId,
      amount: parseFloat(amount),
      oldBalance,
      newBalance: users[userIndex].balance
    }, adminUser);
    
    return users[userIndex];
  }
  
  throw new Error('User not found');
}

// Deduct funds from user account
export async function deductFunds(userId, amount, adminUser = 'Zeke') {
  const users = await getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    const oldBalance = users[userIndex].balance;
    users[userIndex].balance -= parseFloat(amount);
    saveUsers(users);
    
    // Create transaction record
    createTransaction(userId, 'system', amount, 'withdraw', 'Admin deduction');
    
    // Add audit log
    addAuditLog('DEDUCT_FUNDS', {
      userId,
      amount: parseFloat(amount),
      oldBalance,
      newBalance: users[userIndex].balance
    }, adminUser);
    
    return users[userIndex];
  }
  
  throw new Error('User not found');
}