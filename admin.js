if(localStorage.getItem("adminLoggedIn")!=="true")location.href="admin-login.html";
function userEmails(){return (localStorage.getItem("expenseUserEmails")||"").split("\n").filter(Boolean)}
function userKey(email,field){return "expenseUser_"+encodeURIComponent(email)+"_"+field}
function users(){return userEmails().map(email=>{const tx=(localStorage.getItem(userKey(email,"transactions"))||"").split("\n").filter(Boolean).map(line=>{const p=line.split("|");return{id:Number(p[0]),type:p[1],amount:Number(p[2]),source:decodeURIComponent(p[3]||""),category:decodeURIComponent(p[4]||""),note:decodeURIComponent(p[5]||""),date:p[6]||""}});return{name:localStorage.getItem(userKey(email,"name"))||"",email,password:localStorage.getItem(userKey(email,"password"))||"",transactions:tx}})}
function money(n){return "₹"+Number(n||0).toLocaleString("en-IN",{maximumFractionDigits:0})}
function adminLogout(){localStorage.removeItem("adminLoggedIn");location.href="admin-login.html"}
const us=users();const all=us.flatMap(u=>u.transactions||[]);document.getElementById("totalUsers").textContent=us.length;document.getElementById("totalTransactions").textContent=all.length;document.getElementById("totalIncome").textContent=money(all.filter(t=>t.type==="income").reduce((s,t)=>s+Number(t.amount),0));document.getElementById("totalExpenses").textContent=money(all.filter(t=>t.type==="expense").reduce((s,t)=>s+Number(t.amount),0));
const ul=document.getElementById("usersList");
if(ul){
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
 ul.innerHTML=us.length?us.map(u=>`<div class="user-row"><strong>${esc(u.name||"User")}</strong><span>${esc(u.email)}</span><span>${(u.transactions||[]).length} records</span><button class="delete-btn" onclick="deleteUser(${JSON.stringify(u.email)})">Delete</button></div>`).join(""):`<div class="empty-state">No registered users.</div>`;
}
function deleteUser(email){if(!confirm("Delete this user?"))return;let next=users().filter(u=>u.email!==email);localStorage.removeItem(userKey(email,"name"));localStorage.removeItem(userKey(email,"password"));localStorage.removeItem(userKey(email,"transactions"));localStorage.setItem("expenseUserEmails",next.map(u=>u.email).join("\n"));location.reload()}
document.getElementById("topUserName").textContent="Admin";document.getElementById("topAvatar").textContent="A";

const atl=document.getElementById("adminTransactionsList");
if(atl){
 const rows=all.slice().reverse();
 atl.innerHTML=rows.length?rows.map(t=>{const owner=us.find(u=>(u.transactions||[]).some(x=>x.id===t.id));return `<div class="user-row"><strong>${owner?.name||"User"}</strong><span>${owner?.email||""}</span><span>${t.type==="income"?"Income":"Expense"}: ${money(t.amount)}</span><span>${t.date||"No date"}</span></div>`}).join(""):`<div class="empty-state">No transactions recorded.</div>`;
}
