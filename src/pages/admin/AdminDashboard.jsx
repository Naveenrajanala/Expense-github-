import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { getUsers, deleteUser, money } from '../../utils/storage';

export default function AdminDashboard() {
  const { adminLogout } = useAuth();
  const navigate = useNavigate();

  const [usersList, setUsersList] = useState(getUsers());

  const reloadData = () => {
    setUsersList(getUsers());
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const handleDeleteUser = (email) => {
    if (window.confirm('Delete this user?')) {
      deleteUser(email);
      reloadData();
    }
  };

  const allTx = usersList.flatMap((u) => u.transactions || []);
  const totalIncome = allTx
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalExpenses = allTx
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + Number(t.amount || 0), 0);

  return (
    <div className="app-page">
      <Sidebar role="admin" />
      <main className="main">
        <Navbar title="Good morning" eyebrow="ADMIN MODULE" />

        <section className="admin-hero">
          <div>
            <span className="eyebrow">ADMIN MODULE</span>
            <h2>System overview</h2>
            <p className="muted">Monitor the local Expense Tracker records.</p>
          </div>
          <button className="secondary-btn" type="button" onClick={handleLogout}>
            Log out
          </button>
        </section>

        <section className="admin-stats">
          <div className="admin-stat">
            <span>Users</span>
            <strong id="totalUsers">{usersList.length}</strong>
          </div>
          <div className="admin-stat">
            <span>Transactions</span>
            <strong id="totalTransactions">{allTx.length}</strong>
          </div>
          <div className="admin-stat">
            <span>Total income</span>
            <strong id="totalIncome">{money(totalIncome)}</strong>
          </div>
          <div className="admin-stat">
            <span>Total expenses</span>
            <strong id="totalExpenses">{money(totalExpenses)}</strong>
          </div>
        </section>

        <section className="panel admin-users-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">USER MANAGEMENT</span>
              <h2>Registered users</h2>
            </div>
            <Link className="secondary-btn" to="/admin/users">
              View all users &rarr;
            </Link>
          </div>

          <div id="usersList" className="admin-table">
            {usersList.length ? (
              usersList.map((u) => (
                <div key={u.email} className="user-row">
                  <strong>{u.name || 'User'}</strong>
                  <span>{u.email}</span>
                  <span>{(u.transactions || []).length} records</span>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDeleteUser(u.email)}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-state">No registered users.</div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
