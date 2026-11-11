import React from 'react';

export default function Footer() {
  return (
    <footer style={{ marginTop: '40px', padding: '15px 0', borderTop: '1px solid var(--line)', textAlign: 'center', fontSize: '11px', color: 'var(--muted)' }}>
      <span>Expense Tracker &copy; {new Date().getFullYear()} &middot; Personal Financial Management</span>
    </footer>
  );
}
