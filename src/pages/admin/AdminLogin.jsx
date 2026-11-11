import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const { isAdmin, adminLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAdmin, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = adminLogin(email, password);
    if (res.success) {
      setMessage({ text: res.message, type: 'success' });
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 500);
    } else {
      setMessage({ text: res.message, type: 'error' });
    }
  };

  return (
    <div className="auth-page admin-auth">
      <div className="auth-card standalone">
        <div className="brand-mark">ET</div>
        <span className="eyebrow">ADMIN AREA</span>
        <h2>Admin sign in</h2>
        <p className="muted">
          Use the project admin account to open the management dashboard.
        </p>

        <form id="adminLoginForm" className="form-stack" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              id="adminEmail"
              type="email"
              required
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              id="adminPassword"
              type="password"
              required
              placeholder="admin123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {message.text && (
            <p
              id="adminMessage"
              className={`form-message ${
                message.type === 'success' ? 'message-success' : 'message-error'
              }`}
            >
              {message.text}
            </p>
          )}
          <button className="primary-btn" type="submit">
            Open dashboard <span>→</span>
          </button>
        </form>

        <Link className="switch-text" to="/">
          &larr; Back to user login
        </Link>
      </div>
    </div>
  );
}
