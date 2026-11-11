const s = document.createElement("script");
s.src = "js/admin-common.js";
s.onload = () => renderUsers();
s.onerror = () => {
  const ul = document.getElementById("usersList");
  if (ul) ul.innerHTML = '<div class="empty-state">Unable to load user data.</div>';
};
document.head.appendChild(s);
