import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getUsers, deleteUser } from '../../utils/storage';

export default function AdminUsers() {
  const [usersList, setUsersList] = useState(getUsers());
  const [searchTerm, setSearchTerm] = useState('');

  const reloadData = () => {
    setUsersList(getUsers());
  };

  const handleDeleteUser = (email) => {
    if (window.confirm('Delete this user?')) {
      deleteUser(email);
      reloadData();
    }
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-page">
      <Sidebar role="admin" />
      <main className="main">
        <Navbar title="Users" eyebrow="ADMIN MODULE" />

        <section className="panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">USER MANAGEMENT</span>
              <h2>Registered users ({usersList.length})</h2>
            </div>
            <div style={{ maxWidth: '240px', width: '100%' }}>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid var(--line)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  fontSize: '12px'
                }}
              />
            </div>
          </div>

          <div id="usersList" className="admin-table">
            {filteredUsers.length ? (
              filteredUsers.map((u) => (
                <div key={u.email} className="user-row">
                  <strong>{u.name || 'User'}</strong>
                  <span>{u.email}</span>
                  <span>{(u.transactions || []).length} records</span>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDeleteUser(u.email)}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-state">
                {usersList.length === 0
                  ? 'No registered users.'
                  : 'No users matching search.'}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
