import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { money } from '../utils/storage';

export default function Dashboard() {
  const { currentUser } = useAuth();

  const transactions = currentUser?.transactions || [];
  const totalIn = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalEx = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + Number(t.amount || 0), 0);
  const balance = totalIn - totalEx;

  const recent = [...transactions].reverse().slice(0, 5);

  // Chart data calculations
  const maxVal = Math.max(100000, totalIn, totalEx, 1);
  const incPercent = Math.min(100, Math.round((totalIn / maxVal) * 100));
  const expPercent = Math.min(100, Math.round((totalEx / maxVal) * 100));

  return (
    <div className="app-page">
      <Sidebar role="user" />
      <main className="main">
        <Navbar />

        <section className="hero-grid">
          <div className="balance-card">
            <div className="card-head">
              <div>
                <span className="eyebrow light">TOTAL BALANCE</span>
                <span className="balance-date">Updated just now</span>
              </div>
              <span className="balance-icon">₹</span>
            </div>
            <div className="big-balance" id="balance">
              {money(balance)}
            </div>
            <div className="balance-footer">
              <span>Available after expenses</span>
              <Link to="/transactions">View activity &rarr;</Link>
            </div>
          </div>

          <div className="side-stat income-stat">
            <span className="stat-icon">↗</span>
            <div>
              <small>Total income</small>
              <strong id="income">{money(totalIn)}</strong>
              <span>Money in</span>
            </div>
          </div>

          <div className="side-stat expense-stat">
            <span className="stat-icon">↘</span>
            <div>
              <small>Total expenses</small>
              <strong id="expense">{money(totalEx)}</strong>
              <span>Money out</span>
            </div>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel chart-panel">
            <div className="panel-head">
              <div>
                <span className="eyebrow">OVERVIEW</span>
                <h2>Money flow</h2>
              </div>
              <span className="pill">All time</span>
            </div>

            <div className="chart-wrap">
              <div className="chart-y">
                <span>100k</span>
                <span>75k</span>
                <span>50k</span>
                <span>25k</span>
                <span>0</span>
              </div>
              <div className="chart-area" id="moneyChart" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="chart-grid"></div>
                {/* SVG Visual Flow Representation */}
                <svg
                  style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, overflow: 'visible' }}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path
                    d={`M 0 100 Q 25 ${Math.max(10, 100 - incPercent * 0.8)} 50 ${Math.max(15, 100 - incPercent * 0.9)} T 100 ${Math.max(5, 100 - incPercent)}`}
                    fill="none"
                    stroke="#93b43c"
                    strokeWidth="3"
                  />
                  <path
                    d={`M 0 100 Q 30 ${Math.max(20, 100 - expPercent * 0.7)} 60 ${Math.max(25, 100 - expPercent * 0.8)} T 100 ${Math.max(10, 100 - expPercent)}`}
                    fill="none"
                    stroke="#5e8f86"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                  />
                </svg>
                {/* Visual points */}
                <div
                  className="chart-point"
                  style={{
                    left: '95%',
                    bottom: `${incPercent}%`,
                    color: '#93b43c'
                  }}
                  title={`Income: ${money(totalIn)}`}
                />
                <div
                  className="chart-point"
                  style={{
                    left: '95%',
                    bottom: `${expPercent}%`,
                    color: '#5e8f86'
                  }}
                  title={`Expenses: ${money(totalEx)}`}
                />
              </div>
            </div>

            <div className="legend">
              <span>
                <i className="legend-dot income-dot"></i>Income ({money(totalIn)})
              </span>
              <span>
                <i className="legend-dot expense-dot" style={{ background: '#5e8f86' }}></i>Expenses ({money(totalEx)})
              </span>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <div>
                <span className="eyebrow">QUICK ACTIONS</span>
                <h2>Add activity</h2>
              </div>
            </div>
            <div className="quick-actions">
              <Link to="/income" className="quick-card">
                <span className="quick-icon income-bg">↗</span>
                <div>
                  <strong>Add income</strong>
                  <small>Record money received</small>
                </div>
                <b>&rarr;</b>
              </Link>
              <Link to="/expense" className="quick-card">
                <span className="quick-icon expense-bg">↘</span>
                <div>
                  <strong>Add expense</strong>
                  <small>Record money spent</small>
                </div>
                <b>&rarr;</b>
              </Link>
            </div>
            <div className="budget-note">
              <span>✦</span>
              <div>
                <strong>Simple &amp; private</strong>
                <small>Your records are stored locally in this browser.</small>
              </div>
            </div>
          </div>
        </section>

        <section className="panel transactions-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">RECENT ACTIVITY</span>
              <h2>Latest transactions</h2>
            </div>
            <Link className="text-link" to="/transactions">
              See all &rarr;
            </Link>
          </div>
          <div id="recentTransactions" className="transaction-list">
            {recent.length ? (
              recent.map((t) => (
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
                  <strong className={`tx-amount ${t.type}`}>
                    {t.type === 'income' ? '+' : '−'} {money(t.amount)}
                  </strong>
                </div>
              ))
            ) : (
              <div className="empty-state">
                No transactions yet. Add your first income or expense.
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
