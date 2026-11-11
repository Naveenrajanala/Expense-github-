import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const name = currentUser?.name || 'User';
  const email = currentUser?.email || 'user@example.com';
  const avatar = name.trim().charAt(0).toUpperCase() || 'U';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-page">
      <Sidebar role="user" />
      <main className="main">
        <Navbar />

        <section className="profile-grid">
          <div className="panel profile-card">
            <span className="avatar large" id="profileAvatar">
              {avatar}
            </span>
            <span className="eyebrow">YOUR PROFILE</span>
            <h2 id="profileName">{name}</h2>
            <p id="profileEmail" className="muted">
              {email}
            </p>
            <button
              className="secondary-btn"
              type="button"
              onClick={handleLogout}
              style={{ marginTop: '14px' }}
            >
              Log out
            </button>
          </div>

          <div className="panel">
            <div className="panel-head">
              <div>
                <span className="eyebrow">ACCOUNT</span>
                <h2>Account details</h2>
              </div>
            </div>
            <div className="detail-list">
              <div>
                <span>Name</span>
                <strong id="detailName">{name}</strong>
              </div>
              <div>
                <span>Email</span>
                <strong id="detailEmail">{email}</strong>
              </div>
              <div>
                <span>Total Transactions</span>
                <strong>{(currentUser?.transactions || []).length} records</strong>
              </div>
              <div>
                <span>Accounts Configured</span>
                <strong>{(currentUser?.accounts || []).length} accounts</strong>
              </div>
              <div>
                <span>Storage</span>
                <strong>Local browser storage</strong>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
