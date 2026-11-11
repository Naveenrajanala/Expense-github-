import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { addTransaction, updateTransaction, deleteTransaction, money } from '../utils/storage';

export default function Expense() {
  const { currentUser, refreshUser } = useAuth();

  const today = new Date().toISOString().split('T')[0];
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(today);
  const [account, setAccount] = useState('cash');
  const [message, setMessage] = useState('');

  // Editing state
  const [editingTx, setEditingTx] = useState(null);

  const accounts = currentUser?.accounts || [
    { id: 'cash', name: 'Cash', type: 'Cash' },
    { id: 'bank', name: 'Bank Account', type: 'Bank' }
  ];

  const expenses = (currentUser?.transactions || [])
    .filter((t) => t.type === 'expense')
    .slice()
    .reverse();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category || !note) return;

    addTransaction(currentUser.email, {
      type: 'expense',
      amount: Number(amount),
      category,
      note: note.trim(),
      date,
      account
    });

    refreshUser();
    setMessage('Expense saved successfully.');
    setAmount('');
    setCategory('');
    setNote('');
    setDate(today);

    setTimeout(() => {
      setMessage('');
    }, 4000);
  };

  const handleEditClick = (t) => {
    setEditingTx({
      id: t.id,
      amount: t.amount,
      category: t.category || '',
      note: t.note || '',
      date: t.date || today,
      account: t.account || 'cash'
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editingTx) return;
    updateTransaction(currentUser.email, {
      id: editingTx.id,
      type: 'expense',
      amount: Number(editingTx.amount),
      category: editingTx.category,
      note: editingTx.note.trim(),
      date: editingTx.date,
      account: editingTx.account
    });
    refreshUser();
    setEditingTx(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this expense?')) {
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
          <div className="panel intro-panel expense-intro">
            <span className="eyebrow">MONEY OUT</span>
            <h2>Add expense</h2>
            <p>
              Record everyday spending so your dashboard reflects where your money is
              going.
            </p>
            <div className="big-symbol">↘</div>
          </div>

          <div className="panel form-panel">
            <div className="panel-head">
              <div>
                <span className="eyebrow">NEW ENTRY</span>
                <h2>Expense details</h2>
              </div>
            </div>

            <form id="expenseForm" className="form-stack" onSubmit={handleSubmit}>
              <label>
                Amount (₹)
                <input
                  id="expenseAmount"
                  type="number"
                  min="1"
                  placeholder="0.00"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </label>

              <label>
                Category
                <select
                  id="expenseCategory"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
                Note
                <input
                  id="expenseNote"
                  type="text"
                  placeholder="What did you spend on?"
                  required
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </label>

              <label>
                Date
                <input
                  id="expenseDate"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>

              {message && (
                <p id="expenseMessage" className="form-message message-success">
                  {message}
                </p>
              )}

              <button className="primary-btn" type="submit">
                Save expense <span>→</span>
              </button>
            </form>
          </div>
        </section>

        {/* Expenses List with Edit & Delete */}
        <section className="panel" style={{ marginTop: '24px' }}>
          <div className="panel-head">
            <div>
              <span className="eyebrow">HISTORY</span>
              <h2>Recorded expenses ({expenses.length})</h2>
            </div>
          </div>

          <div className="transaction-list">
            {expenses.length ? (
              expenses.map((t) => (
                <div key={t.id} className="transaction-row">
                  <span className="tx-icon expense">↘</span>
                  <div>
                    <div className="tx-title">{t.note || t.category || 'Expense'}</div>
                    <div className="tx-date">
                      {t.date || 'No date'}
                      {t.category ? ` · ${t.category}` : ''}
                      {t.account ? ` · ${t.account}` : ''}
                    </div>
                  </div>
                  <div className="actions-cell">
                    <strong className="tx-amount expense">− {money(t.amount)}</strong>
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
              <div className="empty-state">No expense records yet.</div>
            )}
          </div>
        </section>

        {/* Edit Modal */}
        {editingTx && (
          <div className="modal-overlay" onClick={() => setEditingTx(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Edit Expense</h3>
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
                    Update expense <span>✓</span>
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
