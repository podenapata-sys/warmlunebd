/* ==========================================================================
   Admin dashboard (admin.html). Kept separate from app.js so customers
   never download it. The password is checked by Apps Script, never here.
   ========================================================================== */
(function () {
  'use strict';
  var C = window.CONFIG;
  var TOKEN_KEY = 'adminToken';
  var REFRESH_MS = 60000;
  var DAY = 86400000;

  var STATUS_BN = {
    New: 'নতুন', Confirmed: 'কনফার্মড', Shipped: 'পাঠানো হয়েছে', Delivered: 'ডেলিভারড',
    Returned: 'রিটার্ন', Fake: 'ফেক', Cancelled: 'ক্যান্সেল',
  };
  var STATUSES = Object.keys(STATUS_BN);

  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n) { return '৳' + Number(n || 0).toLocaleString('en-IN'); }
  function getToken() { try { return sessionStorage.getItem(TOKEN_KEY); } catch (e) { return null; } }
  function setToken(t) { try { t ? sessionStorage.setItem(TOKEN_KEY, t) : sessionStorage.removeItem(TOKEN_KEY); } catch (e) {} }

  // Dates are stored as "2026-03-14T18:22:05+06:00" (Asia/Dhaka)
  function dhakaDate(d) { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(d); }  // yyyy-mm-dd
  function fmtDateTime(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return esc(iso);
    return new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dhaka', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }).format(d);
  }

  var orders = [];
  var dupPhones = {};          // orderId → true when the phone has another order within 7 days
  var busy = 0;                // in-flight status updates; auto-refresh waits for them
  var timer = null;

  /* ---------- API ---------- */
  function api(action, data) {
    var body = Object.assign({ action: action, token: getToken() }, data || {});
    return fetch(C.appsScriptUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res.ok) {
          if (res.code === 'AUTH') { logout(true); }
          throw new Error(res.error || 'সমস্যা হয়েছে');
        }
        return res;
      });
  }

  /* ---------- Login ---------- */
  $$('[data-brand]').forEach(function (el) { el.textContent = C.brand; });

  $('[data-login-form]').addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = $('[data-login-btn]'), err = $('[data-login-error]');
    err.hidden = true;
    if (!C.appsScriptUrl) { err.textContent = 'config.js-এ appsScriptUrl সেট করুন।'; err.hidden = false; return; }
    btn.disabled = true; btn.textContent = 'যাচাই হচ্ছে…';
    api('login', { password: e.target.password.value })
      .then(function (res) { setToken(res.token); e.target.reset(); showDash(); })
      .catch(function (ex) { err.textContent = ex.message; err.hidden = false; })
      .then(function () { btn.disabled = false; btn.textContent = 'লগইন'; });
  });

  function showDash() {
    $('[data-login]').hidden = true;
    $('[data-dash]').hidden = false;
    load();
    clearInterval(timer);
    timer = setInterval(function () {
      // Don't yank the list out from under someone choosing a status
      var active = document.activeElement;
      if (busy || document.hidden || (active && active.matches && active.matches('select[data-status], select[data-ab-status]'))) return;
      load(true);
    }, REFRESH_MS);
  }

  function logout(expired) {
    if (!expired && getToken()) api('logout').catch(function () {});
    setToken(null);
    clearInterval(timer);
    orders = [];
    $('[data-dash]').hidden = true;
    $('[data-login]').hidden = false;
    if (expired) { var err = $('[data-login-error]'); err.textContent = 'সেশন শেষ। আবার লগইন করুন।'; err.hidden = false; }
  }
  $('[data-logout]').addEventListener('click', function () { logout(false); });
  $('[data-refresh]').addEventListener('click', function () { load(); });

  /* ---------- Load ---------- */
  function load(quiet) {
    var errBox = $('[data-dash-error]');
    if (!quiet) $('[data-updated]').textContent = 'লোড হচ্ছে…';
    loadReviews();
    loadAbandoned();
    return api('getOrders').then(function (res) {
      orders = res.orders || [];
      computeDuplicates();
      errBox.hidden = true;
      render();
      $('[data-updated]').textContent = 'আপডেট: ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }).catch(function (ex) {
      if (!getToken()) return;
      errBox.textContent = ex.message; errBox.hidden = false;
      $('[data-updated]').textContent = '';
    });
  }

  // Flag orders whose phone placed another order within 7 days (either side)
  function computeDuplicates() {
    dupPhones = {};
    var byPhone = {};
    orders.forEach(function (o) { (byPhone[o.phone] = byPhone[o.phone] || []).push(o); });
    Object.keys(byPhone).forEach(function (ph) {
      var list = byPhone[ph];
      if (list.length < 2) return;
      list.forEach(function (o) {
        var t = new Date(o.createdAt).getTime();
        dupPhones[o.orderId] = list.some(function (x) {
          return x !== o && Math.abs(new Date(x.createdAt).getTime() - t) <= 7 * DAY;
        });
      });
    });
  }

  /* ---------- Filters ---------- */
  var statusSel = $('[data-f="status"]');
  statusSel.innerHTML += STATUSES.map(function (s) { return '<option value="' + s + '">' + STATUS_BN[s] + '</option>'; }).join('');
  $('[data-f="product"]').innerHTML += C.products.map(function (p) { return '<option value="' + esc(p.id) + '">' + esc(p.name) + '</option>'; }).join('');
  $$('[data-f]').forEach(function (el) { el.addEventListener(el.type === 'search' ? 'input' : 'change', render); });
  $('[data-clear]').addEventListener('click', function () { $$('[data-f]').forEach(function (el) { el.value = ''; }); render(); });

  function filtered() {
    var f = {};
    $$('[data-f]').forEach(function (el) { f[el.getAttribute('data-f')] = el.value.trim(); });
    var q = f.q.toLowerCase().replace(/^\+?88/, '');
    return orders.filter(function (o) {
      var day = String(o.createdAt).slice(0, 10);
      if (f.status && o.status !== f.status) return false;
      if (f.product && o.productId !== f.product) return false;
      if (f.area && o.area !== f.area) return false;
      if (f.from && day < f.from) return false;
      if (f.to && day > f.to) return false;
      if (q && (o.name + ' ' + o.phone + ' ' + o.orderId).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
  }

  /* ---------- Stats (always on all orders, not the filtered view) ---------- */
  function renderStats() {
    var today = dhakaDate(new Date());
    // Bangladesh week starts on Saturday
    var dow = new Date(today + 'T00:00:00Z').getUTCDay();           // 0 Sun … 6 Sat
    var weekStart = dhakaDate(new Date(new Date(today + 'T12:00:00Z').getTime() - ((dow + 1) % 7) * DAY));
    var count = { today: 0, week: 0 }, by = {}, sales = 0;
    orders.forEach(function (o) {
      var d = String(o.createdAt).slice(0, 10);
      if (d === today) count.today++;
      if (d >= weekStart && d <= today) count.week++;
      by[o.status] = (by[o.status] || 0) + 1;
      if (o.status === 'Delivered') sales += o.total;
    });
    // Rates are over orders that have been called (status is no longer "New")
    var handled = orders.length - (by.New || 0);
    var confirmed = (by.Confirmed || 0) + (by.Shipped || 0) + (by.Delivered || 0) + (by.Returned || 0);
    var bad = (by.Fake || 0) + (by.Cancelled || 0);
    var pct = function (n) { return handled ? Math.round(n / handled * 100) + '%' : '—'; };
    var card = function (label, val, sub) { return '<div class="stat"><span>' + label + '</span><strong>' + val + '</strong>' + (sub ? '<small>' + sub + '</small>' : '') + '</div>'; };
    $('[data-stats]').innerHTML =
      card('আজকের অর্ডার', count.today, (by.New || 0) + 'টি নতুন অপেক্ষায়') +
      card('এই সপ্তাহের অর্ডার', count.week, 'শনিবার থেকে') +
      card('মোট বিক্রি', money(sales), 'শুধু ডেলিভারড') +
      card('কনফার্মেশন রেট', pct(confirmed), 'কল করা অর্ডারের মধ্যে') +
      card('ফেক/ক্যান্সেল রেট', pct(bad), bad + 'টি অর্ডার');
  }

  /* ---------- Table / cards ---------- */
  function productName(o) { return o.productName || o.productId; }
  function waConfirmLink(o) {
    var msg = 'আসসালামু আলাইকুম ' + o.name + ', ' + C.brand + ' থেকে বলছি। ' +
      'আপনার অর্ডার (' + o.orderId + '): ' + productName(o) + ' × ' + o.qty + '। ' +
      'পণ্য হাতে পেয়ে দিবেন ' + money(o.due) + '। ' +
      'ঠিকানা: ' + o.address + (o.area === 'outside' ? ', ' + o.district : '') + '। ' +
      'অর্ডারটি কনফার্ম করতে "হ্যাঁ" লিখে রিপ্লাই দিন। জাযাকাল্লাহু খাইরান।';
    return 'https://wa.me/88' + o.phone + '?text=' + encodeURIComponent(msg);
  }

  function waReviewLink(o) {
    var url = (C.siteUrl || location.origin).replace(/\/$/, '') + '/review.html?id=' + encodeURIComponent(o.orderId);
    var msg = 'আসসালামু আলাইকুম ' + o.name + ', ' + C.brand + ' থেকে বলছি। আশা করি ' + productName(o) + ' ভালোভাবে পেয়েছেন। ' +
      'আপনার অভিজ্ঞতা কেমন লাগলো, এক লাইনে জানালে অনেক উপকার হবে: ' + url + ' জাযাকাল্লাহু খাইরান।';
    return 'https://wa.me/88' + o.phone + '?text=' + encodeURIComponent(msg);
  }

  /* ---------- Reviews tab ---------- */
  var reviews = [];
  var RV_BN = { Pending: 'অপেক্ষায়', Approved: 'অনুমোদিত', Rejected: 'বাতিল' };
  function loadReviews() {
    return api('getReviews').then(function (res) { reviews = res.reviews || []; renderReviews(); }).catch(function () {});
  }
  function renderReviews() {
    var pending = reviews.filter(function (r) { return r.status === 'Pending'; }).length;
    var badge = $('[data-pending]');
    badge.textContent = pending; badge.hidden = !pending;
    $('[data-review-empty]').hidden = reviews.length > 0;
    $('[data-review-list]').innerHTML = reviews.map(function (r) {
      var n = Math.max(0, Math.min(5, r.rating));
      return '<article class="review-card st-' + esc(r.status) + '" data-rid="' + esc(r.orderId) + '">' +
        '<div><span class="stars">' + '★'.repeat(n) + '<span class="off">' + '★'.repeat(5 - n) + '</span></span> <span class="review-meta">' + esc(RV_BN[r.status] || r.status) + '</span></div>' +
        '<p style="margin:0">' + esc(r.text) + '</p>' +
        '<div class="review-meta">' + esc(r.name) + (r.place ? ', ' + esc(r.place) : '') + ' · ' + esc(r.productName) + ' · ' + esc(r.orderId) + ' · ' + esc(r.phone) + ' · ' + fmtDateTime(r.createdAt) + '</div>' +
        '<div class="review-actions">' +
          (r.status !== 'Approved' ? '<button class="btn sm" type="button" data-mod="Approved">✓ অনুমোদন</button>' : '') +
          (r.status !== 'Rejected' ? '<button class="btn sm outline" type="button" data-mod="Rejected">✕ বাতিল</button>' : '') +
        '</div></article>';
    }).join('');
  }
  $('[data-review-list]').addEventListener('click', function (e) {
    var b = e.target.closest('[data-mod]');
    if (!b) return;
    var card = b.closest('[data-rid]'), id = card.getAttribute('data-rid'), status = b.getAttribute('data-mod');
    $$('button', card).forEach(function (x) { x.disabled = true; });
    api('moderateReview', { orderId: id, status: status })
      .then(function () {
        reviews.forEach(function (r) { if (r.orderId === id) r.status = status; });
        renderReviews();
        toast(status === 'Approved' ? 'রিভিউ ওয়েবসাইটে দেখানো হবে' : 'রিভিউ বাতিল হয়েছে');
      })
      .catch(function (ex) { $$('button', card).forEach(function (x) { x.disabled = false; }); toast(ex.message, true); });
  });

  /* ---------- Abandoned cart tab ---------- */
  var drafts = [];
  var AB_BN = { New: 'নতুন', Called: 'কল করা হয়েছে', NoAnswer: 'ধরেনি', Recovered: 'অর্ডার নিয়েছি', NotInterested: 'আগ্রহী নন', Ordered: 'অর্ডার হয়েছে ✓' };
  var AB_SET = ['New', 'Called', 'NoAnswer', 'Recovered', 'NotInterested'];
  var AB_OPEN = { New: 1, Called: 1, NoAnswer: 1 };
  var FRESH_MS = 10 * 60000;    // still on the checkout page, probably: don't call yet
  function loadAbandoned() {
    return api('getAbandoned').then(function (res) { drafts = res.drafts || []; renderAbandoned(); }).catch(function () {});
  }
  function ago(iso) {
    var m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (isNaN(m)) return '';
    if (m < 60) return m + ' মিনিট আগে';
    if (m < 1440) return Math.round(m / 60) + ' ঘণ্টা আগে';
    return Math.round(m / 1440) + ' দিন আগে';
  }
  function draftProduct(d) {
    var p = C.products.filter(function (x) { return x.id === d.productId; })[0];
    return { name: d.productName || (p && p.name) || d.productId, price: p && p.price || 0 };
  }
  // Same quantity discount as the checkout (config.js qtyDiscount)
  function draftTotal(price, qty) {
    var qd = C.qtyDiscount || {}, sub = price * qty;
    return qd.percent > 0 && qty >= qd.minQty ? sub - Math.round(sub * qd.percent / 100) : sub;
  }
  function waRecoverLink(d) {
    var p = draftProduct(d);
    var url = (C.siteUrl || location.origin).replace(/\/$/, '') + '/checkout.html?product=' + encodeURIComponent(d.productId) + '&qty=' + d.qty;
    var msg = 'আসসালামু আলাইকুম' + (d.name ? ' ' + d.name : '') + ', ' + C.brand + ' থেকে বলছি। ' +
      'দেখলাম আপনি ' + p.name + ' অর্ডার করতে গিয়ে শেষ করেননি। কোনো প্রশ্ন থাকলে জানাবেন, এখানে "হ্যাঁ" লিখলেই অর্ডারটি আমরা নিয়ে নেব। ' +
      'অথবা এখান থেকে অর্ডার করুন: ' + url + ' — ফ্রি ডেলিভারি, পণ্য হাতে পেয়ে টাকা।';
    return 'https://wa.me/88' + d.phone + '?text=' + encodeURIComponent(msg);
  }
  function renderAbandoned() {
    var now = Date.now();
    var open = drafts.filter(function (d) { return AB_OPEN[d.status]; });
    var due = open.filter(function (d) { return d.status === 'New' && now - new Date(d.updatedAt).getTime() > FRESH_MS; }).length;
    var badge = $('[data-ab-count]');
    badge.textContent = due; badge.hidden = !due;
    var ordered = drafts.filter(function (d) { return d.status === 'Ordered' || d.status === 'Recovered'; }).length;
    $('[data-ab-summary]').textContent = 'মোট ' + drafts.length + 'টি · ফলো-আপ বাকি ' + open.length + 'টি · পরে অর্ডার হয়েছে ' + ordered + 'টি';
    var list = $('[data-ab-f]').value === 'open' ? open : drafts;
    $('[data-ab-empty]').hidden = list.length > 0;
    $('[data-ab-list]').innerHTML = list.map(function (d) {
      var p = draftProduct(d), fresh = now - new Date(d.updatedAt).getTime() <= FRESH_MS && d.status === 'New';
      var opts = d.status === 'Ordered' ? '' : AB_SET.map(function (s) { return '<option value="' + s + '"' + (s === d.status ? ' selected' : '') + '>' + AB_BN[s] + '</option>'; }).join('');
      var where = d.area === 'inside' ? 'ঢাকার ভেতরে' : d.area === 'outside' ? 'ঢাকার বাইরে' + (d.district ? ' — ' + esc(d.district) : '') : '';
      return '<article class="review-card ab-card ab-' + esc(d.status) + '" data-did="' + esc(d.draftId) + '">' +
        '<div class="ab-head"><strong>' + (d.name ? esc(d.name) : '<span class="hint">নাম লেখেননি</span>') + '</strong> ' +
          '<a href="tel:' + esc(d.phone) + '">' + esc(d.phone) + '</a>' +
          '<span class="review-meta">' + esc(ago(d.updatedAt)) + (fresh ? ' · এখনো চেকআউটে থাকতে পারেন' : '') + '</span></div>' +
        '<div>' + esc(p.name) + ' × ' + d.qty + (p.price ? ' · <strong>' + money(draftTotal(p.price, d.qty)) + '</strong>' : '') + '</div>' +
        (where || d.address ? '<div class="review-meta">' + where + (d.address ? (where ? ' · ' : '') + esc(d.address) : '') + '</div>' : '') +
        '<div class="review-actions">' +
          (d.status === 'Ordered'
            ? '<span class="badge ok">' + AB_BN.Ordered + (d.orderId ? ' · ' + esc(d.orderId) : '') + '</span>'
            : '<a class="act" href="tel:' + esc(d.phone) + '" title="কল করুন">📞 কল</a>' +
              '<a class="act wa" href="' + esc(waRecoverLink(d)) + '" target="_blank" rel="noopener" title="WhatsApp">WA মেসেজ</a>' +
              '<select data-ab-status class="badge-select" aria-label="স্ট্যাটাস">' + opts + '</select>') +
        '</div></article>';
    }).join('');
  }
  $('[data-ab-f]').addEventListener('change', renderAbandoned);
  $('[data-ab-list]').addEventListener('change', function (e) {
    if (!e.target.matches('select[data-ab-status]')) return;
    var sel = e.target, id = sel.closest('[data-did]').getAttribute('data-did');
    var d = drafts.filter(function (x) { return x.draftId === id; })[0], prev = d.status, next = sel.value;
    sel.disabled = true; busy++;
    api('updateDraft', { draftId: id, status: next })
      .then(function () { d.status = next; toast(AB_BN[next]); renderAbandoned(); })
      .catch(function (ex) { sel.value = prev; toast('আপডেট হয়নি: ' + ex.message, true); })
      .then(function () { sel.disabled = false; busy--; });
  });

  // Tabs
  $$('[data-tab]').forEach(function (t) {
    t.addEventListener('click', function () {
      var name = t.getAttribute('data-tab');
      $$('[data-tab]').forEach(function (x) { var on = x === t; x.classList.toggle('on', on); x.setAttribute('aria-selected', on); });
      $$('[data-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== name; });
    });
  });

  function render() {
    renderStats();
    var list = filtered();
    $('[data-count]').textContent = 'মোট ' + list.length + 'টি অর্ডার দেখানো হচ্ছে' + (list.length !== orders.length ? ' (' + orders.length + 'টির মধ্যে)' : '');
    $('[data-empty]').hidden = list.length > 0;
    $('[data-rows]').innerHTML = list.map(function (o) {
      var opts = STATUSES.map(function (s) { return '<option value="' + s + '"' + (s === o.status ? ' selected' : '') + '>' + STATUS_BN[s] + '</option>'; }).join('');
      var dup = dupPhones[o.orderId] ? ' <span class="badge warn" title="৭ দিনের মধ্যে এই নম্বর থেকে আরেকটি অর্ডার আছে">⚠ ডুপ্লিকেট</span>' : '';
      return '<tr data-id="' + esc(o.orderId) + '" class="st-' + esc(o.status) + '">' +
        '<td data-l="অর্ডার আইডি"><strong>' + esc(o.orderId) + '</strong>' + dup + '</td>' +
        '<td data-l="তারিখ">' + fmtDateTime(o.createdAt) + '</td>' +
        '<td data-l="নাম">' + esc(o.name) + '</td>' +
        '<td data-l="মোবাইল"><a href="tel:' + esc(o.phone) + '">' + esc(o.phone) + '</a></td>' +
        '<td data-l="এলাকা">' + (o.area === 'inside' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে<br><small>' + esc(o.district) + '</small>') + '</td>' +
        '<td data-l="ঠিকানা" class="addr">' + esc(o.address) + '</td>' +
        '<td data-l="পণ্য">' + esc(productName(o)) + '</td>' +
        '<td data-l="পরিমাণ">' + o.qty + '</td>' +
        '<td data-l="মোট"><strong>' + money(o.total) + '</strong>' + (o.advance ? '<br><small>বাকি ' + money(o.due) + '</small>' : '') + '</td>' +
        '<td data-l="অগ্রিম">' + (o.advance ? money(o.advance) : '—') + '</td>' +
        '<td data-l="TrxID">' + (o.bkashTrxId ? (o.payMethod ? '<small>' + esc(o.payMethod) + '</small><br>' : '') + '<code>' + esc(o.bkashTrxId) + '</code>' : '—') + '</td>' +
        '<td data-l="স্ট্যাটাস"><select data-status class="badge-select st-' + esc(o.status) + '" aria-label="স্ট্যাটাস">' + opts + '</select></td>' +
        '<td data-l="নোট">' + (o.note ? esc(o.note) : '—') + '</td>' +
        '<td data-l="অ্যাকশন" class="acts">' +
          '<a class="act" href="tel:' + esc(o.phone) + '" title="কল করুন">📞</a>' +
          '<a class="act wa" href="' + esc(waConfirmLink(o)) + '" target="_blank" rel="noopener" title="WhatsApp">WA</a>' +
          '<button class="act" type="button" data-copy title="কুরিয়ারের জন্য ঠিকানা কপি করুন">📋</button>' +
          (o.status === 'Delivered' ? '<a class="act rv" href="' + esc(waReviewLink(o)) + '" target="_blank" rel="noopener" title="রিভিউ লিংক পাঠান">⭐ রিভিউ</a>' : '') +
        '</td></tr>';
    }).join('');
  }

  /* ---------- Row actions ---------- */
  $('[data-rows]').addEventListener('change', function (e) {
    if (!e.target.matches('select[data-status]')) return;
    var sel = e.target, tr = sel.closest('tr'), id = tr.getAttribute('data-id');
    var o = orders.filter(function (x) { return x.orderId === id; })[0];
    var prev = o.status, next = sel.value;
    // Optimistic update, rolled back if the Sheet write fails
    o.status = next; sel.className = 'badge-select st-' + next; tr.className = 'st-' + next;
    sel.disabled = true; busy++;
    api('updateStatus', { orderId: id, status: next })
      .then(function (res) { o.updatedAt = res.updatedAt; toast(id + ' → ' + STATUS_BN[next]); renderStats(); })
      .catch(function (ex) { o.status = prev; sel.value = prev; sel.className = 'badge-select st-' + prev; tr.className = 'st-' + prev; toast('আপডেট হয়নি: ' + ex.message, true); })
      .then(function () { sel.disabled = false; busy--; });
  });

  $('[data-rows]').addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]');
    if (!b) return;
    var o = orders.filter(function (x) { return x.orderId === b.closest('tr').getAttribute('data-id'); })[0];
    var text = [
      o.name, o.phone,
      o.address + (o.area === 'outside' ? ', ' + o.district : ', ঢাকা'),
      'COD: ' + o.due + ' টাকা', 'পণ্য: ' + productName(o) + ' x' + o.qty, 'অর্ডার: ' + o.orderId,
    ].join('\n');
    copy(text).then(function () { toast('ঠিকানা কপি হয়েছে'); }, function () { toast('কপি করা যায়নি', true); });
  });

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (ok, fail) {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy') ? ok() : fail(); } catch (e) { fail(); }
      ta.remove();
    });
  }

  /* ---------- CSV export of the filtered view ---------- */
  $('[data-export]').addEventListener('click', function () {
    var cols = ['orderId', 'createdAt', 'name', 'phone', 'area', 'district', 'address', 'productName', 'qty', 'total', 'advance', 'due', 'payMethod', 'bkashTrxId', 'status', 'note', 'updatedAt'];
    var cell = function (v) {
      v = String(v == null ? '' : v);
      if (/^[=+\-@]/.test(v)) v = "'" + v;                 // no formula injection in Excel
      return '"' + v.replace(/"/g, '""') + '"';
    };
    var rows = filtered().map(function (o) {
      return cols.map(function (c) { return cell(c === 'phone' ? '​' + o.phone : o[c]); }).join(',');
    });
    // BOM so Excel shows Bangla correctly; zero-width space keeps phone leading zero
    var csv = '﻿' + cols.join(',') + '\n' + rows.join('\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'orders-' + dhakaDate(new Date()) + '.csv';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });

  /* ---------- Toast ---------- */
  var toastTimer;
  function toast(msg, isErr) {
    var t = $('[data-toast]');
    t.textContent = msg; t.className = 'toast' + (isErr ? ' err' : ''); t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2500);
  }

  if (getToken()) showDash();
})();
