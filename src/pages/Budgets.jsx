import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { saveUser, money } from '../utils/storage';

export default function Budgets() {
  const { currentUser, refreshUser } = useAuth();

  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const budgets = currentUser?.budgets || {};
  const transactions = currentUser?.transactions || [];

  const spent = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const cat = t.category || 'Other';
      spent[cat] = (spent[cat] || 0) + Number(t.amount || 0);
    });

  const categories = Object.keys(budgets);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;

    const updatedBudgets = {
      ...budgets,
      [category]: Number(amount)
    };

    saveUser({
      ...currentUser,
      budgets: updatedBudgets
    });

    refreshUser();
    setMessage('Budget saved successfully.');
    setAmount('');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteBudget = (cat) => {
    if (window.confirm(`Delete budget for ${cat}?`)) {
      const updatedBudgets = { ...budgets };
      delete updatedBudgets[cat];
      saveUser({
        ...currentUser,
        budgets: updatedBudgets
      });
      refreshUser();
    }
  };

  return (
    <div className="app-page">
      <Sidebar role="user" />
      <main className="main">
        <Navbar />

        <section className="feature-grid">
          <div className="panel">
            <span className="eyebrow">BUDGET PLANNER</span>
            <h2>Set monthly budgets</h2>
            <p className="muted">Create limits for each spending category and track usage.</p>

            <form id="budgetForm" className="form-stack" onSubmit={handleSubmit}>
              <label>
                Category
                <select
                  id="budgetCategory"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
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
                Monthly limit (₹)
                <input
                  id="budgetAmount"
                  type="number"
                  min="1"
                  placeholder="e.g. 5000"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </label>

              <button className="primary-btn" type="submit">
                Save budget <span>→</span>
              </button>

              {message && (
                <p id="budgetMessage" className="form-message message-success">
                  {message}
                </p>
              )}
            </form>
          </div>

          <div className="panel">
            <div className="panel-head">
              <div>
                <span className="eyebrow">TRACKING</span>
                <h2>Budget status</h2>
              </div>
            </div>

            <div id="budgetList">
              {categories.length ? (
                categories.map((cat) => {
                  const lim = Number(budgets[cat]) || 0;
                  const v = spent[cat] || 0;
                  const p = Math.min(100, lim ? (v / lim) * 100 : 0);
                  const isOver = v > lim;

                  return (
                    <div key={cat} className="feature-item">
                      <div>
                        <strong>
                          {cat}{' '}
                          {isOver && (
                            <span style={{ color: '#d93025', fontWeight: 700 }}>
                              (Exceeded!)
                            </span>
                          )}
                        </strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>
                            {money(v)} / {money(lim)}
                          </span>
                          <button
                            type="button"
                            className="tx-action-btn"
                            title="Remove budget"
                            onClick={() => handleDeleteBudget(cat)}
                          >
                            &times;
                          </button>
                        </div>
                      </div>
                      <div className="progress">
                        <i
                          style={{
                            width: `${p}%`,
                            background: isOver ? '#d93025' : '#93b43c'
                          }}
                        ></i>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">No budgets set yet.</div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
