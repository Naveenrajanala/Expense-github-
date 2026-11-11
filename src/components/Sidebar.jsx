import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ role = 'user' }) {
  const { logout, adminLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (role === 'admin') {
      adminLogout();
      navigate('/admin/login');
    } else {
      logout();
      navigate('/');
    }
  };

  const brandLink = role === 'admin' ? '/admin/dashboard' : '/dashboard';

  return (
    <aside className="sidebar">
      <NavLink className="side-brand" to={brandLink}>
        <span className="brand-mark">ET</span>
        <span>Expense<br />Tracker</span>
      </NavLink>

      <nav>
        {role === 'admin' ? (
          <>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span>⌂</span> Overview
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span>◯</span> Users
            </NavLink>
            <NavLink
              to="/admin/transactions"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span>≡</span> Transactions
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span>⌂</span> Overview
            </NavLink>
            <NavLink
              to="/income"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span>＋</span> Income
            </NavLink>
            <NavLink
              to="/expense"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span>−</span> Expenses
            </NavLink>
            <NavLink
              to="/transactions"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span>≡</span> Transactions
            </NavLink>
            <NavLink
              to="/budgets"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span>◈</span> Budgets
            </NavLink>
            <NavLink
              to="/accounts"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span>▣</span> Accounts
            </NavLink>
            <NavLink
              to="/recurring"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span>↻</span> Recurring
            </NavLink>
            <NavLink
              to="/reports"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span>▤</span> Reports
            </NavLink>
            <NavLink
              to="/goals"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span>☆</span> Goals
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span>◯</span> Profile
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-bottom">
        <div className="mini-help">
          <strong>Stay on track</strong>
          <span>Small habits make a big difference.</span>
        </div>
        <button className="logout-btn" type="button" onClick={handleLogout}>
          ↪ <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
