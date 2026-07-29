const pages = {
  "dashboard": { title: "Dashboard", group: "Home", icon: "fa-gauge-high", href: "dashboard.html" },
  "capex-admin": { title: "CAPEX Admin", group: "Finance Management", icon: "fa-building-columns", href: "capex-admin.html" },
  "opex-admin": { title: "OPEX Admin", group: "Finance Management", icon: "fa-receipt", href: "opex-admin.html" },
  "user-role": { title: "User Role Management", group: "Finance Management", icon: "fa-users-gear", href: "user-role.html" },
  "jira-sync": { title: "Jira Project Sync", group: "Data Sync", icon: "fa-rotate", href: "jira-sync.html" },
  "project-registration": { title: "Project Registration", group: "Project Intake", icon: "fa-folder-plus", href: "project-registration.html" },
  "spend-request": { title: "Spend Request", group: "Spend Control", icon: "fa-clipboard-list", href: "spend-request.html" },
  "budgeting": { title: "Budgeting", group: "Budget Office", icon: "fa-wallet", href: "budgeting.html" },
  "invoice": { title: "Invoice", group: "Payables", icon: "fa-file-invoice-dollar", href: "invoice.html" },
  "reports": { title: "Reports", group: "Reporting", icon: "fa-chart-column", href: "reports.html" },
  "settings": { title: "Settings", group: "Administration", icon: "fa-gear", href: "reports.html" }
};

const navGroups = [
  { label: "Home", keys: ["dashboard"] },
  { label: "Finance Management", keys: ["capex-admin", "opex-admin", "user-role"] },
  { label: "Data Sync", keys: ["jira-sync"] },
  { label: "Operations", keys: ["project-registration", "spend-request", "budgeting", "invoice"] },
  { label: "Insights", keys: ["reports", "settings"] }
];

function buildShell() {
  const current = document.body.dataset.page || "dashboard";
  const currentPage = pages[current] || pages.dashboard;
  const breadcrumbMiddle = currentPage.group === "Home" ? "" : `<li class="breadcrumb-item">${currentPage.group}</li>`;
  const navHtml = navGroups.map(group => {
    const links = group.keys.map(key => {
      const page = pages[key];
      const active = key === current ? " active" : "";
      return `<a class="sidebar-link${active}" href="${page.href}" title="${page.title}"><i class="fa-solid ${page.icon}"></i><span class="nav-label">${page.title}</span></a>`;
    }).join("");
    return `<div class="sidebar-group"><div class="sidebar-group-label">${group.label}</div><div class="submenu-free">${links}</div></div>`;
  }).join("");

  document.getElementById("appShell").innerHTML = `
    <header class="topbar">
      <button class="sidebar-toggle" id="sidebarToggle" aria-label="Toggle navigation"><i class="fa-solid fa-bars"></i></button>
      <a class="brand-mark" href="dashboard.html"><span class="brand-icon"><i class="fa-solid fa-building-columns"></i></span><span>CET Finance Management Portal</span></a>
      <div class="topbar-search"><i class="fa-solid fa-search"></i><input class="form-control" placeholder="Search projects, requests, invoices"></div>
      <button class="icon-btn" aria-label="Notifications"><i class="fa-solid fa-bell"></i></button>
      <div class="dropdown">
        <button class="profile-menu border-0 text-white" data-bs-toggle="dropdown"><span class="avatar">CU</span><span>CET User</span><i class="fa-solid fa-chevron-down small"></i></button>
        <ul class="dropdown-menu dropdown-menu-end shadow">
          <li><a class="dropdown-item" href="#"><i class="fa-solid fa-user me-2"></i>Profile</a></li>
          <li><a class="dropdown-item" href="#"><i class="fa-solid fa-sliders me-2"></i>Preferences</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#"><i class="fa-solid fa-right-from-bracket me-2"></i>Sign out</a></li>
        </ul>
      </div>
    </header>
    <aside class="sidebar" id="sidebar">${navHtml}</aside>
    <div class="breadcrumb-shell"><nav aria-label="breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="dashboard.html">Home</a></li>${breadcrumbMiddle}<li class="breadcrumb-item active" aria-current="page">${currentPage.title}</li></ol></nav></div>`;

  document.getElementById("sidebarToggle").addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    if (window.innerWidth <= 900) {
      sidebar.classList.toggle("mobile-open");
      return;
    }
    sidebar.classList.toggle("collapsed");
    document.body.classList.toggle("sidebar-collapsed");
  });
}

function wireTableSearch() {
  document.querySelectorAll(".table-search").forEach(input => {
    input.addEventListener("input", event => {
      const table = document.getElementById(event.target.dataset.table);
      const query = event.target.value.toLowerCase();
      table?.querySelectorAll("tbody tr").forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(query) ? "" : "none";
      });
    });
  });
}

function wireSpendSplits() {
  const addButton = document.getElementById("addSplit");
  const splitTable = document.querySelector("#splitTable tbody");
  if (!addButton || !splitTable) return;

  addButton.addEventListener("click", () => {
    splitTable.insertAdjacentHTML("beforeend", `<tr><td><select class="form-select"><option>CAPEX</option><option>OPEX</option></select></td><td><input class="form-control" placeholder="Split description"></td><td><input class="form-control" placeholder="$0"></td><td class="table-actions"><button class="delete-row"><i class="fa-solid fa-trash"></i></button></td></tr>`);
  });

  splitTable.addEventListener("click", event => {
    const deleteButton = event.target.closest(".delete-row");
    if (deleteButton) deleteButton.closest("tr").remove();
  });
}

function chartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom", labels: { boxWidth: 12, usePointStyle: true } } },
    scales: { y: { beginAtZero: true, grid: { color: "#e7edf5" } }, x: { grid: { display: false } } }
  };
}

function initCharts() {
  if (!window.Chart) return;
  const capexOpex = document.getElementById("capexOpexChart");
  if (!capexOpex) return;

  new Chart(capexOpex, { type: "doughnut", data: { labels: ["CAPEX", "OPEX"], datasets: [{ data: [12.4, 8.1], backgroundColor: ["#1c75d8", "#30a46c"], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } } });
  new Chart(document.getElementById("budgetChart"), { type: "bar", data: { labels: ["Consumed", "Remaining"], datasets: [{ label: "Budget", data: [11.8, 8.7], backgroundColor: ["#f59f00", "#1c75d8"] }] }, options: chartOptions() });
  new Chart(document.getElementById("monthlySpendChart"), { type: "line", data: { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], datasets: [{ label: "Spend", data: [1.2, 1.6, 1.5, 2.1, 2.8, 2.6], borderColor: "#1c75d8", backgroundColor: "rgba(28,117,216,0.12)", fill: true, tension: 0.35 }] }, options: chartOptions() });
  new Chart(document.getElementById("invoiceTrendChart"), { type: "bar", data: { labels: ["Mar", "Apr", "May", "Jun", "Jul"], datasets: [{ label: "Raised", data: [42, 55, 61, 70, 74], backgroundColor: "#0d3b66" }, { label: "Settled", data: [37, 49, 54, 63, 68], backgroundColor: "#30a46c" }] }, options: chartOptions() });
}

document.addEventListener("DOMContentLoaded", () => {
  buildShell();
  wireTableSearch();
  wireSpendSplits();
  initCharts();
});