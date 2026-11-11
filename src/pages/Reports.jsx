import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { money } from '../utils/storage';

export default function Reports() {
  const { currentUser } = useAuth();

  const transactions = currentUser?.transactions || [];
  const accounts = currentUser?.accounts || [
    { id: 'cash', name: 'Cash', type: 'Cash' },
    { id: 'bank', name: 'Bank Account', type: 'Bank' }
  ];

  const totalIn = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalEx = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + Number(t.amount || 0), 0);
  const balance = totalIn - totalEx;

  // Spending by category
  const cats = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const c = t.category || 'Other';
      cats[c] = (cats[c] || 0) + Number(t.amount || 0);
    });

  const catRows = Object.entries(cats).sort((a, b) => b[1] - a[1]);
  const maxCat = catRows[0]?.[1] || 1;

  const handleExportCsv = () => {
    const rows = [
      ['Date', 'Type', 'Amount', 'Category', 'Description', 'Account'],
      ...transactions.map((t) => [
        t.date || '',
        t.type,
        t.amount,
        t.category || '',
        t.source || t.note || '',
        t.account || 'Cash'
      ])
    ];

    const csvContent = rows
      .map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'expense-tracker-report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-page">
      <Sidebar role="user" />
      <main className="main">
        <Navbar />

        <section className="panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">INSIGHTS &amp; REPORTS</span>
              <h2>Financial report</h2>
              <p className="muted">
                Review spending patterns and export your transaction data.
              </p>
            </div>
            <button
              className="primary-btn"
              id="exportCsv"
              type="button"
              onClick={handleExportCsv}
            >
              Export CSV &darr;
            </button>
          </div>

          <div className="report-stats" id="reportStats">
            <div className="admin-stat">
              <span>Total income</span>
              <strong>{money(totalIn)}</strong>
            </div>
            <div className="admin-stat">
              <span>Total expenses</span>
              <strong>{money(totalEx)}</strong>
            </div>
            <div className="admin-stat">
              <span>Balance</span>
              <strong>{money(balance)}</strong>
            </div>
            <div className="admin-stat">
              <span>Transactions</span>
              <strong>{transactions.length}</strong>
            </div>
          </div>

          <div className="report-grid">
            <div>
              <h3>Spending by category</h3>
              <div id="categoryReport">
                {catRows.length ? (
                  catRows.map(([c, v]) => (
                    <div key={c} className="feature-item">
                      <div>
                        <strong>{c}</strong>
                        <span>{money(v)}</span>
                      </div>
                      <div className="progress">
                        <i style={{ width: `${Math.min(100, (v / maxCat) * 100)}%` }}></i>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">No expense data.</div>
                )}
              </div>
            </div>

            <div>
              <h3>Account summary</h3>
              <div id="accountReport">
                {accounts.length ? (
                  accounts.map((a) => {
                    const v = transactions
                      .filter((t) => t.account === a.id || t.account === a.name)
                      .reduce(
                        (s, t) =>
                          s + (t.type === 'income' ? 1 : -1) * Number(t.amount || 0),
                        0
                      );
                    return (
                      <div key={a.id} className="feature-item">
                        <strong>{a.name}</strong>
                        <span>{money(v)}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-state">No accounts found.</div>
                )}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
