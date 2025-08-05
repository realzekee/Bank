
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { users as initialUsers } from '@/lib/mock-data';

type User = {
  id: string;
  username: string;
  email: string;
  balance: number;
  isAdmin: boolean;
};

type StoredUser = User & {
    password?: string;
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User | null>;
  logout: () => void;
  signup: (username: string, email: string, pass: string) => Promise<User | null>;
  updateUserBalance: (userId: string, amount: number) => number | null;
  refreshUser: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'zynpay_session';
const USERS_DB_KEY = 'zynpay_users_db';

// This function loads users from localStorage or initializes with mock data
const loadUsers = (): StoredUser[] => {
    if (typeof window === 'undefined') return initialUsers;
    try {
        const usersJson = localStorage.getItem(USERS_DB_KEY);
        if (usersJson) {
            return JSON.parse(usersJson);
        }
    } catch (error) {
        console.error("Failed to load users from localStorage", error);
    }
    // If nothing in localStorage, initialize with mock data and save it.
    const users = [...initialUsers];
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    return users;
}

// This function saves the users array to localStorage
const saveUsers = (users: StoredUser[]) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    } catch (error) {
        console.error("Failed to save users to localStorage", error);
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<StoredUser[]>([]);
  const router = useRouter();

  useEffect(() => {
    const allUsers = loadUsers();
    setUsers(allUsers);

    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (sessionData) {
        const sessionUser = JSON.parse(sessionData) as User;
        const storedUser = allUsers.find(u => u.id === sessionUser.id);
        if (storedUser) {
          // Sync balance from our "DB"
          sessionUser.balance = storedUser.balance;
          setUser(sessionUser);
        } else {
           // User in session not found in DB, clear session
          localStorage.removeItem(SESSION_KEY);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Failed to parse session data', error);
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    const foundUser = users.find(
      (u) => u.email === email && u.password === pass
    );
    if (foundUser) {
      const userData = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        balance: foundUser.balance,
        isAdmin: foundUser.isAdmin,
      };
      setUser(userData);
      localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
      setLoading(false);
      return userData;
    }
    setLoading(false);
    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    router.push('/login');
  };

  const signup = async (username: string, email: string, pass: string): Promise<User | null> => {
    setLoading(true);
    
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      setLoading(false);
      return null; 
    }
    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      username,
      email,
      password: pass, // In a real app, hash this!
      balance: 0,
      isAdmin: false,
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsers(updatedUsers);

    const userData = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        balance: newUser.balance,
        isAdmin: newUser.isAdmin,
    };
    setUser(userData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    setLoading(false);
    return userData;
  };

  const updateUserBalance = (userId: string, amount: number) => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      const updatedUsers = [...users];
      updatedUsers[userIndex].balance += amount;
      setUsers(updatedUsers);
      saveUsers(updatedUsers);
      return updatedUsers[userIndex].balance;
    }
    return null;
  };

  const refreshUser = () => {
    setLoading(true);
    const allUsers = loadUsers();
    setUsers(allUsers);
     try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (sessionData) {
        const sessionUser = JSON.parse(sessionData) as User;
        const storedUser = allUsers.find(u => u.id === sessionUser.id);
        if (storedUser) {
          sessionUser.balance = storedUser.balance; // Make sure balance is up to date
          setUser(sessionUser);
        } else {
          setUser(null);
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch (error) {
      console.error('Failed to parse session data', error);
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup, updateUserBalance, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
