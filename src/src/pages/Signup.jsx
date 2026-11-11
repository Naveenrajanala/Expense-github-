import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = signup(name, email, password);
    if (res.success) {
      setMessage({ text: res.message, type: 'success' });
      setTimeout(() => {
        navigate('/');
      }, 600);
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
            Build better<br />
            <span>money habits.</span>
          </h1>
          <p>Start tracking your everyday spending with a clean, focused dashboard.</p>
          <div className="auth-orbit">
            <div className="orbit-card">
              <small>This month</small>
              <strong>₹24,580</strong>
              <span>Under budget</span>
            </div>
            <div className="orbit-dot">+</div>
          </div>
        </section>

        <section className="auth-card">
          <div className="mobile-brand">
            <div className="brand-mark">ET</div>
            <strong>Expense Tracker</strong>
          </div>
          <span className="eyebrow">GET STARTED</span>
          <h2>Create account</h2>
          <p className="muted">Your data stays in your browser.</p>

          <form id="signupForm" className="form-stack" onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                id="signupName"
                type="text"
                placeholder="Your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              Email
              <input
                id="signupEmail"
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
                id="signupPassword"
                type="password"
                placeholder="Create a password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {message.text && (
              <p
                id="signupMessage"
                className={`form-message ${
                  message.type === 'success' ? 'message-success' : 'message-error'
                }`}
              >
                {message.text}
              </p>
            )}
            <button className="primary-btn" type="submit">
              Create account <span>→</span>
            </button>
          </form>

          <p className="switch-text">
            Already have an account? <Link to="/">Sign in</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
