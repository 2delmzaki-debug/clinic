// ============================================================
// sidebar.js — يبني قائمة التنقل الجانبية بحسب دور المستخدم والصفحة الحالية
// ============================================================
const DOCTOR_NAV = [
  { key: 'dashboard', href: 'dashboard.html', icon: 'grid', label: 'dashboard' },
  { key: 'patients', href: 'patients.html', icon: 'users', label: 'patients' },
  { key: 'appointments', href: 'appointments.html', icon: 'calendar', label: 'appointments' },
  { key: 'reports', href: 'reports.html', icon: 'chart', label: 'reports' },
];

const ICONS = {
  grid: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" stroke-width="1.8"/><rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" stroke-width="1.8"/><rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" stroke-width="1.8"/><rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" stroke-width="1.8"/></svg>',
  users: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.2" stroke="currentColor" stroke-width="1.8"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="8" r="2.6" stroke="currentColor" stroke-width="1.6"/><path d="M15.5 14.2c2.6.4 4.5 2.6 4.5 5.8" stroke="currentColor" stroke-width="1.6"/></svg>',
  calendar: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 3v4M16 3v4M3.5 10h17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  chart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 20V10M12 20V4M20 20v-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  flask: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 3h6M10 3v6l-5.5 9a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9V3" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  pill: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="8.5" width="18" height="7" rx="3.5" stroke="currentColor" stroke-width="1.8"/><path d="M12 8.5v7" stroke="currentColor" stroke-width="1.8"/></svg>',
  logout: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
};

function renderSidebar(activeKey, profile) {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  const items = DOCTOR_NAV.map(item => `
    <a class="nav-link ${item.key === activeKey ? 'active' : ''}" href="${item.href}">
      ${ICONS[item.icon]} <span data-i18n="${item.label}">${t(item.label)}</span>
    </a>`).join('');

  sidebar.innerHTML = `
    <div class="brand">
      <div class="brand-mark">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8 3v4a4 4 0 0 0 8 0V3M8 3H6a2 2 0 0 0-2 2v3a6 6 0 0 0 6 6v4M16 3h2a2 2 0 0 1 2 2v3a6 6 0 0 1-6 6v4" stroke="#3A2A0C" stroke-width="1.8" stroke-linecap="round"/></svg>
      </div>
      <div class="brand-name" data-i18n="clinic_name">${t('clinic_name')}</div>
    </div>
    ${items}
    <div class="nav-sep"></div>
    <a class="nav-link" id="logoutLink"> ${ICONS.logout} <span data-i18n="logout">${t('logout')}</span></a>
  `;
  document.getElementById('logoutLink').addEventListener('click', signOutUser);
  applyLang();
}

function renderPatientSidebar(activeKey) {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  const items = [
    { key: 'my_file', icon: 'users', label: 'my_file' },
    { key: 'book_appointment', icon: 'calendar', label: 'book_appointment' },
    { key: 'my_labs', icon: 'flask', label: 'my_labs' },
    { key: 'my_prescriptions', icon: 'pill', label: 'my_prescriptions' },
  ].map(item => `
    <a class="nav-link js-patient-tab ${item.key === activeKey ? 'active' : ''}" data-tab="${item.key}">
      ${ICONS[item.icon]} <span data-i18n="${item.label}">${t(item.label)}</span>
    </a>`).join('');

  sidebar.innerHTML = `
    <div class="brand">
      <div class="brand-mark">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8 3v4a4 4 0 0 0 8 0V3M8 3H6a2 2 0 0 0-2 2v3a6 6 0 0 0 6 6v4M16 3h2a2 2 0 0 1 2 2v3a6 6 0 0 1-6 6v4" stroke="#3A2A0C" stroke-width="1.8" stroke-linecap="round"/></svg>
      </div>
      <div class="brand-name" data-i18n="clinic_name">${t('clinic_name')}</div>
    </div>
    ${items}
    <div class="nav-sep"></div>
    <a class="nav-link" id="logoutLink"> ${ICONS.logout} <span data-i18n="logout">${t('logout')}</span></a>
  `;
  document.getElementById('logoutLink').addEventListener('click', signOutUser);
  applyLang();
}
