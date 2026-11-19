/* We Are Zion - Instagram Reels server (Node 18+, Express).
   Uses "Instagram API with Instagram Login" (graph.instagram.com).
   Tokens and the app secret stay on the server; the website only calls GET /api/instagram/reels. */
require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const { IG_APP_ID, IG_APP_SECRET, IG_REDIRECT_URI, ADMIN_KEY } = process.env;
const PORT = process.env.PORT || 3000;
const ORIGINS = (process.env.FRONTEND_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(__dirname, 'data'));
const TOKEN_FILE = path.join(DATA_DIR, 'token.json');
const CACHE_FILE = path.join(DATA_DIR, 'reels-cache.json');
const SCOPE = 'instagram_business_basic';
const CACHE_MS = 15 * 60 * 1000;
fs.mkdirSync(DATA_DIR, { recursive: true });

const readJson = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } };
const writeJson = (f, d) => fs.writeFileSync(f, JSON.stringify(d), { mode: 0o600 });
const configured = () => !!(IG_APP_ID && IG_APP_SECRET && IG_REDIRECT_URI);

/* ---------- token management ---------- */
let state = { error: null, lastFetch: null };
const getToken = () => readJson(TOKEN_FILE); // { access_token, user_id, username, expires_at, refreshed_at }

async function igJson(url, opts) {
  const r = await fetch(url, opts);
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error((j.error && (j.error.message || j.error_message)) || j.error_message || ('HTTP ' + r.status));
  return j;
}
async function exchangeCode(code) {
  const body = new URLSearchParams({ client_id: IG_APP_ID, client_secret: IG_APP_SECRET, grant_type: 'authorization_code', redirect_uri: IG_REDIRECT_URI, code });
  const short = await igJson('https://api.instagram.com/oauth/access_token', { method: 'POST', body });
  const s = short.data ? short.data[0] : short; // some responses wrap in data[]
  const long = await igJson('https://graph.instagram.com/access_token?' + new URLSearchParams({ grant_type: 'ig_exchange_token', client_secret: IG_APP_SECRET, access_token: s.access_token }));
  let username = '';
  try { username = (await igJson('https://graph.instagram.com/me?fields=username&access_token=' + long.access_token)).username || ''; } catch (e) {}
  const now = Date.now();
  writeJson(TOKEN_FILE, { access_token: long.access_token, user_id: String(s.user_id), username, expires_at: now + long.expires_in * 1000, refreshed_at: now });
}
async function refreshToken() {
  const t = getToken(); if (!t) return;
  if (Date.now() - t.refreshed_at < 24 * 3600 * 1000) return; // must be >= 24h old
  try {
    const j = await igJson('https://graph.instagram.com/refresh_access_token?' + new URLSearchParams({ grant_type: 'ig_refresh_token', access_token: t.access_token }));
    const now = Date.now();
    writeJson(TOKEN_FILE, Object.assign(t, { access_token: j.access_token, expires_at: now + j.expires_in * 1000, refreshed_at: now }));
    state.error = null; console.log('Instagram token refreshed');
  } catch (e) { state.error = 'Token refresh failed: ' + e.message; console.error(state.error); }
}
// refresh once a day; tokens last 60 days, each refresh adds 60 more
setInterval(refreshToken, 24 * 3600 * 1000 + 60000).unref();
setTimeout(refreshToken, 15000).unref();

/* ---------- reels ---------- */
const FIELDS = 'id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp';
async function fetchReels(token) {
  const out = []; const seen = new Set();
  let url = 'https://graph.instagram.com/me/media?' + new URLSearchParams({ fields: FIELDS, limit: '50', access_token: token });
  for (let page = 0; page < 4 && url; page++) { // up to 200 latest posts
    const j = await igJson(url);
    for (const m of j.data || []) {
      if (m.media_product_type !== 'REELS' || seen.has(m.id)) continue; // real Reels only
      const mm = /\/(?:reel|reels|p)\/([\w-]+)/.exec(m.permalink || '');
      if (!mm) continue;
      seen.add(m.id);
      out.push({ id: m.id, code: mm[1], caption: m.caption || '', permalink: m.permalink, thumbnail: m.thumbnail_url || '', timestamp: m.timestamp });
    }
    url = j.paging && j.paging.next || null;
  }
  return out.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // newest first
}
let inflight = null;
async function getReels(force) {
  const cache = readJson(CACHE_FILE);
  if (!force && cache && Date.now() - cache.t < CACHE_MS) return { items: cache.items, cached: true, stale: false };
  const t = getToken();
  if (!t) return { items: cache ? cache.items : [], cached: !!cache, stale: true, error: 'not_connected' };
  try {
    inflight = inflight || fetchReels(t.access_token).finally(() => { inflight = null; });
    const items = await inflight;
    writeJson(CACHE_FILE, { t: Date.now(), items });
    state.error = null; state.lastFetch = new Date().toISOString();
    return { items, cached: false, stale: false };
  } catch (e) { // keep serving cached reels if Instagram fails
    state.error = e.message; console.error('Instagram fetch failed:', e.message);
    return { items: cache ? cache.items : [], cached: !!cache, stale: true, error: 'instagram_unavailable' };
  }
}

/* ---------- app ---------- */
const app = express();
app.disable('x-powered-by');
app.use((req, res, next) => {
  const o = req.headers.origin;
  if (o && ORIGINS.includes(o)) { res.setHeader('Access-Control-Allow-Origin', o); res.setHeader('Vary', 'Origin'); }
  next();
});

app.get('/api/instagram/reels', async (req, res) => {
  const r = await getReels(false);
  res.setHeader('Cache-Control', 'public, max-age=300');
  const limit = Math.min(parseInt(req.query.limit, 10) || 30, 100);
  res.json({ items: r.items.slice(0, limit).map(({ code, caption, permalink, thumbnail, timestamp }) => ({ code, caption, permalink, thumbnail, timestamp })), stale: r.stale, error: r.error || null });
});

app.get('/api/instagram/status', (req, res) => {
  const t = getToken();
  res.json({ configured: configured(), connected: !!t, account: t ? t.username : null,
    tokenExpiresAt: t ? new Date(t.expires_at).toISOString() : null, lastFetch: state.lastFetch, lastError: state.error });
});

const safeEq = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
const cookie = (req, n) => ((req.headers.cookie || '').split(/;\s*/).map(s => s.split('=')).find(p => p[0] === n) || [])[1];

// 1) Account owner opens: /auth/instagram?key=ADMIN_KEY  (or sends this link to the client)
app.get('/auth/instagram', (req, res) => {
  if (!configured()) return res.status(500).send('Server is missing IG_APP_ID / IG_APP_SECRET / IG_REDIRECT_URI in .env');
  if (!ADMIN_KEY || !safeEq(req.query.key || '', ADMIN_KEY)) return res.status(403).send('Forbidden');
  const st = crypto.randomBytes(16).toString('hex');
  res.setHeader('Set-Cookie', 'ig_state=' + st + '; HttpOnly; Secure; SameSite=Lax; Path=/auth; Max-Age=600');
  res.redirect('https://www.instagram.com/oauth/authorize?' + new URLSearchParams({ client_id: IG_APP_ID, redirect_uri: IG_REDIRECT_URI, response_type: 'code', scope: SCOPE, state: st }));
});
// 2) Instagram sends the account owner back here
app.get('/auth/instagram/callback', async (req, res) => {
  if (req.query.error) return res.status(400).send('Authorization was cancelled or denied.');
  if (!req.query.code || !req.query.state || !safeEq(req.query.state, cookie(req, 'ig_state') || '')) return res.status(400).send('Invalid state. Please start again.');
  try {
    await exchangeCode(String(req.query.code).replace(/#_$/, ''));
    await getReels(true);
    res.send('<h2>Instagram connected</h2><p>You can close this page. New reels will now appear on the website automatically.</p>');
  } catch (e) { console.error(e); state.error = e.message; res.status(500).send('Could not connect Instagram: ' + e.message); }
});

// Serve the website too (optional, same-origin): the folder above /server
const SITE = path.resolve(__dirname, '..');
app.use((req, res, next) => { if (/^\/(server|_backup)/i.test(decodeURIComponent(req.path))) return res.status(404).end(); next(); });
app.use(express.static(SITE, { index: 'index.html', dotfiles: 'ignore' }));

app.listen(PORT, () => console.log('WAZ Instagram server on :' + PORT + (configured() ? '' : '  (set IG_* values in .env)')));
