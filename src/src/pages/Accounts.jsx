import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { saveUser, money } from '../utils/storage';

export default function Accounts() {
  const { currentUser, refreshUser } = useAuth();

  const [name, setName] = useState('');
  const [type, setType] = useState('Bank');
  const [message, setMessage] = useState('');

  const accounts = currentUser?.accounts || [
    { id: 'cash', name: 'Cash', type: 'Cash' },
    { id: 'bank', name: 'Bank Account', type: 'Bank' }
  ];
  const transactions = currentUser?.transactions || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    const newAccount = {
      id: 'a' + Date.now(),
      name: name.trim(),
      type
    };

    const updated = [...accounts, newAccount];
    saveUser({
      ...currentUser,
      accounts: updated
    });

    refreshUser();
    setMessage('Account added.');
    setName('');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteAccount = (accId) => {
    if (accounts.length <= 1) {
      alert('You must have at least one account.');
      return;
    }
    if (window.confirm('Delete this account?')) {
      const updated = accounts.filter((a) => a.id !== accId);
      saveUser({
        ...currentUser,
        accounts: updated
      });
      refreshUser();
    }
  };

  const getAccountBalance = (acc) => {
    return transactions
      .filter((t) => t.account === acc.id || t.account === acc.name)
      .reduce((s, t) => s + (t.type === 'income' ? 1 : -1) * Number(t.amount || 0), 0);
  };

  return (
    <div className="app-page">
      <Sidebar role="user" />
      <main className="main">
        <Navbar />

        <section className="feature-grid">
          <div className="panel">
            <span className="eyebrow">MULTI-ACCOUNT</span>
            <h2>Add account</h2>
            <p className="muted">Track cash, bank, wallet or other accounts separately.</p>

            <form id="accountForm" className="form-stack" onSubmit={handleSubmit}>
              <label>
                Account name
                <input
                  id="accountName"
                  required
                  placeholder="Savings Account"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label>
                Type
                <select
                  id="accountType"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Bank">Bank</option>
                  <option value="Cash">Cash</option>
                  <option value="Wallet">Wallet</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <button className="primary-btn" type="submit">
                Add account <span>→</span>
              </button>

              {message && (
                <p id="accountMessage" className="form-message message-success">
                  {message}
                </p>
              )}
            </form>
          </div>

          <div className="panel">
            <span className="eyebrow">YOUR ACCOUNTS</span>
            <h2>Account balances</h2>

            <div id="accountList">
              {accounts.map((a) => {
                const bal = getAccountBalance(a);
                return (
                  <div key={a.id} className="feature-item">
                    <div>
                      <strong>{a.name}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>
                          {a.type} &middot; {money(bal)}
                        </span>
                        {accounts.length > 1 && (
                          <button
                            type="button"
                            className="tx-action-btn"
                            title="Delete account"
                            onClick={() => handleDeleteAccount(a.id)}
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
