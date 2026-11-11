import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getUsers, adminDeleteTransaction, money } from '../../utils/storage';

export default function AdminTransactions() {
  const [usersList, setUsersList] = useState(getUsers());
  const [filterType, setFilterType] = useState('all');
  const [userFilter, setUserFilter] = useState('all');

  const reloadData = () => {
    setUsersList(getUsers());
  };

  const handleDeleteTx = (txId) => {
    if (window.confirm('Are you sure you want to delete this transaction record?')) {
      adminDeleteTransaction(txId);
      reloadData();
    }
  };

  // Compile all transactions with their owner
  const allTx = usersList
    .flatMap((u) =>
      (u.transactions || []).map((t) => ({
        ...t,
        ownerName: u.name || 'User',
        ownerEmail: u.email
      }))
    )
    .reverse();

  let filtered = allTx;
  if (filterType !== 'all') {
    filtered = filtered.filter((t) => t.type === filterType);
  }
  if (userFilter !== 'all') {
    filtered = filtered.filter(
      (t) => t.ownerEmail.toLowerCase() === userFilter.toLowerCase()
    );
  }

  return (
    <div className="app-page">
      <Sidebar role="admin" />
      <main className="main">
        <Navbar title="Transactions" eyebrow="ADMIN MODULE" />

        <section className="panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">ALL ACTIVITY</span>
              <h2>All transactions ({filtered.length})</h2>
              <p className="muted">Transactions recorded by all registered users.</p>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                style={{
                  border: '1px solid var(--line)',
                  borderRadius: '12px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  background: '#fafbf9'
                }}
              >
                <option value="all">All Users</option>
                {usersList.map((u) => (
                  <option key={u.email} value={u.email}>
                    {u.name || u.email}
                  </option>
                ))}
              </select>

              <div className="filter-row">
                <button
                  type="button"
                  className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterType('all')}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`filter-btn ${filterType === 'income' ? 'active' : ''}`}
                  onClick={() => setFilterType('income')}
                >
                  Income
                </button>
                <button
                  type="button"
                  className={`filter-btn ${filterType === 'expense' ? 'active' : ''}`}
                  onClick={() => setFilterType('expense')}
                >
                  Expense
                </button>
              </div>
            </div>
          </div>

          <div id="adminTransactionsList" className="admin-table">
            {filtered.length ? (
              filtered.map((t) => (
                <div key={t.id} className="user-row">
                  <strong>{t.ownerName}</strong>
                  <span>{t.ownerEmail}</span>
                  <span>
                    {t.type === 'income' ? 'Income' : 'Expense'}: {money(t.amount)}
                    {t.category ? ` (${t.category})` : t.source ? ` (${t.source})` : ''}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>{t.date || 'No date'}</span>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDeleteTx(t.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">No transactions recorded.</div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
