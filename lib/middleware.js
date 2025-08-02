// Auth middleware for protecting routes
export function requireAuth(user) {
  return user && user.id;
}

// Admin middleware for protecting admin routes
export function requireAdmin(user) {
  return user && user.username === 'Zeke' && user.role === 'admin';
}

// Session storage helpers
export function setCurrentUser(user) {
  sessionStorage.setItem('currentUser', JSON.stringify(user));
}

export function getCurrentUser() {
  try {
    const stored = sessionStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export function clearCurrentUser() {
  sessionStorage.removeItem('currentUser');
}

// Auth context hook
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const AuthContext = createContext();

// Route protection component
export function ProtectedRoute({ children, user, requireAdminAccess = false }) {
  if (!requireAuth(user)) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdminAccess && !requireAdmin(user)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);
  
  const login = (userData) => {
    setUser(userData);
    setCurrentUser(userData);
  };
  
  const logout = () => {
    setUser(null);
    clearCurrentUser();
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}