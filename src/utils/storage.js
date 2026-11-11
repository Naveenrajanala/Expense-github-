// Local storage utility functions with full backward compatibility

export function userEmails() {
  return (localStorage.getItem('expenseUserEmails') || '')
    .split('\n')
    .filter(Boolean);
}

export function userKey(email, field) {
  return 'expenseUser_' + encodeURIComponent(email) + '_' + field;
}

export function getUsers() {
  return userEmails().map(email => {
    const rawTx = localStorage.getItem(userKey(email, 'transactions')) || '';
    const tx = rawTx
      .split('\n')
      .filter(Boolean)
      .map(line => {
        const p = line.split('|');
        return {
          id: Number(p[0]),
          type: p[1],
          amount: Number(p[2]),
          source: decodeURIComponent(p[3] || ''),
          category: decodeURIComponent(p[4] || ''),
          note: decodeURIComponent(p[5] || ''),
          date: p[6] || '',
          account: decodeURIComponent(p[7] || 'Cash')
        };
      });

    let accounts = [];
    try {
      accounts = JSON.parse(localStorage.getItem(userKey(email, 'accounts')) || '[]');
    } catch {
      accounts = [];
    }
    if (!accounts || !accounts.length) {
      accounts = [
        { id: 'cash', name: 'Cash', type: 'Cash' },
        { id: 'bank', name: 'Bank Account', type: 'Bank' }
      ];
    }

    let budgets = {};
    try {
      budgets = JSON.parse(localStorage.getItem(userKey(email, 'budgets')) || '{}');
    } catch {
      budgets = {};
    }

    let goals = [];
    try {
      goals = JSON.parse(localStorage.getItem(userKey(email, 'goals')) || '[]');
    } catch {
      goals = [];
    }

    let recurring = [];
    try {
      recurring = JSON.parse(localStorage.getItem(userKey(email, 'recurring')) || '[]');
    } catch {
      recurring = [];
    }

    return {
      name: localStorage.getItem(userKey(email, 'name')) || '',
      email,
      password: localStorage.getItem(userKey(email, 'password')) || '',
      transactions: tx,
      accounts,
      budgets,
      goals,
      recurring
    };
  });
}

export function saveUsers(usersList) {
  localStorage.setItem('expenseUserEmails', usersList.map(u => u.email).join('\n'));
  usersList.forEach(u => {
    localStorage.setItem(userKey(u.email, 'name'), u.name || '');
    localStorage.setItem(userKey(u.email, 'password'), u.password || '');
    localStorage.setItem(
      userKey(u.email, 'transactions'),
      (u.transactions || [])
        .map(t =>
          [
            t.id,
            t.type,
            t.amount,
            encodeURIComponent(t.source || ''),
            encodeURIComponent(t.category || ''),
            encodeURIComponent(t.note || ''),
            t.date || '',
            encodeURIComponent(t.account || 'Cash')
          ].join('|')
        )
        .join('\n')
    );
    localStorage.setItem(userKey(u.email, 'accounts'), JSON.stringify(u.accounts || []));
    localStorage.setItem(userKey(u.email, 'budgets'), JSON.stringify(u.budgets || {}));
    localStorage.setItem(userKey(u.email, 'goals'), JSON.stringify(u.goals || []));
    localStorage.setItem(userKey(u.email, 'recurring'), JSON.stringify(u.recurring || []));
  });
}

export function getUser(email) {
  if (!email) return null;
  const list = getUsers();
  return list.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function saveUser(u) {
  let list = getUsers();
  const index = list.findIndex(x => x.email.toLowerCase() === u.email.toLowerCase());
  if (index >= 0) {
    list[index] = { ...list[index], ...u };
  } else {
    list.push(u);
  }
  saveUsers(list);
}

export function deleteUser(email) {
  const list = getUsers().filter(u => u.email.toLowerCase() !== email.toLowerCase());
  localStorage.removeItem(userKey(email, 'name'));
  localStorage.removeItem(userKey(email, 'password'));
  localStorage.removeItem(userKey(email, 'transactions'));
  localStorage.removeItem(userKey(email, 'accounts'));
  localStorage.removeItem(userKey(email, 'budgets'));
  localStorage.removeItem(userKey(email, 'goals'));
  localStorage.removeItem(userKey(email, 'recurring'));
  localStorage.setItem('expenseUserEmails', list.map(u => u.email).join('\n'));
}

export function getCurrentUserEmail() {
  return localStorage.getItem('currentUser') || null;
}

export function setCurrentUserEmail(email) {
  if (email) {
    localStorage.setItem('currentUser', email);
  } else {
    localStorage.removeItem('currentUser');
  }
}

export function isAdminLoggedIn() {
  return localStorage.getItem('adminLoggedIn') === 'true';
}

export function setAdminLoggedIn(status) {
  if (status) {
    localStorage.setItem('adminLoggedIn', 'true');
  } else {
    localStorage.removeItem('adminLoggedIn');
  }
}

export function money(n) {
  return '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

export function addTransaction(email, transaction) {
  const u = getUser(email);
  if (!u) return false;
  u.transactions = u.transactions || [];
  u.transactions.push({
    id: transaction.id || Date.now(),
    type: transaction.type,
    amount: Number(transaction.amount),
    source: transaction.source || '',
    category: transaction.category || '',
    note: transaction.note || '',
    date: transaction.date || new Date().toISOString().split('T')[0],
    account: transaction.account || 'Cash'
  });
  saveUser(u);
  return true;
}

export function updateTransaction(email, updatedTx) {
  const u = getUser(email);
  if (!u) return false;
  u.transactions = (u.transactions || []).map(t => (t.id === updatedTx.id ? { ...t, ...updatedTx } : t));
  saveUser(u);
  return true;
}

export function deleteTransaction(email, txId) {
  const u = getUser(email);
  if (!u) return false;
  u.transactions = (u.transactions || []).filter(t => t.id !== txId);
  saveUser(u);
  return true;
}

export function adminDeleteTransaction(txId) {
  const list = getUsers();
  let modified = false;
  for (const u of list) {
    const beforeLen = (u.transactions || []).length;
    u.transactions = (u.transactions || []).filter(t => t.id !== txId);
    if (u.transactions.length !== beforeLen) {
      modified = true;
    }
  }
  if (modified) {
    saveUsers(list);
  }
  return modified;
}
