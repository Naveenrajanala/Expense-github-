import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { updateTransaction, deleteTransaction, money } from '../utils/storage';

export default function Transactions() {
  const { currentUser, refreshUser } = useAuth();
  const [filter, setFilter] = useState('all');
  const [editingTx, setEditingTx] = useState(null);

  const transactions = currentUser?.transactions || [];
  const accounts = currentUser?.accounts || [
    { id: 'cash', name: 'Cash', type: 'Cash' },
    { id: 'bank', name: 'Bank Account', type: 'Bank' }
  ];

  let filtered = [...transactions].reverse();
  if (filter !== 'all') {
    filtered = filtered.filter((t) => t.type === filter);
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) {
      deleteTransaction(currentUser.email, id);
      refreshUser();
    }
  };

  const handleEditClick = (t) => {
    setEditingTx({
      id: t.id,
      type: t.type,
      amount: t.amount,
      source: t.source || '',
      category: t.category || '',
      note: t.note || '',
      date: t.date || '',
      account: t.account || 'cash'
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editingTx) return;
    updateTransaction(currentUser.email, {
      ...editingTx,
      amount: Number(editingTx.amount)
    });
    refreshUser();
    setEditingTx(null);
  };

  return (
    <div className="app-page">
      <Sidebar role="user" />
      <main className="main">
        <Navbar />

        <section className="panel transactions-full">
          <div className="panel-head">
            <div>
              <span className="eyebrow">ACTIVITY</span>
              <h2>All transactions</h2>
              <p className="muted">Every income and expense recorded in this account.</p>
            </div>
            <div className="filter-row">
              <button
                type="button"
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`filter-btn ${filter === 'income' ? 'active' : ''}`}
                onClick={() => setFilter('income')}
              >
                Income
              </button>
              <button
                type="button"
                className={`filter-btn ${filter === 'expense' ? 'active' : ''}`}
                onClick={() => setFilter('expense')}
              >
                Expenses
              </button>
            </div>
          </div>

          <div id="transactionsList" className="transaction-list">
            {filtered.length ? (
              filtered.map((t) => (
                <div key={t.id} className="transaction-row">
                  <span className={`tx-icon ${t.type}`}>
                    {t.type === 'income' ? '↗' : '↘'}
                  </span>
                  <div>
                    <div className="tx-title">
                      {t.source || t.note || t.category || 'Transaction'}
                    </div>
                    <div className="tx-date">
                      {t.date || 'No date'}
                      {t.category ? ` · ${t.category}` : ''}
                      {t.account ? ` · ${t.account}` : ''}
                    </div>
                  </div>
                  <div className="actions-cell">
                    <strong className={`tx-amount ${t.type}`}>
                      {t.type === 'income' ? '+' : '−'} {money(t.amount)}
                    </strong>
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => handleEditClick(t)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDelete(t.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                No {filter === 'all' ? '' : filter + ' '}transactions found.
              </div>
            )}
          </div>
        </section>

        {/* Edit Modal */}
        {editingTx && (
          <div className="modal-overlay" onClick={() => setEditingTx(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Edit {editingTx.type === 'income' ? 'Income' : 'Expense'}</h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setEditingTx(null)}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleUpdate} className="form-stack">
                <label>
                  Amount (₹)
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingTx.amount}
                    onChange={(e) =>
                      setEditingTx({ ...editingTx, amount: e.target.value })
                    }
                  />
                </label>

                {editingTx.type === 'expense' ? (
                  <>
                    <label>
                      Category
                      <select
                        required
                        value={editingTx.category}
                        onChange={(e) =>
                          setEditingTx({ ...editingTx, category: e.target.value })
                        }
                      >
                        <option value="">Choose category</option>
                        <option value="Food">Food</option>
                        <option value="Travel">Travel</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Bills">Bills</option>
                        <option value="Education">Education</option>
                        <option value="Health">Health</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>
                    <label>
                      Note
                      <input
                        type="text"
                        required
                        value={editingTx.note}
                        onChange={(e) =>
                          setEditingTx({ ...editingTx, note: e.target.value })
                        }
                      />
                    </label>
                  </>
                ) : (
                  <label>
                    Source
                    <input
                      type="text"
                      required
                      value={editingTx.source}
                      onChange={(e) =>
                        setEditingTx({ ...editingTx, source: e.target.value })
                      }
                    />
                  </label>
                )}

                <label>
                  Account
                  <select
                    value={editingTx.account}
                    onChange={(e) =>
                      setEditingTx({ ...editingTx, account: e.target.value })
                    }
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Date
                  <input
                    type="date"
                    required
                    value={editingTx.date}
                    onChange={(e) =>
                      setEditingTx({ ...editingTx, date: e.target.value })
                    }
                  />
                </label>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button className="primary-btn" type="submit" style={{ flex: 1 }}>
                    Save changes <span>✓</span>
                  </button>
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setEditingTx(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
}
