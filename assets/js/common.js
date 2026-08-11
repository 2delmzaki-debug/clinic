// ============================================================
// common.js — أدوات واجهة مشتركة: تنبيهات، نوافذ منبثقة، تنسيق، ومؤشر التحليل الدائري
// ============================================================

function showToast(message, type = 'ok') {
  const el = document.createElement('div');
  el.className = 'toast' + (type === 'error' ? ' error' : '');
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function openModal(innerHtml) {
  closeModal();
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.id = 'activeModalBackdrop';
  backdrop.innerHTML = `<div class="modal">${innerHtml}</div>`;
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });
  document.body.appendChild(backdrop);
  applyLang();
}
function closeModal() {
  const el = document.getElementById('activeModalBackdrop');
  if (el) el.remove();
}

function formatDate(d) {
  if (!d) return '—';
  const lang = getLang();
  return new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
}

function calcAge(birthDate) {
  if (!birthDate) return '—';
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

function statusBadge(status) {
  return `<span class="badge badge-${status}">${t(status)}</span>`;
}

// -------- مؤشر دائري لعرض موقع نتيجة التحليل ضمن المعدل الطبيعي (العنصر المميز للتصميم) --------
function renderGauge(value, min, max) {
  if (value === null || value === undefined || min === null || max === null || isNaN(value)) {
    return `<span class="mono muted">${value ?? '—'}</span>`;
  }
  const range = max - min;
  const padded = range * 0.4;
  const lo = min - padded, hi = max + padded;
  const pct = Math.max(0, Math.min(1, (value - lo) / (hi - lo)));
  const angle = -90 + pct * 180; // نصف دائرة من -90 إلى 90
  let state = 'normal', color = 'var(--color-success)';
  if (value < min) { state = 'low'; color = 'var(--color-warning)'; }
  if (value > max) { state = 'high'; color = 'var(--color-danger)'; }

  const r = 26, cx = 30, cy = 30;
  const needleX = cx + r * Math.cos((angle * Math.PI) / 180);
  const needleY = cy + r * Math.sin((angle * Math.PI) / 180);

  return `
    <div class="gauge-wrap">
      <svg width="60" height="36" viewBox="0 0 60 36" style="overflow:visible">
        <path d="M 4 30 A 26 26 0 0 1 56 30" fill="none" stroke="var(--color-border)" stroke-width="5" stroke-linecap="round"/>
        <path d="M 4 30 A 26 26 0 0 1 56 30" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round"
          stroke-dasharray="81.6" stroke-dashoffset="${81.6 * (1 - pct)}"/>
        <line x1="${cx}" y1="${cy}" x2="${needleX.toFixed(1)}" y2="${needleY.toFixed(1)}" stroke="${color}" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="${cx}" cy="${cy}" r="2.6" fill="${color}"/>
      </svg>
      <div>
        <div class="gauge-value" style="color:${color}">${value}</div>
        <div class="muted" style="font-size:11.5px">${t(state)}</div>
      </div>
    </div>`;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
