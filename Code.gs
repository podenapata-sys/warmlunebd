/**
 * ==========================================================================
 *  Order backend for the storefront — Google Apps Script Web App.
 *
 *  Actions (POST JSON, sent as text/plain to avoid a CORS preflight):
 *    createOrder   public       — validates, re-prices, writes a row, alerts
 *    login         public       — checks password, returns a 6-hour token
 *    getOrders     token        — all orders, newest first
 *    updateStatus  token        — sets status + updatedAt on one order
 *    logout        token        — revokes the token
 *
 *  Script Properties (Project Settings → Script properties):
 *    ADMIN_PASSWORD      required  admin dashboard password
 *    ADMIN_EMAIL         optional  where new-order emails go
 *    TELEGRAM_BOT_TOKEN  optional  from @BotFather
 *    TELEGRAM_CHAT_ID    optional  your chat / group id
 *    BRAND               optional  used in alerts
 *
 *  Setup steps are in README.md. Run setup() once from the editor first.
 * ==========================================================================
 */

/* ---------- Price: the source of truth. Keep in sync with config.js (price) ---------- */
const PRICE = 0;   // ৳ per heating pad — SET THIS. Orders are refused while it is 0.
const PRODUCTS = {
  'pad-pink':     { name: 'WarmLune হিটিং প্যাড — ব্লাশ পিংক', price: PRICE },
  'pad-white':    { name: 'WarmLune হিটিং প্যাড — পার্ল হোয়াইট', price: PRICE },
  'pad-lavender': { name: 'WarmLune হিটিং প্যাড — ল্যাভেন্ডার', price: PRICE },
};
const ADVANCE_OUTSIDE_DHAKA = 200;   // ৳ — must match config.js advanceOutsideDhaka
const MAX_QTY = 10;
const TZ = 'Asia/Dhaka';

const SHEET_NAME = 'Orders';
const HEADERS = [
  'orderId', 'createdAt', 'name', 'phone', 'area', 'district', 'address',
  'productId', 'productName', 'qty', 'unitPrice', 'total', 'advance', 'due',
  'bkashTrxId', 'status', 'note', 'updatedAt', 'requestId',
];
const STATUSES = ['New', 'Confirmed', 'Shipped', 'Delivered', 'Returned', 'Fake', 'Cancelled'];
const TOKEN_TTL = 6 * 60 * 60;       // seconds (CacheService max)

// Reviews: customers of DELIVERED orders only; shown on the site after you approve them
const REVIEW_SHEET = 'Reviews';
const REVIEW_HEADERS = ['orderId', 'createdAt', 'name', 'place', 'rating', 'text', 'productName', 'status', 'updatedAt', 'phone'];
const REVIEW_STATUSES = ['Pending', 'Approved', 'Rejected'];

const DISTRICTS = ['বাগেরহাট','বান্দরবান','বরগুনা','বরিশাল','ভোলা','বগুড়া','ব্রাহ্মণবাড়িয়া','চাঁদপুর','চাঁপাইনবাবগঞ্জ','চট্টগ্রাম','চুয়াডাঙ্গা','কুমিল্লা','কক্সবাজার','ঢাকা','দিনাজপুর','ফরিদপুর','ফেনী','গাইবান্ধা','গাজীপুর','গোপালগঞ্জ','হবিগঞ্জ','জামালপুর','যশোর','ঝালকাঠি','ঝিনাইদহ','জয়পুরহাট','খাগড়াছড়ি','খুলনা','কিশোরগঞ্জ','কুড়িগ্রাম','কুষ্টিয়া','লক্ষ্মীপুর','লালমনিরহাট','মাদারীপুর','মাগুরা','মানিকগঞ্জ','মেহেরপুর','মৌলভীবাজার','মুন্সিগঞ্জ','ময়মনসিংহ','নওগাঁ','নড়াইল','নারায়ণগঞ্জ','নরসিংদী','নাটোর','নেত্রকোনা','নীলফামারী','নোয়াখালী','পাবনা','পঞ্চগড়','পটুয়াখালী','পিরোজপুর','রাজবাড়ী','রাজশাহী','রাঙ্গামাটি','রংপুর','সাতক্ষীরা','শরীয়তপুর','শেরপুর','সিরাজগঞ্জ','সুনামগঞ্জ','সিলেট','টাঙ্গাইল','ঠাকুরগাঁও'];

/* ==========================================================================
   Entry points
   ========================================================================== */

function doPost(e) {
  let body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ ok: false, error: 'Invalid request' });
  }
  try {
    switch (body.action) {
      case 'createOrder':  return json_(createOrder_(body));
      case 'login':        return json_(login_(body));
      case 'getOrders':    requireToken_(body); return json_(getOrders_());
      case 'updateStatus': requireToken_(body); return json_(updateStatus_(body));
      case 'submitReview':     return json_(submitReview_(body));
      case 'getPublicReviews': return json_(getPublicReviews_());
      case 'getReviews':       requireToken_(body); return json_(getReviews_());
      case 'moderateReview':   requireToken_(body); return json_(moderateReview_(body));
      case 'logout':       CacheService.getScriptCache().remove('tok_' + body.token); return json_({ ok: true });
      default:             return json_({ ok: false, error: 'Unknown action' });
    }
  } catch (err) {
    if (err && err.userFacing) return json_({ ok: false, error: err.message, code: err.code || '' });
    console.error(err && err.stack || err);
    return json_({ ok: false, error: 'সার্ভারে সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করুন।' });
  }
}

// Health check: open the /exec URL in a browser to see this
function doGet() {
  return json_({ ok: true, service: 'orders', time: now_() });
}

/* ==========================================================================
   createOrder
   ========================================================================== */

function createOrder_(b) {
  // Bots: honeypot filled, or form submitted inhumanly fast
  if (b.website) throw userError_('Rejected');
  if (typeof b.elapsedMs === 'number' && b.elapsedMs < 2500) throw userError_('অনুগ্রহ করে ফর্মটি আবার পূরণ করুন।');

  // ---- Validate & sanitize every field; never trust prices from the browser
  const product = PRODUCTS[String(b.productId)];
  if (!product) throw userError_('পণ্যটি পাওয়া যায়নি।');
  if (!(product.price > 0)) throw userError_('দাম এখনও সেট করা হয়নি। কল বা WhatsApp-এ অর্ডার করুন।');

  const qty = Number(b.qty);
  if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) throw userError_('পরিমাণ ১ থেকে ' + MAX_QTY + ' এর মধ্যে হতে হবে।');

  const name = clean_(b.name, 60);
  if (name.length < 2) throw userError_('নাম লিখুন।');

  const phone = normalizePhone_(b.phone);
  if (!/^01[3-9]\d{8}$/.test(phone)) throw userError_('সঠিক মোবাইল নম্বর দিন।');

  const area = b.area === 'inside' || b.area === 'outside' ? b.area : '';
  if (!area) throw userError_('ডেলিভারি এলাকা নির্বাচন করুন।');

  let district = 'ঢাকা (সিটি)';
  let trxId = '';
  if (area === 'outside') {
    district = clean_(b.district, 40);
    if (DISTRICTS.indexOf(district) === -1) throw userError_('সঠিক জেলা নির্বাচন করুন।');
    trxId = toEnDigits_(String(b.trxId || '')).trim().toUpperCase();
    if (!/^[A-Z0-9]{8,12}$/.test(trxId)) throw userError_('সঠিক বিকাশ ট্রানজেকশন আইডি দিন।');
  }

  const address = clean_(b.address, 300);
  if (address.length < 10) throw userError_('সম্পূর্ণ ঠিকানা লিখুন।');
  const note = clean_(b.note, 300);
  const requestId = String(b.requestId || '').replace(/[^a-z0-9]/gi, '').slice(0, 40);

  // ---- Server-side pricing
  const total = product.price * qty;
  const advance = area === 'outside' ? Math.min(ADVANCE_OUTSIDE_DHAKA, total) : 0;
  const due = total - advance;

  const cache = CacheService.getScriptCache();
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) throw userError_('সার্ভার ব্যস্ত, আবার চেষ্টা করুন।');
  let orderId;
  try {
    const sheet = getSheet_();

    // Idempotency: the same checkout submitted twice returns the first order
    if (requestId) {
      const prev = cache.get('req_' + requestId);
      if (prev) return Object.assign({ ok: true, duplicate: true }, JSON.parse(prev));
    }

    // A reused bKash TrxID is almost always fraud or a mistake
    if (trxId && findInColumn_(sheet, 'bkashTrxId', trxId)) {
      throw userError_('এই ট্রানজেকশন আইডি দিয়ে আগেই অর্ডার করা হয়েছে। সমস্যা হলে আমাদের কল করুন।');
    }

    orderId = newOrderId_(sheet);
    const ts = now_();
    sheet.appendRow([
      orderId, ts, name, phone, area, district, address,
      String(b.productId), product.name, qty, product.price, total, advance, due,
      trxId, 'New', note, ts, requestId,
    ].map(safeCell_));
    SpreadsheetApp.flush();

    const result = { orderId: orderId, productName: product.name, total: total, advance: advance, due: due };
    if (requestId) cache.put('req_' + requestId, JSON.stringify(result), TOKEN_TTL);

    // Alerts run after the row is safely written; a failure here never loses the order
    notify_({ orderId, name, phone, product: product.name, qty, total, advance, due, area, district, address, trxId, note });
    return Object.assign({ ok: true }, result);
  } finally {
    lock.releaseLock();
  }
}

/* ==========================================================================
   Admin auth
   ========================================================================== */

function login_(b) {
  const cache = CacheService.getScriptCache();
  const fails = Number(cache.get('login_fails') || 0);
  if (fails >= 5) throw userError_('অনেকবার ভুল পাসওয়ার্ড। ১৫ মিনিট পরে চেষ্টা করুন।');

  const expected = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD');
  if (!expected) throw userError_('ADMIN_PASSWORD Script Property সেট করা হয়নি।');

  if (!safeEqual_(String(b.password || ''), expected)) {
    cache.put('login_fails', String(fails + 1), 15 * 60);
    Utilities.sleep(800);   // slow down guessing
    throw userError_('ভুল পাসওয়ার্ড।');
  }
  cache.remove('login_fails');
  const token = Utilities.getUuid() + Utilities.getUuid().replace(/-/g, '');
  cache.put('tok_' + token, '1', TOKEN_TTL);
  return { ok: true, token: token, expiresIn: TOKEN_TTL };
}

function requireToken_(b) {
  const t = String(b.token || '');
  if (!t || !CacheService.getScriptCache().get('tok_' + t)) {
    const e = userError_('সেশন শেষ। আবার লগইন করুন।');
    e.code = 'AUTH';
    throw e;
  }
}

/* ==========================================================================
   Admin data
   ========================================================================== */

function getOrders_() {
  const sheet = getSheet_();
  const last = sheet.getLastRow();
  if (last < 2) return { ok: true, orders: [], statuses: STATUSES };
  const values = sheet.getRange(2, 1, last - 1, HEADERS.length).getDisplayValues();
  const orders = values
    .filter(r => r[0])
    .map(r => {
      const o = {};
      HEADERS.forEach((h, i) => { o[h] = r[i]; });
      ['qty', 'unitPrice', 'total', 'advance', 'due'].forEach(k => { o[k] = Number(o[k]) || 0; });
      delete o.requestId;
      return o;
    })
    .reverse();   // newest first
  return { ok: true, orders: orders, statuses: STATUSES };
}

function updateStatus_(b) {
  const status = String(b.status || '');
  if (STATUSES.indexOf(status) === -1) throw userError_('অজানা স্ট্যাটাস।');
  const orderId = String(b.orderId || '').replace(/[^A-Z0-9-]/gi, '');
  if (!orderId) throw userError_('অর্ডার আইডি নেই।');

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) throw userError_('সার্ভার ব্যস্ত, আবার চেষ্টা করুন।');
  try {
    const sheet = getSheet_();
    const row = findInColumn_(sheet, 'orderId', orderId);
    if (!row) throw userError_('অর্ডারটি পাওয়া যায়নি।');
    const ts = now_();
    sheet.getRange(row, HEADERS.indexOf('status') + 1).setValue(status);
    sheet.getRange(row, HEADERS.indexOf('updatedAt') + 1).setValue(ts);
    return { ok: true, orderId: orderId, status: status, updatedAt: ts };
  } finally {
    lock.releaseLock();
  }
}

/* ==========================================================================
   Alerts: Telegram + email (Bangla)
   ========================================================================== */

function notify_(o) {
  const props = PropertiesService.getScriptProperties();
  const brand = props.getProperty('BRAND') || 'স্টোর';
  const lines = [
    '🛒 নতুন অর্ডার — ' + brand,
    'অর্ডার আইডি: ' + o.orderId,
    'নাম: ' + o.name,
    'মোবাইল: ' + o.phone,
    'পণ্য: ' + o.product + ' × ' + o.qty,
    'মোট: ৳' + o.total + (o.advance ? ' (অগ্রিম ৳' + o.advance + ', বাকি ৳' + o.due + ')' : ' (ক্যাশ অন ডেলিভারি)'),
    'এলাকা: ' + (o.area === 'inside' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে — ' + o.district),
    'ঠিকানা: ' + o.address,
    'বিকাশ TrxID: ' + (o.trxId || '—'),
  ];
  if (o.note) lines.push('নোট: ' + o.note);
  notifyText_(lines.join('\n'), 'নতুন অর্ডার ' + o.orderId + ' — ৳' + o.total);
}

// Sends a plain-text alert to Telegram and email (both optional)
function notifyText_(text, subject) {
  const props = PropertiesService.getScriptProperties();

  const tgToken = props.getProperty('TELEGRAM_BOT_TOKEN');
  const tgChat = props.getProperty('TELEGRAM_CHAT_ID');
  if (tgToken && tgChat) {
    try {
      UrlFetchApp.fetch('https://api.telegram.org/bot' + tgToken + '/sendMessage', {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({ chat_id: tgChat, text: text, disable_web_page_preview: true }),
        muteHttpExceptions: true,
      });
    } catch (err) { console.error('Telegram failed', err); }
  }

  const email = props.getProperty('ADMIN_EMAIL');
  if (email) {
    try {
      MailApp.sendEmail(email, subject || text.split('\n')[0], text);
    } catch (err) { console.error('Email failed', err); }
  }
}


/* ==========================================================================
   Reviews — only a customer with a DELIVERED order (verified by order ID +
   phone) can review, once per order. Nothing shows on the site until approved.
   ========================================================================== */

function submitReview_(b) {
  if (b.website) throw userError_('Rejected');
  if (typeof b.elapsedMs === 'number' && b.elapsedMs < 2500) throw userError_('অনুগ্রহ করে ফর্মটি আবার পূরণ করুন।');

  const orderId = String(b.orderId || '').replace(/[^A-Z0-9-]/gi, '').toUpperCase().slice(0, 20);
  const phone = normalizePhone_(b.phone);
  const rating = Number(b.rating);
  const name = clean_(b.name, 40);
  const place = clean_(b.place, 40);
  const text = clean_(b.text, 400);
  if (!orderId) throw userError_('অর্ডার আইডি নেই। আমাদের পাঠানো লিংক থেকে রিভিউ দিন।');
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw userError_('১ থেকে ৫ স্টার দিন।');
  if (name.length < 2) throw userError_('নাম লিখুন।');
  if (text.length < 10) throw userError_('অন্তত এক লাইন লিখুন (১০ অক্ষর)।');

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) throw userError_('সার্ভার ব্যস্ত, আবার চেষ্টা করুন।');
  try {
    const orders = getSheet_();
    const row = findInColumn_(orders, 'orderId', orderId);
    // Same message whether the order or the phone is wrong: don't leak which orders exist
    const order = row ? orders.getRange(row, 1, 1, HEADERS.length).getDisplayValues()[0] : null;
    if (!order || order[HEADERS.indexOf('phone')] !== phone) throw userError_('অর্ডার আইডি ও মোবাইল নম্বর মিলছে না।');
    if (order[HEADERS.indexOf('status')] !== 'Delivered') throw userError_('পণ্য ডেলিভারি হওয়ার পর রিভিউ দেওয়া যাবে।');

    const sheet = getReviewSheet_();
    if (findIn_(sheet, REVIEW_HEADERS, 'orderId', orderId)) throw userError_('এই অর্ডারের রিভিউ আগেই দেওয়া হয়েছে। ধন্যবাদ!');

    const ts = now_();
    const productName = order[HEADERS.indexOf('productName')];
    sheet.appendRow([orderId, ts, name, place, rating, text, productName, 'Pending', ts, phone].map(safeCell_));
    SpreadsheetApp.flush();
    notifyText_('⭐ নতুন রিভিউ (অনুমোদনের অপেক্ষায়)\n' + '★'.repeat(rating) + '☆'.repeat(5 - rating) +
      '\n' + name + (place ? ', ' + place : '') + ' — ' + productName + '\n"' + text + '"\nঅর্ডার: ' + orderId);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

// Approved reviews for the website, newest first, cached for 5 minutes
function getPublicReviews_() {
  const cache = CacheService.getScriptCache();
  const hit = cache.get('public_reviews');
  if (hit) return { ok: true, reviews: JSON.parse(hit) };
  const reviews = readReviews_()
    .filter(r => r.status === 'Approved')
    .slice(0, 20)
    .map(r => ({ name: shortName_(r.name), place: r.place, rating: r.rating, text: r.text, product: r.productName, month: String(r.createdAt).slice(0, 7) }));
  cache.put('public_reviews', JSON.stringify(reviews), 300);
  return { ok: true, reviews: reviews };
}

function getReviews_() {
  return { ok: true, reviews: readReviews_(), statuses: REVIEW_STATUSES };
}

function moderateReview_(b) {
  const status = String(b.status || '');
  if (REVIEW_STATUSES.indexOf(status) === -1) throw userError_('অজানা স্ট্যাটাস।');
  const orderId = String(b.orderId || '').replace(/[^A-Z0-9-]/gi, '');
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) throw userError_('সার্ভার ব্যস্ত, আবার চেষ্টা করুন।');
  try {
    const sheet = getReviewSheet_();
    const row = findIn_(sheet, REVIEW_HEADERS, 'orderId', orderId);
    if (!row) throw userError_('রিভিউটি পাওয়া যায়নি।');
    const ts = now_();
    sheet.getRange(row, REVIEW_HEADERS.indexOf('status') + 1).setValue(status);
    sheet.getRange(row, REVIEW_HEADERS.indexOf('updatedAt') + 1).setValue(ts);
    CacheService.getScriptCache().remove('public_reviews');
    return { ok: true, orderId: orderId, status: status };
  } finally {
    lock.releaseLock();
  }
}

function readReviews_() {
  const sheet = getReviewSheet_();
  const last = sheet.getLastRow();
  if (last < 2) return [];
  return sheet.getRange(2, 1, last - 1, REVIEW_HEADERS.length).getDisplayValues()
    .filter(r => r[0])
    .map(r => { const o = {}; REVIEW_HEADERS.forEach((h, i) => { o[h] = r[i]; }); o.rating = Number(o.rating) || 0; return o; })
    .reverse();
}

// "রাশেদা বেগম" → "রাশেদা ব." (first name + initial, for privacy)
function shortName_(n) {
  const parts = String(n || '').trim().split(/\s+/);
  return parts.length > 1 ? parts[0] + ' ' + Array.from(parts[1])[0] + '.' : parts[0];
}

function getReviewSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(REVIEW_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(REVIEW_SHEET);
    sheet.getRange(1, 1, 1, REVIEW_HEADERS.length).setValues([REVIEW_HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, sheet.getMaxRows(), REVIEW_HEADERS.length).setNumberFormat('@');
  }
  return sheet;
}

// Like findInColumn_ but for any sheet/header list
function findIn_(sheet, headers, header, value) {
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const col = headers.indexOf(header) + 1;
  const hit = sheet.getRange(2, col, last - 1, 1).createTextFinder(String(value)).matchEntireCell(true).findNext();
  return hit ? hit.getRow() : 0;
}

/* ==========================================================================
   Helpers
   ========================================================================== */

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
    // Plain-text format keeps leading zeros on phone numbers (017… not 17…)
    sheet.getRange(1, 1, sheet.getMaxRows(), HEADERS.length).setNumberFormat('@');
  }
  return sheet;
}

// ORD-YYMMDD-XXXX, XXXX from an unambiguous alphabet; checked for collisions
function newOrderId_(sheet) {
  const day = Utilities.formatDate(new Date(), TZ, 'yyMMdd');
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (let i = 0; i < 10; i++) {
    let s = '';
    for (let j = 0; j < 4; j++) s += abc.charAt(Math.floor(Math.random() * abc.length));
    const id = 'ORD-' + day + '-' + s;
    if (!findInColumn_(sheet, 'orderId', id)) return id;
  }
  throw new Error('Could not generate a unique order id');
}

// Returns the 1-based row number of an exact match in a column, or 0
function findInColumn_(sheet, header, value) {
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const col = HEADERS.indexOf(header) + 1;
  const hit = sheet.getRange(2, col, last - 1, 1).createTextFinder(String(value)).matchEntireCell(true).findNext();
  return hit ? hit.getRow() : 0;
}

function now_() { return Utilities.formatDate(new Date(), TZ, "yyyy-MM-dd'T'HH:mm:ss'+06:00'"); }

function toEnDigits_(s) { return s.replace(/[০-৯]/g, d => String('০১২৩৪৫৬৭৮৯'.indexOf(d))); }

function normalizePhone_(v) {
  let d = toEnDigits_(String(v || '')).replace(/\D/g, '');
  if (d.indexOf('880') === 0) d = d.slice(2);
  else if (d.indexOf('88') === 0 && d.length === 13) d = d.slice(2);
  return d;
}

// Trim, collapse whitespace, strip control chars and angle brackets, cap length
function clean_(v, max) {
  return String(v == null ? '' : v)
    .replace(/[\u0000-\u001F\u007F<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

// Stops spreadsheet formula injection (=, +, -, @ at the start of a cell)
function safeCell_(v) {
  return typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v;
}

function safeEqual_(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

function userError_(msg) { const e = new Error(msg); e.userFacing = true; return e; }

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ==========================================================================
   Run once from the editor: creates the sheet and grants permissions
   (Sheets, email, external requests). Then deploy as a Web App.
   ========================================================================== */
function setup() {
  getSheet_();
  getReviewSheet_();
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('ADMIN_PASSWORD')) console.warn('⚠ Set ADMIN_PASSWORD in Script Properties before using admin.html');
  // Touch the services so the authorization prompt covers them
  MailApp.getRemainingDailyQuota();
  UrlFetchApp.getRequest('https://api.telegram.org');
  console.log('Setup complete. Sheet "' + SHEET_NAME + '" is ready.');
}

// Optional: run from the editor to check Telegram/email alerts without placing an order
function testAlert() {
  notify_({ orderId: 'ORD-TEST-0000', name: 'টেস্ট', phone: '01700000000', product: PRODUCTS.chair.name, qty: 1,
            total: 6500, advance: 200, due: 6300, area: 'outside', district: 'চট্টগ্রাম', address: 'টেস্ট ঠিকানা', trxId: 'TEST12345', note: '' });
}
