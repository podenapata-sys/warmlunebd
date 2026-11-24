/* Bakaina customer accounts on Firebase (Authentication + Firestore).
 *   mountPortal(el, opts)  login / registration / profile page  (preview.html?view=account)
 *   mountAdmin(el)         Customers section of the dashboard     (admin.html)
 * Settings: firebase-config.js · Security: firestore.rules
 */
const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
let fb = null;

async function load() {
  if (fb) return fb;
  const cfg = window.FIREBASE_CONFIG;
  if (!cfg || !cfg.apiKey || !cfg.projectId) return null;
  const [app, auth, fs] = await Promise.all([import(SDK + 'firebase-app.js'), import(SDK + 'firebase-auth.js'), import(SDK + 'firebase-firestore.js')]);
  const a = app.initializeApp(cfg);
  fb = { A: auth, F: fs, auth: auth.getAuth(a), db: fs.getFirestore(a) };
  return fb;
}

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const PHONE = /^01[3-9]\d{8}$/;
const cleanPhone = (v) => String(v || '').replace(/[\s-]/g, '').replace(/^\+?88/, '');
const fmtDate = (ts) => { try { const d = ts && ts.toDate ? ts.toDate() : null; return d ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—'; } catch (e) { return '—'; } };

function friendly(err) {
  const c = (err && err.code) || '';
  return ({
    'auth/email-already-in-use': 'An account with this email already exists. Please log in instead.',
    'auth/invalid-credential': 'Email or password is not correct.',
    'auth/wrong-password': 'Email or password is not correct.',
    'auth/user-not-found': 'Email or password is not correct.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Please use a password with at least 6 characters.',
    'auth/too-many-requests': 'Too many tries. Please wait a few minutes and try again.',
    'auth/network-request-failed': 'No internet connection. Please check and try again.',
    'permission-denied': 'Permission denied.',
  })[c] || 'Something went wrong. Please try again.';
}

/* ======================= Customer portal ======================= */
export async function mountPortal(el, opts = {}) {
  const icon = opts.icon || (() => '');
  el.innerHTML = '<div class="acc-card acc-loading" aria-busy="true"><span class="acc-spin" aria-hidden="true"></span>Loading your account…</div>';
  let f;
  try { f = await load(); } catch (e) { f = undefined; }
  if (f === null) {
    el.innerHTML = '<div class="acc-card acc-note"><h2>Accounts are being set up</h2><p>Customer login will open very soon. You can still order without an account, or talk to us on WhatsApp.</p>' +
      (opts.helpUrl ? '<a class="btn btn-brand" href="' + esc(opts.helpUrl) + '" target="_blank" rel="noopener">' + icon('chat') + 'Chat on WhatsApp</a>' : '') + '</div>';
    return;
  }
  if (!f) { el.innerHTML = '<div class="acc-card acc-note"><h2>Could not load your account</h2><p>Please check your internet connection and refresh the page.</p></div>'; return; }
  const { A, F, auth, db } = f;
  let tab = new URLSearchParams(location.search).get('tab') === 'register' ? 'register' : 'login';

  const field = (id, label, type, extra) => '<div class="acc-field"><label for="' + id + '">' + label + '</label><input id="' + id + '" name="' + id.replace(/^a-/, '') + '" type="' + type + '" ' + (extra || '') + '></div>';
  const pwField = (id, label, ac) => '<div class="acc-field"><label for="' + id + '">' + label + '</label><div class="acc-pw"><input id="' + id + '" name="password" type="password" autocomplete="' + ac + '" minlength="6" required><button type="button" class="acc-eye" data-eye aria-label="Show password" aria-pressed="false">Show</button></div></div>';

  function signedOut() {
    el.innerHTML = '<div class="acc-wrap"><div class="acc-card"><div class="acc-tabs" role="tablist" aria-label="Account">' +
      '<button type="button" role="tab" id="t-login" aria-selected="' + (tab === 'login') + '" aria-controls="acc-panel" data-acc-tab="login">Log in</button>' +
      '<button type="button" role="tab" id="t-register" aria-selected="' + (tab === 'register') + '" aria-controls="acc-panel" data-acc-tab="register">Create account</button></div>' +
      '<div id="acc-panel" role="tabpanel" aria-labelledby="t-' + tab + '">' + (tab === 'login'
        ? '<form class="acc-form" data-login novalidate><h2>Welcome back</h2><p class="acc-sub">Log in to see your details and order faster.</p>' +
          field('a-email', 'Email', 'email', 'autocomplete="email" required') + pwField('a-pass', 'Password', 'current-password') +
          '<p class="acc-err" role="alert" data-err hidden></p><button class="btn btn-accent acc-submit" type="submit">Log in</button>' +
          '<button type="button" class="acc-link" data-forgot>Forgot password?</button></form>'
        : '<form class="acc-form" data-register novalidate><h2>Create your account</h2><p class="acc-sub">Save your details once, check out faster every time.</p>' +
          field('a-name', 'Full name', 'text', 'autocomplete="name" maxlength="80" required') +
          field('a-phone', 'Mobile number', 'tel', 'autocomplete="tel" inputmode="numeric" placeholder="01XXXXXXXXX" maxlength="18" required') +
          field('a-email', 'Email', 'email', 'autocomplete="email" required') + pwField('a-pass', 'Password (at least 6 characters)', 'new-password') +
          '<p class="acc-err" role="alert" data-err hidden></p><button class="btn btn-accent acc-submit" type="submit">Create account</button>' +
          '<p class="acc-fine">By creating an account you agree to our <a href="privacy.html">privacy policy</a>. We never share your details.</p></form>') +
      '</div></div>' + perks() + '</div>';
  }
  function perks() {
    return '<aside class="acc-perks"><h3>Why create an account?</h3><ul>' +
      '<li>' + icon('truck') + '<span><strong>Faster checkout</strong>Your name and mobile are filled in for you.</span></li>' +
      '<li>' + icon('heart') + '<span><strong>Your wishlist</strong>Keep the products you like in one place.</span></li>' +
      '<li>' + icon('chat') + '<span><strong>Easy support</strong>We can find your details quickly when you message us.</span></li></ul></aside>';
  }
  function signedIn(user, prof) {
    const p = prof || {}, first = (p.name || user.displayName || '').split(' ')[0];
    el.innerHTML = '<div class="acc-wrap"><div class="acc-card"><div class="acc-hello"><span class="acc-avatar" aria-hidden="true">' + esc((p.name || user.email || '?').charAt(0).toUpperCase()) + '</span>' +
      '<div><h2>' + (first ? 'Hi, ' + esc(first) + '!' : 'Complete your profile') + '</h2><p class="acc-sub">' + esc(user.email) + '</p></div></div>' +
      (prof ? '' : '<p class="acc-note-in">Please add your name and mobile number so we can deliver your orders.</p>') +
      '<form class="acc-form" data-profile novalidate>' +
        field('a-name', 'Full name', 'text', 'autocomplete="name" maxlength="80" required value="' + esc(p.name || user.displayName || '') + '"') +
        field('a-phone', 'Mobile number', 'tel', 'autocomplete="tel" inputmode="numeric" placeholder="01XXXXXXXXX" maxlength="18" required value="' + esc(p.phone || '') + '"') +
        '<div class="acc-field"><label for="a-address">Delivery address <span class="acc-opt">(optional)</span></label><textarea id="a-address" name="address" rows="3" maxlength="300" autocomplete="street-address">' + esc(p.address || '') + '</textarea></div>' +
        '<p class="acc-err" role="alert" data-err hidden></p><p class="acc-ok" role="status" data-ok hidden></p>' +
        '<div class="acc-row"><button class="btn btn-accent acc-submit" type="submit">' + (prof ? 'Save changes' : 'Save profile') + '</button><button class="btn btn-outline" type="button" data-logout>Log out</button></div>' +
      '</form>' + (p.createdAt ? '<p class="acc-fine">Member since ' + esc(fmtDate(p.createdAt).split(' ').slice(0, 3).join(' ')) + '</p>' : '') + '</div>' +
      '<aside class="acc-perks"><h3>Quick links</h3><ul class="acc-links">' +
        (opts.wishlistUrl ? '<li><a href="' + esc(opts.wishlistUrl) + '">' + icon('heart') + 'My wishlist</a></li>' : '') +
        (opts.cartUrl ? '<li><a href="' + esc(opts.cartUrl) + '">' + icon('cart') + 'My cart</a></li>' : '') +
        (opts.trackUrl ? '<li><a href="' + esc(opts.trackUrl) + '" target="_blank" rel="noopener">' + icon('truck') + 'Track an order</a></li>' : '') +
        (opts.helpUrl ? '<li><a href="' + esc(opts.helpUrl) + '" target="_blank" rel="noopener">' + icon('chat') + 'Help on WhatsApp</a></li>' : '') +
      '</ul></aside></div>';
  }
  const showErr = (form, msg) => { const e = form.querySelector('[data-err]'); e.textContent = msg; e.hidden = !msg; if (msg) e.focus && e.setAttribute('tabindex', '-1'); };
  const busy = (form, on, label) => { const b = form.querySelector('.acc-submit'); if (!b.dataset.label) b.dataset.label = b.textContent; b.disabled = on; b.textContent = on ? label : b.dataset.label; };

  async function profileOf(uid) { try { const s = await F.getDoc(F.doc(db, 'users', uid)); return s.exists() ? s.data() : null; } catch (e) { return null; } }

  el.addEventListener('click', async (e) => {
    const t = e.target.closest('[data-acc-tab],[data-eye],[data-forgot],[data-logout]'); if (!t) return;
    if (t.hasAttribute('data-acc-tab')) { tab = t.getAttribute('data-acc-tab'); signedOut(); el.querySelector('[data-acc-tab="' + tab + '"]').focus(); }
    else if (t.hasAttribute('data-eye')) { const i = t.previousElementSibling, show = i.type === 'password'; i.type = show ? 'text' : 'password'; t.textContent = show ? 'Hide' : 'Show'; t.setAttribute('aria-pressed', String(show)); t.setAttribute('aria-label', show ? 'Hide password' : 'Show password'); }
    else if (t.hasAttribute('data-forgot')) {
      const form = t.closest('form'), email = form.email.value.trim();
      if (!email) { showErr(form, 'Type your email above first, then tap “Forgot password?”.'); form.email.focus(); return; }
      try { await A.sendPasswordResetEmail(auth, email); showErr(form, ''); const ok = document.createElement('p'); ok.className = 'acc-ok'; ok.setAttribute('role', 'status'); ok.textContent = 'If an account exists for ' + email + ', a reset link is on its way. Check your inbox.'; form.querySelector('[data-err]').after(ok); }
      catch (err) { showErr(form, friendly(err)); }
    }
    else if (t.hasAttribute('data-logout')) { tab = 'login'; await A.signOut(auth); }
  });

  el.addEventListener('submit', async (e) => {
    const form = e.target; e.preventDefault(); showErr(form, '');
    if (form.hasAttribute('data-login')) {
      const email = form.email.value.trim(), pass = form.password.value;
      if (!email || !pass) return showErr(form, 'Please enter your email and password.');
      busy(form, true, 'Logging in…');
      try { const c = await A.signInWithEmailAndPassword(auth, email, pass); F.updateDoc(F.doc(db, 'users', c.user.uid), { lastLoginAt: F.serverTimestamp() }).catch(() => {}); }
      catch (err) { busy(form, false); showErr(form, friendly(err)); }
    } else if (form.hasAttribute('data-register')) {
      const name = form.name.value.trim(), phone = cleanPhone(form.phone.value), email = form.email.value.trim(), pass = form.password.value;
      if (name.length < 2) return showErr(form, 'Please enter your full name.');
      if (!PHONE.test(phone)) return showErr(form, 'Please enter an 11-digit mobile number starting with 01.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return showErr(form, 'Please enter a valid email address.');
      if (pass.length < 6) return showErr(form, 'Please use a password with at least 6 characters.');
      busy(form, true, 'Creating account…');
      try {
        const c = await A.createUserWithEmailAndPassword(auth, email, pass);
        try { await A.updateProfile(c.user, { displayName: name }); } catch (x) {}
        await F.setDoc(F.doc(db, 'users', c.user.uid), { name, phone, email: c.user.email, address: '', createdAt: F.serverTimestamp(), lastLoginAt: F.serverTimestamp(), source: 'website' });
        render(c.user);
      } catch (err) { busy(form, false); showErr(form, friendly(err)); }
    } else if (form.hasAttribute('data-profile')) {
      const user = auth.currentUser; if (!user) return;
      const name = form.name.value.trim(), phone = cleanPhone(form.phone.value), address = form.address.value.trim();
      if (name.length < 2) return showErr(form, 'Please enter your full name.');
      if (!PHONE.test(phone)) return showErr(form, 'Please enter an 11-digit mobile number starting with 01.');
      busy(form, true, 'Saving…');
      try {
        const ref = F.doc(db, 'users', user.uid), had = await profileOf(user.uid);
        if (had) await F.updateDoc(ref, { name, phone, address });
        else await F.setDoc(ref, { name, phone, email: user.email, address, createdAt: F.serverTimestamp(), lastLoginAt: F.serverTimestamp(), source: 'website' });
        await render(user, 'Saved ✓');
      } catch (err) { busy(form, false); showErr(form, friendly(err)); }
    }
  });

  async function render(user, okMsg) {
    if (!user) { signedOut(); return; }
    signedIn(user, await profileOf(user.uid));
    if (okMsg) { const ok = el.querySelector('[data-ok]'); if (ok) { ok.textContent = okMsg; ok.hidden = false; } }
    if (opts.onUser) opts.onUser(user);
  }
  A.onAuthStateChanged(auth, (user) => { render(user); if (!user && opts.onUser) opts.onUser(null); });
}

/* ======================= Dashboard: Customers ======================= */
export async function mountAdmin(el) {
  el.innerHTML = '<p class="hint">লোড হচ্ছে…</p>';
  let f;
  try { f = await load(); } catch (e) { f = undefined; }
  if (f === null) { el.innerHTML = '<div class="panel"><h3 style="margin-top:0">Firebase এখনো যুক্ত হয়নি</h3><p class="hint">firebase-config.js ফাইলে Firebase-এর config বসালে এখানে রেজিস্টার করা গ্রাহকদের লিস্ট দেখা যাবে।</p></div>'; return; }
  if (!f) { el.innerHTML = '<div class="form-error">Firebase লোড হয়নি। ইন্টারনেট চেক করে রিফ্রেশ করুন।</div>'; return; }
  const { A, F, auth, db } = f;
  let rows = [], q = '';

  function loginForm(msg) {
    el.innerHTML = '<form class="panel login-card" data-c-login style="margin:0 auto"><h3 style="margin-top:0">গ্রাহক লিস্ট দেখতে অ্যাডমিন লগইন</h3>' +
      '<p class="hint">ওয়েবসাইটে যে ইমেইল দিয়ে অ্যাকাউন্ট খুলেছেন, সেটা দিন। এই অ্যাকাউন্টকে Firebase-এর "admins" লিস্টে রাখতে হবে।</p>' +
      '<div class="field"><label for="c-email">ইমেইল</label><input id="c-email" name="email" type="email" autocomplete="email" required></div>' +
      '<div class="field"><label for="c-pass">পাসওয়ার্ড</label><input id="c-pass" name="password" type="password" autocomplete="current-password" required></div>' +
      '<div class="form-error" data-c-err' + (msg ? '' : ' hidden') + '>' + esc(msg || '') + '</div><button class="btn block" type="submit">লগইন</button></form>';
  }
  function table() {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const list = rows.filter((r) => words.every((w) => (r.name + ' ' + r.phone + ' ' + r.email + ' ' + r.address).toLowerCase().includes(w)));
    el.querySelector('[data-c-count]').textContent = 'মোট ' + rows.length + ' জন গ্রাহক' + (q ? ' · খোঁজে মিলেছে ' + list.length + ' জন' : '');
    el.querySelector('[data-c-rows]').innerHTML = list.map((r, i) => '<tr><td>' + (i + 1) + '</td><td>' + esc(r.name) + '</td><td><a href="tel:' + esc(r.phone) + '">' + esc(r.phone) + '</a></td><td>' + esc(r.email) + '</td><td>' + esc(r.address || '—') + '</td><td>' + esc(fmtDate(r.createdAt)) + '</td><td>' + esc(fmtDate(r.lastLoginAt)) + '</td>' +
      '<td><a class="btn sm wa" href="https://wa.me/88' + esc(r.phone) + '" target="_blank" rel="noopener">WhatsApp</a></td></tr>').join('');
    el.querySelector('[data-c-empty]').hidden = list.length > 0;
  }
  async function dash(user) {
    el.innerHTML = '<p class="hint">লোড হচ্ছে…</p>';
    let isAdmin = false;
    try { isAdmin = (await F.getDoc(F.doc(db, 'admins', user.uid))).exists(); } catch (e) {}
    if (!isAdmin) {
      el.innerHTML = '<div class="panel"><h3 style="margin-top:0">এই অ্যাকাউন্টের অনুমতি নেই</h3><p class="hint">' + esc(user.email) + ' অ্যাডমিন লিস্টে নেই। Firebase console → Firestore → "admins" collection-এ এই ID দিয়ে একটা document বানান:</p><p><code>' + esc(user.uid) + '</code></p><button class="btn sm outline" type="button" data-c-out>অন্য অ্যাকাউন্টে লগইন</button></div>';
      return;
    }
    try {
      const snap = await F.getDocs(F.query(F.collection(db, 'users'), F.orderBy('createdAt', 'desc'), F.limit(1000)));
      rows = snap.docs.map((d) => Object.assign({ id: d.id, name: '', phone: '', email: '', address: '' }, d.data()));
    } catch (err) { el.innerHTML = '<div class="form-error">গ্রাহক লিস্ট আনা যায়নি: ' + esc(friendly(err)) + '</div>'; return; }
    el.innerHTML = '<section class="panel filters" aria-label="গ্রাহক খুঁজুন"><input type="search" data-c-q placeholder="নাম / মোবাইল / ইমেইল খুঁজুন" aria-label="গ্রাহক খুঁজুন">' +
      '<button class="btn sm outline" type="button" data-c-refresh>↻ রিফ্রেশ</button><button class="btn sm" type="button" data-c-csv>CSV ডাউনলোড</button><button class="btn sm outline" type="button" data-c-out>Firebase লগআউট</button></section>' +
      '<p class="hint" data-c-count></p><div class="table-wrap"><table class="orders"><thead><tr><th>#</th><th>নাম</th><th>মোবাইল</th><th>ইমেইল</th><th>ঠিকানা</th><th>রেজিস্ট্রেশন</th><th>শেষ লগইন</th><th>যোগাযোগ</th></tr></thead><tbody data-c-rows></tbody></table></div>' +
      '<p class="empty-state" data-c-empty hidden>এখনো কেউ রেজিস্টার করেননি।</p>';
    const qi = el.querySelector('[data-c-q]'); qi.value = q; qi.addEventListener('input', () => { q = qi.value.trim(); table(); });
    table();
  }
  el.addEventListener('submit', async (e) => {
    if (!e.target.hasAttribute('data-c-login')) return; e.preventDefault();
    const form = e.target, err = form.querySelector('[data-c-err]'), b = form.querySelector('button');
    b.disabled = true; err.hidden = true;
    try { await A.signInWithEmailAndPassword(auth, form.email.value.trim(), form.password.value); }
    catch (x) { b.disabled = false; err.textContent = friendly(x); err.hidden = false; }
  });
  el.addEventListener('click', async (e) => {
    if (e.target.closest('[data-c-out]')) await A.signOut(auth);
    else if (e.target.closest('[data-c-refresh]') && auth.currentUser) dash(auth.currentUser);
    else if (e.target.closest('[data-c-csv]')) {
      const head = ['Name', 'Mobile', 'Email', 'Address', 'Registered', 'Last login'];
      const cell = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
      const csv = [head.map(cell).join(',')].concat(rows.map((r) => [r.name, r.phone, r.email, r.address, fmtDate(r.createdAt), fmtDate(r.lastLoginAt)].map(cell).join(','))).join('\r\n');
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })); a.download = 'bakaina-customers-' + new Date().toISOString().slice(0, 10) + '.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }
  });
  A.onAuthStateChanged(auth, (user) => { if (user) dash(user); else loginForm(); });
}
