import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.success) {
      setMessage({ text: res.message, type: 'success' });
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } else {
      setMessage({ text: res.message, type: 'error' });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-brand">
          <div className="brand-mark">ET</div>
          <span className="eyebrow">EXPENSE TRACKER</span>
          <h1>
            Take control of<br />
            <span>your money.</span>
          </h1>
          <p>A simple way to see your income, expenses and balance in one calm dashboard.</p>
          <div className="auth-orbit">
            <div className="orbit-card">
              <small>Balance</small>
              <strong>₹48,260</strong>
              <span>↗ 12.8%</span>
            </div>
            <div className="orbit-dot">₹</div>
          </div>
        </section>

        <section className="auth-card">
          <div className="mobile-brand">
            <div className="brand-mark">ET</div>
            <strong>Expense Tracker</strong>
          </div>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in</h2>
          <p className="muted">Enter your details to continue.</p>

          <form id="loginForm" className="form-stack" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                id="loginEmail"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Password
              <input
                id="loginPassword"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {message.text && (
              <p
                id="loginMessage"
                className={`form-message ${
                  message.type === 'success' ? 'message-success' : 'message-error'
                }`}
              >
                {message.text}
              </p>
            )}
            <button className="primary-btn" type="submit">
              Sign in <span>→</span>
            </button>
          </form>

          <p className="switch-text">
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
          <Link className="admin-link" to="/admin/login">
            Admin login
          </Link>
        </section>
      </div>
    </div>
  );
}
