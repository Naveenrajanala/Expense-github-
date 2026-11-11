import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { addTransaction, updateTransaction, deleteTransaction, money } from '../utils/storage';

export default function Income() {
  const { currentUser, refreshUser } = useAuth();

  const today = new Date().toISOString().split('T')[0];
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState(today);
  const [account, setAccount] = useState('cash');
  const [message, setMessage] = useState('');

  // Editing state
  const [editingTx, setEditingTx] = useState(null);

  const accounts = currentUser?.accounts || [
    { id: 'cash', name: 'Cash', type: 'Cash' },
    { id: 'bank', name: 'Bank Account', type: 'Bank' }
  ];

  const incomes = (currentUser?.transactions || [])
    .filter((t) => t.type === 'income')
    .slice()
    .reverse();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !source) return;

    addTransaction(currentUser.email, {
      type: 'income',
      amount: Number(amount),
      source: source.trim(),
      date,
      account
    });

    refreshUser();
    setMessage('Income saved successfully.');
    setAmount('');
    setSource('');
    setDate(today);

    setTimeout(() => {
      setMessage('');
    }, 4000);
  };

  const handleEditClick = (t) => {
    setEditingTx({
      id: t.id,
      amount: t.amount,
      source: t.source || t.note || '',
      date: t.date || today,
      account: t.account || 'cash'
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editingTx) return;
    updateTransaction(currentUser.email, {
      id: editingTx.id,
      type: 'income',
      amount: Number(editingTx.amount),
      source: editingTx.source.trim(),
      date: editingTx.date,
      account: editingTx.account
    });
    refreshUser();
    setEditingTx(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this income record?')) {
      deleteTransaction(currentUser.email, id);
      refreshUser();
    }
  };

  return (
    <div className="app-page">
      <Sidebar role="user" />
      <main className="main">
        <Navbar />

        <section className="form-layout">
          <div className="panel intro-panel">
            <span className="eyebrow">MONEY IN</span>
            <h2>Add income</h2>
            <p>
              Keep your balance accurate by recording salary, freelance work, gifts or any
              other money received.
            </p>
            <div className="big-symbol">↗</div>
          </div>

          <div className="panel form-panel">
            <div className="panel-head">
              <div>
                <span className="eyebrow">NEW ENTRY</span>
                <h2>Income details</h2>
              </div>
            </div>

            <form id="incomeForm" className="form-stack" onSubmit={handleSubmit}>
              <label>
                Amount (₹)
                <input
                  id="incomeAmount"
                  type="number"
                  min="1"
                  placeholder="0.00"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </label>

              <label>
                Source
                <input
                  id="incomeSource"
                  type="text"
                  placeholder="Salary, freelance, gift..."
                  required
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
              </label>

              <label>
                Account
                <select
                  id="transactionAccount"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
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
                  id="incomeDate"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>

              {message && (
                <p id="incomeMessage" className="form-message message-success">
                  {message}
                </p>
              )}

              <button className="primary-btn" type="submit">
                Save income <span>→</span>
              </button>
            </form>
          </div>
        </section>

        {/* Income History with Edit & Delete */}
        <section className="panel" style={{ marginTop: '24px' }}>
          <div className="panel-head">
            <div>
              <span className="eyebrow">HISTORY</span>
              <h2>Recorded income ({incomes.length})</h2>
            </div>
          </div>

          <div className="transaction-list">
            {incomes.length ? (
              incomes.map((t) => (
                <div key={t.id} className="transaction-row">
                  <span className="tx-icon income">↗</span>
                  <div>
                    <div className="tx-title">{t.source || t.note || 'Income'}</div>
                    <div className="tx-date">
                      {t.date || 'No date'}
                      {t.account ? ` · ${t.account}` : ''}
                    </div>
                  </div>
                  <div className="actions-cell">
                    <strong className="tx-amount income">+ {money(t.amount)}</strong>
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
              <div className="empty-state">No income records yet.</div>
            )}
          </div>
        </section>

        {/* Edit Modal */}
        {editingTx && (
          <div className="modal-overlay" onClick={() => setEditingTx(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Edit Income</h3>
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
                    Update income <span>✓</span>
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
