import bcrypt from 'bcryptjs';
import { getUsers, saveUsers, addAuditLog } from './db.js';

// Hash password
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Compare password
export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Register new user
export async function registerUser(username, email, password) {
  const users = await getUsers();
  
  // Check if user already exists
  const existingUser = users.find(u => 
    u.username === username || u.email === email
  );
  
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  // Create new user
  const hashedPassword = await hashPassword(password);
  const newUser = {
    id: Date.now().toString(),
    username,
    email,
    password: hashedPassword,
    role: 'user',
    locked: false,
    balance: 0,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveUsers(users);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

// Login user
export async function loginUser(emailOrUsername, password) {
  const users = await getUsers();
  
  // Find user by email or username
  const user = users.find(u => 
    u.email === emailOrUsername || u.username === emailOrUsername
  );
  
  if (!user) {
    throw new Error('User not found');
  }
  
  if (user.locked) {
    throw new Error('Account is locked');
  }
  
  // Compare password
  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid password');
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Get user by ID
export async function getUserById(userId) {
  const users = await getUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Lock/unlock user account (admin only)
export async function toggleUserLock(userId, adminUser = 'Zeke') {
  const users = await getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  users[userIndex].locked = !users[userIndex].locked;
  saveUsers(users);
  
  // Add audit log
  addAuditLog('TOGGLE_LOCK', {
    userId,
    locked: users[userIndex].locked,
    username: users[userIndex].username
  }, adminUser);
  
  const { password: _, ...userWithoutPassword } = users[userIndex];
  return userWithoutPassword;
}

// Reset user password (admin only)
export async function resetUserPassword(userId, newPassword, adminUser = 'Zeke') {
  const users = await getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  const hashedPassword = await hashPassword(newPassword);
  users[userIndex].password = hashedPassword;
  saveUsers(users);
  
  // Add audit log
  addAuditLog('RESET_PASSWORD', {
    userId,
    username: users[userIndex].username
  }, adminUser);
  
  const { password: _, ...userWithoutPassword } = users[userIndex];
  return userWithoutPassword;
}

// Delete user account (admin only)
export async function deleteUser(userId, adminUser = 'Zeke') {
  const users = await getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  const deletedUser = users[userIndex];
  users.splice(userIndex, 1);
  saveUsers(users);
  
  // Add audit log
  addAuditLog('DELETE_USER', {
    userId,
    username: deletedUser.username,
    email: deletedUser.email
  }, adminUser);
  
  return { success: true };
}

// Create mock/test users (admin only)
export async function createMockUsers(adminUser = 'Zeke') {
  const mockUsers = [
    {
      username: 'alice_cyber',
      email: 'alice@zynpay.com',
      password: 'password123',
      balance: 5000
    },
    {
      username: 'bob_neon',
      email: 'bob@zynpay.com', 
      password: 'password123',
      balance: 3000
    },
    {
      username: 'charlie_grid',
      email: 'charlie@zynpay.com',
      password: 'password123',
      balance: 7500
    }
  ];
  
  const users = await getUsers();
  const createdUsers = [];
  
  for (const mockUser of mockUsers) {
    // Check if user already exists
    const existingUser = users.find(u => 
      u.username === mockUser.username || u.email === mockUser.email
    );
    
    if (!existingUser) {
      const hashedPassword = await hashPassword(mockUser.password);
      const newUser = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        username: mockUser.username,
        email: mockUser.email,
        password: hashedPassword,
        role: 'user',
        locked: false,
        balance: mockUser.balance,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      const { password: _, ...userWithoutPassword } = newUser;
      createdUsers.push(userWithoutPassword);
    }
  }
  
  if (createdUsers.length > 0) {
    saveUsers(users);
    
    // Add audit log
    addAuditLog('CREATE_MOCK_USERS', {
      count: createdUsers.length,
      usernames: createdUsers.map(u => u.username)
    }, adminUser);
  }
  
  return createdUsers;
}