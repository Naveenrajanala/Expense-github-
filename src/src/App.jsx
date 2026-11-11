import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// User Pages
import Home from './pages/Home';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Expense from './pages/Expense';
import Income from './pages/Income';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Recurring from './pages/Recurring';
import Accounts from './pages/Accounts';
import Reports from './pages/Reports';
import Profile from './pages/Profile';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTransactions from './pages/admin/AdminTransactions';

export default function App() {
  return (
    <Routes>
      {/* Public / Auth routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Home />} />
      <Route path="/index.html" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup.html" element={<Signup />} />

      {/* Admin Auth */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin-login.html" element={<AdminLogin />} />

      {/* Protected User Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="user">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-dashboard.html"
        element={
          <ProtectedRoute role="user">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expense"
        element={
          <ProtectedRoute role="user">
            <Expense />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expense.html"
        element={
          <ProtectedRoute role="user">
            <Expense />
          </ProtectedRoute>
        }
      />
      <Route
        path="/income"
        element={
          <ProtectedRoute role="user">
            <Income />
          </ProtectedRoute>
        }
      />
      <Route
        path="/income.html"
        element={
          <ProtectedRoute role="user">
            <Income />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute role="user">
            <Transactions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions.html"
        element={
          <ProtectedRoute role="user">
            <Transactions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/budgets"
        element={
          <ProtectedRoute role="user">
            <Budgets />
          </ProtectedRoute>
        }
      />
      <Route
        path="/budgets.html"
        element={
          <ProtectedRoute role="user">
            <Budgets />
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <ProtectedRoute role="user">
            <Goals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals.html"
        element={
          <ProtectedRoute role="user">
            <Goals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recurring"
        element={
          <ProtectedRoute role="user">
            <Recurring />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recurring.html"
        element={
          <ProtectedRoute role="user">
            <Recurring />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accounts"
        element={
          <ProtectedRoute role="user">
            <Accounts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accounts.html"
        element={
          <ProtectedRoute role="user">
            <Accounts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute role="user">
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports.html"
        element={
          <ProtectedRoute role="user">
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute role="user">
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile.html"
        element={
          <ProtectedRoute role="user">
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard.html"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute role="admin">
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-users.html"
        element={
          <ProtectedRoute role="admin">
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/transactions"
        element={
          <ProtectedRoute role="admin">
            <AdminTransactions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-transactions.html"
        element={
          <ProtectedRoute role="admin">
            <AdminTransactions />
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
