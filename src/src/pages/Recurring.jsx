import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { saveUser, addTransaction, money } from '../utils/storage';

export default function Recurring() {
  const { currentUser, refreshUser } = useAuth();

  const today = new Date().toISOString().split('T')[0];
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Bills');
  const [date, setDate] = useState(today);
  const [frequency, setFrequency] = useState('Monthly');
  const [message, setMessage] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const recurring = currentUser?.recurring || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount || !date) return;

    const newReminder = {
      name: name.trim(),
      amount: Number(amount),
      category,
      date,
      frequency
    };

    const updated = [...recurring, newReminder];
    saveUser({
      ...currentUser,
      recurring: updated
    });

    refreshUser();
    setMessage('Reminder saved.');
    setName('');
    setAmount('');
    setDate(today);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogExpense = (item) => {
    const defaultAccountId = currentUser?.accounts?.[0]?.id || 'cash';
    addTransaction(currentUser.email, {
      type: 'expense',
      amount: Number(item.amount),
      category: item.category,
      note: item.name,
      date: item.date || today,
      account: defaultAccountId
    });

    refreshUser();
    setActionMessage(`Expense of ${money(item.amount)} recorded for ${item.name}!`);
    setTimeout(() => setActionMessage(''), 3000);
  };

  const handleDeleteReminder = (index) => {
    if (window.confirm('Delete this recurring reminder?')) {
      const updated = recurring.filter((_, i) => i !== index);
      saveUser({
        ...currentUser,
        recurring: updated
      });
      refreshUser();
    }
  };

  const sortedList = [...recurring].sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  return (
    <div className="app-page">
      <Sidebar role="user" />
      <main className="main">
        <Navbar />

        <section className="feature-grid">
          <div className="panel">
            <span className="eyebrow">RECURRING EXPENSES</span>
            <h2>Set a reminder</h2>
            <p className="muted">
              Keep track of rent, subscriptions, bills and other repeating expenses.
            </p>

            <form id="recurringForm" className="form-stack" onSubmit={handleSubmit}>
              <label>
                Name
                <input
                  id="recurringName"
                  required
                  placeholder="Netflix subscription"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label>
                Amount (₹)
                <input
                  id="recurringAmount"
                  type="number"
                  min="1"
                  required
                  placeholder="649"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </label>

              <label>
                Category
                <select
                  id="recurringCategory"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Bills">Bills</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label>
                Next due date
                <input
                  id="recurringDate"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>

              <label>
                Frequency
                <select
                  id="recurringFrequency"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </label>

              <button className="primary-btn" type="submit">
                Save reminder <span>→</span>
              </button>

              {message && (
                <p id="recurringMessage" className="form-message message-success">
                  {message}
                </p>
              )}
            </form>
          </div>

          <div className="panel">
            <span className="eyebrow">REMINDERS</span>
            <h2>Upcoming payments</h2>
            {actionMessage && (
              <p className="form-message message-success" style={{ margin: '8px 0' }}>
                {actionMessage}
              </p>
            )}

            <div id="recurringList">
              {sortedList.length ? (
                sortedList.map((r, i) => (
                  <div key={i} className="feature-item">
                    <div>
                      <strong>{r.name}</strong>
                      <span>
                        {money(r.amount)} &middot; {r.frequency} &middot; due {r.date}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={() => handleLogExpense(r)}
                      >
                        Add expense
                      </button>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDeleteReminder(i)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">No recurring reminders yet.</div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
