// Wade Preston — self-contained local site (no Base44)
const API = '';
const IMG = {
  logo: 'https://media.base44.com/images/public/6aa0c5fbc3510c28c50ec986/f21a491fa_logo.jpg',
  hero: 'https://media.base44.com/images/public/6aa0c5fbc3510c28c50ec986/66c3f6036_wade.jpg',
  aboutMain: 'https://media.base44.com/images/public/6aa0c5fbc3510c28c50ec986/96b2fa39f_wade3.jpg',
  aboutSecondary: 'https://media.base44.com/images/public/6aa0c5fbc3510c28c50ec986/282853f0b_wade2.jpg',
  piano: 'https://media.base44.com/images/public/6aa0c5fbc3510c28c50ec986/28fdfcfe3_wadepiano.jpg',
};
const SITE = {
  name: 'Wade Preston',
  tagline: 'Broadway Performer • Musician • Entertainer',
  email: 'booking@wadepreston.com',
  bio: [
    "Wade Preston is a Broadway performer, musician, and entertainer known for bringing the music of Billy Joel to life on stage. With a commanding presence at the piano and a voice built for the theater, he has spent his career channeling the spirit of classic American rock and roll into unforgettable live performances.",
    "From intimate club sets to full-scale theatrical productions, Wade's shows celebrate the songs that define a generation — delivered with the precision of a virtuoso and the soul of a storyteller. Every performance is a conversation between the keys and the crowd, equal parts virtuosity and heart.",
  ],
};
const NAV = [
  { label: 'Home', hash: '#/' },
  { label: 'About', hash: '#/about' },
  { label: 'Calendar', hash: '#/calendar' },
  { label: 'Contact', hash: '#/contact' },
];

let EVENTS = [];
let TOKEN = localStorage.getItem('wp_token') || '';
let editingId = null;

// ---------- helpers ----------
function todayStr() { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`; }
function pad(n) { return String(n).padStart(2, '0'); }
function formatDate(s) { if (!s) return ''; const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }); }
function formatShortDate(s) { if (!s) return ''; const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d).toLocaleDateString('en-US', { month:'short', day:'numeric' }); }
function formatMonthYear(y, m) { return new Date(y, m, 1).toLocaleDateString('en-US', { month:'long', year:'numeric' }); }
function formatTime(t) { if (!t) return ''; const [h, m] = t.split(':').map(Number); if (isNaN(h)) return t; const p = h >= 12 ? 'PM' : 'AM'; const hr = h % 12 === 0 ? 12 : h % 12; return `${hr}:${pad(m||0)} ${p}`; }
function timeRange(a, b) { if (!a && !b) return ''; if (a && b) return `${formatTime(a)} – ${formatTime(b)}`; return formatTime(a || b); }
function location(c, s) { return [c, s].filter(Boolean).join(', '); }
function isUpcoming(e) { return (e.event_date || '') >= todayStr(); }
function sortAdmin(events) {
  const t = todayStr();
  const up = events.filter(e => (e.event_date||'') >= t).sort((a,b)=>(a.event_date||'').localeCompare(b.event_date||''));
  const past = events.filter(e => (e.event_date||'') < t).sort((a,b)=>(b.event_date||'').localeCompare(a.event_date||''));
  return { up, past };
}
function esc(s) { return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function icon(name) {
  const s = { calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>', clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', pin:'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>', arrow:'<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>', plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>', logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>', pencil:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>', trash:'<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>', x:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>', check:'<polyline points="20 6 9 17 4 12"/>', alert:'<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>', mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 6 12 13 2 6"/>', send:'<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>', cdays:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>', chevL:'<polyline points="15 18 9 12 15 6"/>', chevR:'<polyline points="9 18 15 12 9 6"/>' };
  return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${s[name]||''}</svg>`;
}

// ---------- API ----------
async function api(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (TOKEN) headers['Authorization'] = 'Bearer ' + TOKEN;
  const res = await fetch(API + path, { ...opts, headers });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Request failed'); }
  return res.json();
}
async function loadEvents() { EVENTS = await api('/api/events'); }

// ---------- router ----------
function route() {
  const hash = location.hash || '#/';
  closeNav();
  if (hash.startsWith('#/admin')) return renderAdmin();
  if (hash === '#/about') return renderAbout();
  if (hash === '#/calendar') return renderCalendar();
  if (hash === '#/contact') return renderContact();
  return renderHome();
}
window.addEventListener('hashchange', route);

// ---------- layout ----------
function navHTML() {
  const hash = location.hash || '#/';
  return `
    <header class="nav" id="nav">
      <div class="nav-inner">
        <a href="#/"><img src="${IMG.logo}" class="nav-logo" alt="Wade Preston" /></a>
        <ul class="nav-links">
          ${NAV.map(n => `<li><a href="${n.hash}" class="${hash===n.hash?'active':''}">${n.label}</a></li>`).join('')}
        </ul>
        <button class="nav-toggle" onclick="toggleNav()">${icon('x')}</button>
      </div>
      <div class="nav-mobile" id="navMobile">
        ${NAV.map(n => `<a href="${n.hash}" class="${hash===n.hash?'active':''}">${n.label}</a>`).join('')}
      </div>
    </header>`;
}
function toggleNav() { document.getElementById('navMobile').classList.toggle('open'); }
function closeNav() { const m = document.getElementById('navMobile'); if (m) m.classList.remove('open'); }
window.toggleNav = toggleNav;

function footerHTML() {
  const year = new Date().getFullYear();
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div><img src="${IMG.logo}" style="height:48px;margin-bottom:20px" alt="Wade Preston" /><p style="color:var(--muted);font-size:14px;max-width:240px">${SITE.tagline}</p></div>
          <div><h3>Explore</h3><ul>${NAV.map(n=>`<li><a href="${n.hash}">${n.label}</a></li>`).join('')}</ul></div>
          <div><h3>Connect</h3><a href="mailto:${SITE.email}" style="display:flex;gap:8px;color:rgba(242,239,230,.75);margin-bottom:16px">${icon('mail')} ${SITE.email}</a></div>
        </div>
        <div class="footer-bottom"><p>© ${year} ${SITE.name}. All rights reserved.</p><a href="#/admin">Admin</a></div>
      </div>
    </footer>`;
}
function pageShell(inner) {
  document.getElementById('app').innerHTML = navHTML() + `<main>${inner}</main>` + footerHTML();
  window.scrollTo(0, 0);
  attachNavScroll();
}
function attachNavScroll() {
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { once: true });
  // keep listening
  window.onscroll = onScroll;
}

// ---------- Home ----------
function renderHome() {
  pageShell(`
    <section class="hero">
      <div class="hero-bg"><img src="${IMG.piano}" alt="Wade Preston at the piano" /></div>
      <div class="hero-content">
        <span class="eyebrow">${SITE.tagline}</span>
        <h1>Wade<br/>Preston</h1>
        <div style="margin-top:40px"><a href="#/calendar" class="btn">See Where Wade Is Performing ${icon('arrow')}</a></div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="grid-2">
          <div class="portrait"><img src="${IMG.aboutMain}" alt="Portrait of Wade Preston" /></div>
          <div class="bio">
            <span class="eyebrow">About</span>
            <h2 style="font-size:clamp(2rem,4vw,3rem);line-height:1.1;margin:16px 0 32px">A virtuoso at the keys. A storyteller on stage.</h2>
            ${SITE.bio.map(p=>`<p>${esc(p)}</p>`).join('')}
          </div>
        </div>
      </div>
    </section>
    <section class="section events-band">
      <div class="container">
        <div class="events-head">
          <div><span class="eyebrow">On Stage</span><h2 style="font-size:clamp(2.25rem,5vw,3.75rem);line-height:1.1;margin-top:16px">Upcoming Performances</h2></div>
          <a href="#/calendar" class="btn-link">View Full Calendar ${icon('arrow')}</a>
        </div>
        <div id="homeEvents" class="loading"><div class="spinner"></div></div>
      </div>
    </section>
  `);
  renderHomeEvents();
}
async function renderHomeEvents() {
  const el = document.getElementById('homeEvents');
  try {
    if (!EVENTS.length) await loadEvents();
    const up = EVENTS.filter(isUpcoming).sort((a,b)=>(a.event_date||'').localeCompare(b.event_date||'')).slice(0,3);
    if (!up.length) {
      el.className = 'empty';
      el.innerHTML = `${icon('cdays')}<p style="font-family:var(--font-heading);font-size:18px;color:rgba(242,239,230,.7)">No upcoming performances are currently scheduled.</p><p style="font-size:14px;margin-top:8px">Please check back soon.</p>`;
      return;
    }
    el.className = 'cards';
    el.innerHTML = up.map(e => `
      <button class="card" onclick="openEvent(${e.id})">
        <div class="date">${icon('calendar')} ${formatDate(e.event_date)}</div>
        <h3>${esc(e.title)}</h3>
        <div class="meta">
          ${e.venue?`<div style="color:rgba(242,239,230,.8)">${esc(e.venue)}</div>`:''}
          ${location(e.city,e.state)?`<div class="row">${icon('pin')}${esc(location(e.city,e.state))}</div>`:''}
          ${timeRange(e.start_time,e.end_time)?`<div class="row">${icon('clock')}${timeRange(e.start_time,e.end_time)}</div>`:''}
        </div>
      </button>`).join('');
  } catch (err) {
    el.className = 'empty';
    el.innerHTML = `<p>Something went wrong loading the calendar.</p>`;
  }
}

// ---------- About ----------
function renderAbout() {
  pageShell(`
    <div class="page-top">
      <section style="position:relative;height:60vh;min-height:420px;overflow:hidden">
        <img src="${IMG.hero}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0" alt="Wade Preston performing" />
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(12,12,13,1),rgba(12,12,13,.4) 50%,rgba(12,12,13,.3))"></div>
        <div style="position:absolute;bottom:0;left:0;right:0;padding:0 24px 48px">
          <div class="container"><span class="eyebrow">About</span><h1 style="font-size:clamp(3rem,7vw,5rem);line-height:.95;margin-top:16px">Wade Preston</h1></div>
        </div>
      </section>
      <section class="section" style="padding-top:64px">
        <div class="container" style="max-width:760px">
          ${SITE.bio.map(p=>`<p style="color:rgba(242,239,230,.8);line-height:1.8;font-size:18px;margin-bottom:24px">${esc(p)}</p>`).join('')}
        </div>
      </section>
      <section class="container" style="padding-bottom:96px">
        <div class="grid-2">
          <div class="portrait"><img src="${IMG.aboutSecondary}" alt="Portrait of Wade Preston" /></div>
          <div><h2 style="font-size:30px;margin-bottom:24px">Career & Highlights</h2><p style="color:rgba(242,239,230,.75);line-height:1.7">Career highlights and additional details can be added here — notable productions, venues, collaborations, and milestones from Wade's career on stage and in the studio.</p></div>
        </div>
      </section>
    </div>
  `);
}

// ---------- Calendar ----------
let calCursor = new Date();
calCursor.setDate(1);
function renderCalendar() {
  pageShell(`
    <div class="page-top">
      <div class="page-title"><span class="eyebrow">Calendar</span><h1>Where You Can See Wade</h1><p>Browse upcoming performances by month. Select any event to see venue, time, and location details.</p></div>
      <div class="container" style="max-width:900px">
        <div class="cal-nav">
          <button onclick="calMove(-1)">${icon('chevL')}</button>
          <h2 id="calTitle"></h2>
          <button onclick="calMove(1)">${icon('chevR')}</button>
        </div>
        <div id="calGrid"></div>
        <div id="calList"></div>
      </div>
    </div>
  `);
  drawCalendar();
}
window.calMove = function (dir) { calCursor = new Date(calCursor.getFullYear(), calCursor.getMonth() + dir, 1); drawCalendar(); };
async function drawCalendar() {
  try { if (!EVENTS.length) await loadEvents(); } catch {}
  const grid = document.getElementById('calGrid');
  const list = document.getElementById('calList');
  const title = document.getElementById('calTitle');
  const y = calCursor.getFullYear(), m = calCursor.getMonth();
  title.textContent = formatMonthYear(y, m);
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const byDate = {};
  EVENTS.forEach(e => { if (e.event_date) (byDate[e.event_date] ||= []).push(e); });
  const prefix = `${y}-${pad(m+1)}-`;
  const monthEvents = EVENTS.filter(e => (e.event_date||'').startsWith(prefix)).sort((a,b)=>{ const d=(a.event_date||'').localeCompare(b.event_date||''); return d!==0?d:(a.start_time||'').localeCompare(b.start_time||''); });
  const todayKey = todayStr();
  const dows = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let cells = '';
  dows.forEach(d => cells += `<div class="cal-dow">${d}</div>`);
  for (let i=0;i<firstDay;i++) cells += `<div class="cal-cell empty-cell"></div>`;
  for (let d=1; d<=daysInMonth; d++) {
    const key = `${y}-${pad(m+1)}-${pad(d)}`;
    const evts = byDate[key] || [];
    cells += `<div class="cal-cell ${key===todayKey?'today':''}">
      <div class="dnum">${d}</div>
      ${evts.slice(0,2).map(e=>`<button class="cal-evt" onclick="openEvent(${e.id})"><div>${esc(e.title)}</div>${e.start_time?`<div class="t">${timeRange(e.start_time,e.end_time)}</div>`:''}</button>`).join('')}
      ${evts.length>2?`<div class="cal-more">+${evts.length-2} more</div>`:''}
    </div>`;
  }
  grid.innerHTML = cells;
  if (monthEvents.length === 0) {
    list.innerHTML = `<div class="empty">${icon('cdays')}<p style="font-family:var(--font-heading);font-size:18px;color:rgba(242,239,230,.7)">No performances scheduled this month.</p></div>`;
  } else {
    list.innerHTML = monthEvents.map(e => {
      const [, , dd] = e.event_date.split('-');
      return `<button class="cal-list-item" onclick="openEvent(${e.id})">
        <div class="day"><div class="n">${Number(dd)}</div><div class="m">${formatShortDate(e.event_date).split(' ')[0]}</div></div>
        <div class="body"><h3>${esc(e.title)}</h3>${e.venue?`<p style="font-size:14px;color:rgba(242,239,230,.8)">${esc(e.venue)}</p>`:''}
        <div class="meta">${location(e.city,e.state)?`<span>${icon('pin')}${esc(location(e.city,e.state))}</span>`:''}${timeRange(e.start_time,e.end_time)?`<span>${icon('clock')}${timeRange(e.start_time,e.end_time)}</span>`:''}</div></div>
      </button>`;
    }).join('');
  }
}

// ---------- Contact ----------
function renderContact() {
  pageShell(`
    <div class="page-top">
      <div class="container">
        <div class="contact-grid">
          <div>
            <span class="eyebrow">Contact</span>
            <h1 style="font-size:clamp(2.5rem,5vw,3.75rem);line-height:.95;margin:20px 0 32px">Get in touch</h1>
            <p style="color:rgba(242,239,230,.75);line-height:1.7;margin-bottom:32px;max-width:420px">For inquiries about performances, press, or professional opportunities, send a message and it will reach Wade's team directly.</p>
            <a href="mailto:${SITE.email}" style="display:inline-flex;gap:12px;color:var(--primary);align-items:center">${icon('mail')}<span style="font-family:var(--font-heading);font-size:18px">${SITE.email}</span></a>
          </div>
          <div class="contact-card">
            <form onsubmit="return submitContact(event)">
              <div class="form-field"><label for="cName">Name</label><input id="cName" type="text" required /></div>
              <div class="form-field"><label for="cEmail">Email</label><input id="cEmail" type="email" required /></div>
              <div class="form-field"><label for="cMsg">Message</label><textarea id="cMsg" rows="5" required></textarea></div>
              <button class="btn" type="submit" style="width:100%;justify-content:center">${icon('send')} Send Message</button>
            </form>
            <div id="cSent" style="display:none;text-align:center;padding:48px 0">
              <div style="width:56px;height:56px;border-radius:50%;background:rgba(212,168,67,.15);display:inline-flex;align-items:center;justify-content:center;color:var(--primary);margin-bottom:16px">${icon('check')}</div>
              <h2 style="font-size:24px;margin-bottom:8px">Message ready</h2>
              <p style="color:var(--muted);font-size:14px">Your email app should have opened. If not, email <a href="mailto:${SITE.email}" style="color:var(--primary)">${SITE.email}</a>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
}
window.submitContact = function (e) {
  e.preventDefault();
  const name = document.getElementById('cName').value;
  const email = document.getElementById('cEmail').value;
  const msg = document.getElementById('cMsg').value;
  const subject = encodeURIComponent(`Website inquiry from ${name || 'a visitor'}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`);
  window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  document.querySelector('.contact-card form').style.display = 'none';
  document.getElementById('cSent').style.display = 'block';
  return false;
};

// ---------- Event modal ----------
window.openEvent = function (id) {
  const e = EVENTS.find(x => x.id === id);
  if (!e) return;
  const loc = location(e.city, e.state);
  const tr = timeRange(e.start_time, e.end_time);
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.onclick = (ev) => { if (ev.target === overlay) overlay.remove(); };
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">${icon('x')}</button>
      <div class="modal-body">
        <div style="display:flex;align-items:center;gap:8px;color:var(--primary);margin-bottom:16px">${icon('calendar')}<span class="eyebrow">${formatDate(e.event_date)}</span></div>
        <h2>${esc(e.title)}</h2>
        ${tr?`<div class="detail"><div class="ic">${icon('clock')}</div><div><div class="lbl">Time</div><div class="val">${tr}</div></div></div>`:''}
        ${e.venue?`<div class="detail"><div class="ic">${icon('pin')}</div><div><div class="lbl">Venue</div><div class="val">${esc(e.venue)}</div></div></div>`:''}
        ${(loc||e.address)?`<div class="detail"><div class="ic">${icon('pin')}</div><div><div class="lbl">Location</div><div class="val">${[e.address,loc].filter(Boolean).join(' — ')}</div></div></div>`:''}
        ${e.description?`<div class="about-block"><div class="lbl">About</div><p>${esc(e.description)}</p></div>`:''}
      </div>
    </div>`;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  const escClose = (ev) => { if (ev.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', escClose); document.body.style.overflow=''; } };
  document.addEventListener('keydown', escClose);
};

// ---------- Admin ----------
function renderAdmin() {
  if (!TOKEN) return renderLogin();
  renderDashboard();
}
function renderLogin() {
  document.getElementById('app').innerHTML = `
    <div class="login-wrap">
      <div class="login-card">
        <div class="head"><img src="${IMG.logo}" alt="Wade Preston" /><div class="eyebrow">Backstage</div><h1 style="margin-top:12px">Admin Sign In</h1></div>
        <div class="login-box">
          <div id="loginError" style="display:none" class="login-error">${icon('alert')}<span id="loginErrMsg"></span></div>
          <form onsubmit="return doLogin(event)">
            <div class="form-field"><label for="lUser">Email / Username</label><input id="lUser" type="text" autofocus required /></div>
            <div class="form-field"><label for="lPass">Password</label><input id="lPass" type="password" required /></div>
            <button class="btn" type="submit" id="lBtn">Sign In</button>
          </form>
          <div class="login-links"><a href="#/">← Back to site</a></div>
        </div>
      </div>
    </div>`;
}
window.doLogin = async function (e) {
  e.preventDefault();
  const btn = document.getElementById('lBtn');
  const err = document.getElementById('loginError');
  err.style.display = 'none';
  btn.disabled = true; btn.innerHTML = '<div class="spinner"></div> Signing in...';
  try {
    const username = document.getElementById('lUser').value;
    const password = document.getElementById('lPass').value;
    const r = await api('/api/login', { method: 'POST', body: JSON.stringify({ username, password }) });
    TOKEN = r.token; localStorage.setItem('wp_token', TOKEN);
    location.hash = '#/admin';
    renderDashboard();
  } catch (ex) {
    err.style.display = 'flex';
    document.getElementById('loginErrMsg').textContent = 'Your username or password is incorrect.';
    btn.disabled = false; btn.textContent = 'Sign In';
  }
  return false;
};
function renderDashboard() {
  document.getElementById('app').innerHTML = `
    <div class="admin-page">
      <header class="admin-header"><div class="admin-header-inner">
        <div style="display:flex;align-items:center;gap:16px"><img src="${IMG.logo}" class="admin-logo" alt="Wade Preston" /><div><div class="eyebrow" style="font-size:10px">Backstage</div><h1 style="font-size:20px;line-height:1">Wade's Dashboard</h1></div></div>
        <button class="btn-outline btn" style="padding:8px 16px" onclick="doLogout()">${icon('logout')} Logout</button>
      </div></header>
      <main class="admin-main">
        <div class="admin-stats">
          <div class="admin-stat"><div class="ic">${icon('cdays')}</div><div><div class="eyebrow">Upcoming Events</div><div class="n" id="upCount">—</div></div></div>
          <button class="btn" onclick="openForm()">${icon('plus')} Add Event</button>
        </div>
        <div id="adminList" class="loading"><div class="spinner"></div></div>
      </main>
      <button class="admin-fab" onclick="openForm()">${icon('plus')}</button>
    </div>`;
  loadAdmin();
}
window.doLogout = async function () {
  try { await api('/api/logout', { method: 'POST' }); } catch {}
  TOKEN = ''; localStorage.removeItem('wp_token');
  renderLogin();
};
async function loadAdmin() {
  const el = document.getElementById('adminList');
  try {
    await loadEvents();
    const { up, past } = sortAdmin(EVENTS);
    document.getElementById('upCount').textContent = up.length;
    if (!EVENTS.length) {
      el.className = 'empty';
      el.innerHTML = `${icon('cdays')}<p style="font-family:var(--font-heading);font-size:24px;margin-bottom:8px">No upcoming events.</p><p style="font-size:14px">Add an event to get started.</p>`;
      return;
    }
    el.className = '';
    el.innerHTML = `<div class="admin-list">${sectionHTML('Upcoming Events', up, false)}${past.length?sectionHTML('Past Events', past, true):''}</div>`;
  } catch (ex) {
    el.className = 'empty';
    el.innerHTML = `<p>Something went wrong loading your events.</p>`;
  }
}
function sectionHTML(title, events, muted) {
  if (!events.length) return '';
  return `<div style="margin-bottom:40px"><h2 class="eyebrow" style="margin-bottom:20px">${title}</h2>
    ${events.map(e => `<div class="admin-row ${muted?'past':''}">
      <div class="info"><h3>${esc(e.title)}</h3><div class="meta">
        <span>${formatDate(e.event_date)}</span>${e.venue?`<span style="color:rgba(242,239,230,.7)">· ${esc(e.venue)}</span>`:''}${location(e.city,e.state)?`<span>· ${esc(location(e.city,e.state))}</span>`:''}${timeRange(e.start_time,e.end_time)?`<span>· ${timeRange(e.start_time,e.end_time)}</span>`:''}
      </div></div>
      <div class="admin-actions"><button class="btn-edit" onclick="openForm(${e.id})">${icon('pencil')} Edit</button><button class="btn-del" onclick="openDelete(${e.id})">${icon('trash')} Delete</button></div>
    </div>`).join('')}</div>`;
}

// ---------- Admin form ----------
window.openForm = function (id) {
  editingId = id || null;
  const e = id ? EVENTS.find(x => x.id === id) : {};
  const f = { title:'', event_date:'', start_time:'', end_time:'', venue:'', city:'', state:'', address:'', description:'', external_url:'', ...e };
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'formOverlay';
  overlay.onclick = (ev) => { if (ev.target === overlay) closeForm(); };
  overlay.innerHTML = `
    <div class="modal form-modal" role="dialog" aria-modal="true">
      <div class="form-head"><h2>${id?'Edit Event':'Add Event'}</h2><button class="modal-close" onclick="closeForm()">${icon('x')}</button></div>
      <form id="eventForm" onsubmit="return saveEvent(event)">
        <div class="form-field"><label>Event Name <span class="req">*</span></label><input name="title" value="${esc(f.title)}" required autofocus /></div>
        <div class="form-field"><label>Date <span class="req">*</span></label><input type="date" name="event_date" value="${esc(f.event_date)}" required /></div>
        <div class="form-grid-2">
          <div class="form-field"><label>Start Time</label><input type="time" name="start_time" value="${esc(f.start_time)}" /></div>
          <div class="form-field"><label>End Time</label><input type="time" name="end_time" value="${esc(f.end_time)}" /></div>
        </div>
        <div class="form-field"><label>Venue</label><input name="venue" value="${esc(f.venue)}" /></div>
        <div class="form-grid-2">
          <div class="form-field"><label>City</label><input name="city" value="${esc(f.city)}" /></div>
          <div class="form-field"><label>State</label><input name="state" value="${esc(f.state)}" /></div>
        </div>
        <div class="form-field"><label>Location / Address</label><input name="address" value="${esc(f.address)}" /></div>
        <div class="form-field"><label>Description</label><textarea name="description" rows="4">${esc(f.description)}</textarea></div>
        <p class="form-hint">Only Event Name and Date are required. All other fields are optional.</p>
        <div class="form-actions"><button type="button" class="btn-outline btn" onclick="closeForm()">Cancel</button><button type="submit" class="btn" id="saveBtn">Save Event</button></div>
      </form>
    </div>`;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
};
window.closeForm = function () { const o = document.getElementById('formOverlay'); if (o) o.remove(); document.body.style.overflow=''; editingId = null; };
window.saveEvent = async function (e) {
  e.preventDefault();
  const btn = document.getElementById('saveBtn');
  const data = Object.fromEntries(new FormData(e.target).entries());
  btn.disabled = true; btn.innerHTML = '<div class="spinner"></div> Saving...';
  try {
    if (editingId) await api('/api/events/' + editingId, { method: 'PUT', body: JSON.stringify(data) });
    else await api('/api/events', { method: 'POST', body: JSON.stringify(data) });
    document.querySelector('.form-modal .form-head').nextElementSibling.innerHTML = `<div class="saved-state"><div class="check">${icon('check')}</div><p style="font-family:var(--font-heading);font-size:24px">Event Saved</p></div>`;
    setTimeout(() => { closeForm(); loadAdmin(); }, 700);
  } catch (ex) {
    alert(ex.message || 'Unable to save the event.');
    btn.disabled = false; btn.textContent = 'Save Event';
  }
  return false;
};

// ---------- Delete ----------
window.openDelete = function (id) {
  const e = EVENTS.find(x => x.id === id);
  if (!e) return;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'delOverlay';
  overlay.onclick = (ev) => { if (ev.target === overlay) overlay.remove(); };
  overlay.innerHTML = `
    <div class="modal" style="max-width:440px" role="alertdialog" aria-modal="true">
      <div class="modal-body">
        <div style="display:flex;gap:16px;margin-bottom:24px"><div style="width:44px;height:44px;border-radius:2px;background:rgba(192,73,47,.1);border:1px solid rgba(192,73,47,.3);display:flex;align-items:center;justify-content:center;color:var(--destructive)">${icon('alert')}</div><div><h2 style="font-size:24px;margin-bottom:4px">Delete this event?</h2><p style="font-size:14px;color:var(--muted)">This cannot be undone.</p></div></div>
        <div style="padding:16px;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:2px;margin-bottom:24px"><p style="font-family:var(--font-heading);font-size:18px">${esc(e.title)}</p><p style="font-size:14px;color:var(--muted);margin-top:4px">${formatDate(e.event_date)}</p></div>
        <div class="form-actions"><button class="btn-outline btn" onclick="document.getElementById('delOverlay').remove()">Cancel</button><button class="btn btn-danger" id="delBtn" onclick="confirmDelete(${id})">Delete</button></div>
      </div>
    </div>`;
  document.body.appendChild(overlay);
};
window.confirmDelete = async function (id) {
  const btn = document.getElementById('delBtn');
  btn.disabled = true; btn.innerHTML = '<div class="spinner"></div> Deleting...';
  try { await api('/api/events/' + id, { method: 'DELETE' }); document.getElementById('delOverlay').remove(); loadAdmin(); }
  catch (ex) { alert('Unable to delete the event.'); btn.disabled=false; btn.textContent='Delete'; }
};

// ---------- boot ----------
route();