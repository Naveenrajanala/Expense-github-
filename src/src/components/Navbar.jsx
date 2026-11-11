import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ title, eyebrow, subtitle }) {
  const { currentUser, isAdmin } = useAuth();

  const getGreeting = () => {
    const h = new Date().getHours();
    const timeGreeting = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
    if (currentUser?.name) {
      return `${timeGreeting}, ${currentUser.name.split(' ')[0]}`;
    }
    return timeGreeting;
  };

  const displayName = isAdmin ? 'Admin' : currentUser?.name ? currentUser.name.split(' ')[0] : 'User';
  const avatar = isAdmin ? 'A' : currentUser?.name ? currentUser.name.trim().charAt(0).toUpperCase() : 'U';
  const defaultEyebrow = isAdmin ? 'ADMIN MODULE' : 'PERSONAL FINANCE';

  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">{eyebrow || defaultEyebrow}</span>
        <h1 id="pageGreeting">{title || getGreeting()}</h1>
        {subtitle && <p className="muted" style={{ margin: '4px 0 0' }}>{subtitle}</p>}
      </div>
      <div className="top-actions">
        <button className="icon-btn" aria-label="Notifications" type="button">♧</button>
        <Link className="user-chip" to={isAdmin ? "/admin/dashboard" : "/profile"}>
          <span className="avatar" id="topAvatar">{avatar}</span>
          <span id="topUserName">{displayName}</span>
          <b>⌄</b>
        </Link>
      </div>
    </header>
  );
}
