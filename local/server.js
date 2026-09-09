const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ---- Accounts ----
// Two logins: one for Wade (manages his gigs) and one for you (backup/admin).
// Change the username/password values below to whatever you want.
const ACCOUNTS = [
  { username: 'wade', password: 'piano', name: 'Wade', role: 'performer' },
  { username: 'admin', password: 'wadepreston', name: 'Administrator', role: 'admin' },
];

// ---- SQLite database (auto-created on first run) ----
const db = new Database(path.join(__dirname, 'events.sqlite'));
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    event_date TEXT NOT NULL,
    start_time TEXT,
    end_time TEXT,
    venue TEXT,
    city TEXT,
    state TEXT,
    address TEXT,
    description TEXT,
    external_url TEXT,
    created_date TEXT DEFAULT (datetime('now')),
    updated_date TEXT DEFAULT (datetime('now'))
  )
`);

// Seed your existing events on first run
const { c } = db.prepare('SELECT COUNT(*) c FROM events').get();
if (c === 0) {
  const seed = [
    { title: '(Demo) Broadway Night', event_date: '2026-09-26', start_time: '19:30', end_time: '21:30', venue: 'Imperial Theatre', city: 'New York', state: 'NY', address: '249 W 45th St', description: 'Sample event — an evening of Broadway favorites. Delete this from the dashboard and add your real performances.', external_url: '' },
    { title: '(Demo) An Evening of Billy Joel', event_date: '2026-10-17', start_time: '20:00', end_time: '', venue: 'The Paramount', city: 'Huntington', state: 'NY', address: '370 New York Ave', description: "Sample event — a celebration of the Piano Man's greatest hits. Replace with your real show details.", external_url: '' },
    { title: '(Demo) Solo Piano Sessions', event_date: '2026-11-14', start_time: '18:00', end_time: '19:30', venue: 'Cafe Carlyle', city: 'New York', state: 'NY', address: '', description: 'Sample event — an intimate solo piano set. Edit or delete from your dashboard.', external_url: '' },
    { title: 'xcZxzC', event_date: '2027-10-25', start_time: '22:26', end_time: '22:50', venue: 'Park', city: 'jefferson twp.', state: 'PA', address: '177 wimmers rd', description: '', external_url: '' },
  ];
  const ins = db.prepare(`INSERT INTO events (title,event_date,start_time,end_time,venue,city,state,address,description,external_url) VALUES (@title,@event_date,@start_time,@end_time,@venue,@city,@state,@address,@description,@external_url)`);
  for (const e of seed) ins.run(e);
}

// ---- Simple in-memory token store (single local process) ----
const tokens = new Set();

function getToken(req) {
  return (req.headers.authorization || '').replace('Bearer ', '').trim();
}
function auth(req, res, next) {
  const t = getToken(req);
  if (t && tokens.has(t)) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

// ---- Auth ----
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  const account = ACCOUNTS.find(a => a.username === username && a.password === password);
  if (account) {
    const token = crypto.randomUUID();
    tokens.add(token);
    return res.json({ token, name: account.name, role: account.role });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/api/logout', (req, res) => {
  tokens.delete(getToken(req));
  res.json({ ok: true });
});

// ---- Events CRUD ----
app.get('/api/events', (req, res) => {
  res.json(db.prepare('SELECT * FROM events ORDER BY event_date DESC').all());
});

app.post('/api/events', auth, (req, res) => {
  const e = req.body || {};
  if (!e.title || !e.event_date) return res.status(400).json({ error: 'Event name and date are required' });
  const info = db.prepare(`INSERT INTO events (title,event_date,start_time,end_time,venue,city,state,address,description,external_url) VALUES (@title,@event_date,@start_time,@end_time,@venue,@city,@state,@address,@description,@external_url)`).run({
    title: e.title, event_date: e.event_date, start_time: e.start_time || '', end_time: e.end_time || '',
    venue: e.venue || '', city: e.city || '', state: e.state || '', address: e.address || '',
    description: e.description || '', external_url: e.external_url || ''
  });
  res.json(db.prepare('SELECT * FROM events WHERE id = ?').get(info.lastInsertRowid));
});

app.put('/api/events/:id', auth, (req, res) => {
  const id = Number(req.params.id);
  const cur = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
  if (!cur) return res.status(404).json({ error: 'Not found' });
  const e = { ...cur, ...req.body, id, updated_date: new Date().toISOString() };
  db.prepare(`UPDATE events SET title=@title,event_date=@event_date,start_time=@start_time,end_time=@end_time,venue=@venue,city=@city,state=@state,address=@address,description=@description,external_url=@external_url,updated_date=@updated_date WHERE id=@id`).run(e);
  res.json(db.prepare('SELECT * FROM events WHERE id = ?').get(id));
});

app.delete('/api/events/:id', auth, (req, res) => {
  db.prepare('DELETE FROM events WHERE id = ?').run(Number(req.params.id));
  res.json({ ok: true });
});

// ---- Serve the website ----
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log('\n  ─────────────────────────────────────────');
  console.log('  Wade Preston site is running:');
  console.log(`  →  http://localhost:${PORT}`);
  console.log('  Logins:');
  ACCOUNTS.forEach(a => console.log(`    ${a.username} / ${a.password}   (${a.name})`));
  console.log('  ─────────────────────────────────────────\n');
});