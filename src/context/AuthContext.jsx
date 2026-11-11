import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getUser,
  getUsers,
  saveUser,
  getCurrentUserEmail,
  setCurrentUserEmail,
  isAdminLoggedIn,
  setAdminLoggedIn
} from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadSession = () => {
    const email = getCurrentUserEmail();
    if (email) {
      const u = getUser(email);
      setCurrentUser(u);
    } else {
      setCurrentUser(null);
    }
    setIsAdmin(isAdminLoggedIn());
    setLoading(false);
  };

  useEffect(() => {
    loadSession();
  }, []);

  const refreshUser = () => {
    const email = getCurrentUserEmail();
    if (email) {
      const u = getUser(email);
      setCurrentUser(u);
    }
  };

  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const users = getUsers();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);
    if (!found) {
      return { success: false, message: 'Incorrect email or password. Enter the correct details.' };
    }
    setCurrentUserEmail(found.email);
    setCurrentUser(found);
    return { success: true, message: 'Login details are correct.' };
  };

  const signup = (name, email, password) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanName || !cleanEmail || !password) {
      return { success: false, message: 'All fields are required.' };
    }
    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Email already exists! Please use another email.' };
    }

    const newUser = {
      name: cleanName,
      email: cleanEmail,
      password: password,
      transactions: [],
      accounts: [
        { id: 'cash', name: 'Cash', type: 'Cash' },
        { id: 'bank', name: 'Bank Account', type: 'Bank' }
      ],
      budgets: {},
      goals: [],
      recurring: []
    };

    saveUser(newUser);
    return { success: true, message: 'Account created successfully.' };
  };

  const logout = () => {
    setCurrentUserEmail(null);
    setCurrentUser(null);
  };

  const adminLogin = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'admin@gmail.com' && password === 'admin123') {
      setAdminLoggedIn(true);
      setIsAdmin(true);
      return { success: true, message: 'Admin login details are correct.' };
    }
    return { success: false, message: 'Incorrect admin email or password. Enter the correct details.' };
  };

  const adminLogout = () => {
    setAdminLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        loading,
        login,
        signup,
        logout,
        adminLogin,
        adminLogout,
        refreshUser
      }}
    >
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
