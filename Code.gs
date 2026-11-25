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
 *    saveDraft     public       — checkout details typed but not yet ordered (abandoned cart)
 *    getAbandoned  token        — abandoned checkouts of the last 30 days, newest first
 *    updateDraft   token        — sets the follow-up status of one abandoned checkout
 *    subscribe     public       — newsletter sign-up from the store footer (Subscribers sheet)
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
const PRICE = 1099;   // ৳ per belt. Keep in sync with config.js (price).
// Every product the checkout can sell. Prices must match config.js (price / shopProducts).
// supplier: who ships it, shown in the sheet and alerts so you know where to place the order.
const PRODUCTS = {
  'pad-pink':               { name: 'WarmLune™ Heating Belt — পিংক', price: PRICE, oldPrice: 1690 },
  'combo-belt-mask':        { name: 'কম্বো: হিটিং ম্যাসাজ বেল্ট + Medicube জেল মাস্ক', price: 1799, oldPrice: 1898 },
  'anua-serum':             { name: 'Anua Niacinamide 10% + TXA 4% সিরাম 30ml', price: 2499, supplier: 'Zatiq' },
  'medicube-pdrn-serum':    { name: 'Medicube PDRN পিংক পেপটাইড সিরাম 30ml', price: 2300, supplier: 'Zatiq' },
  'medicube-capsule-cream': { name: 'Medicube PDRN পিংক কোলাজেন ক্যাপসুল ক্রিম 55g', price: 2600, supplier: 'Zatiq' },
  'medicube-gel-mask':      { name: 'Medicube PDRN পিংক কোলাজেন জেল মাস্ক 28g', price: 799, supplier: 'Zatiq' },
};
// Quantity discount — must match config.js qtyDiscount. percent: 0 turns it off.
// Only the products listed get it (the skincare margins are too thin for a discount).
const QTY_DISCOUNT = { minQty: 2, percent: 10, products: ['pad-pink'] };
function discountFor_(subtotal, qty, productId) {
  const applies = QTY_DISCOUNT.products.indexOf(String(productId)) > -1;
  return applies && QTY_DISCOUNT.percent > 0 && qty >= QTY_DISCOUNT.minQty ? Math.round(subtotal * QTY_DISCOUNT.percent / 100) : 0;
}
const ADVANCE_OUTSIDE_DHAKA = 0;   // ৳; 0 = full cash on delivery everywhere. Keep in sync with config.js
// Wallets accepted for the outside-Dhaka advance — must match config.js payMethods
const PAY_METHODS = { bkash: 'বিকাশ', nagad: 'নগদ', upay: 'উপায়', rocket: 'রকেট' };   // ৳ — must match config.js advanceOutsideDhaka
const MAX_QTY = 10;
const TZ = 'Asia/Dhaka';

const SHEET_NAME = 'Orders';
const HEADERS = [
  'orderId', 'createdAt', 'name', 'phone', 'area', 'district', 'address',
  'productId', 'productName', 'qty', 'unitPrice', 'total', 'advance', 'due',
  'bkashTrxId', 'status', 'note', 'updatedAt', 'requestId', 'payMethod',
  'customerUid',
];
// How the customer pays: cash on delivery, or the full amount up front by bKash / Nagad Send Money (TrxID checked by you)
const PAYMENTS = { cod: 'Cash on Delivery', bkash: 'বিকাশ', nagad: 'নগদ' };
const STATUSES = ['New', 'Confirmed', 'Shipped', 'Delivered', 'Returned', 'Fake', 'Cancelled'];
const TOKEN_TTL = 6 * 60 * 60;       // seconds (CacheService max)

// Reviews: customers of DELIVERED orders only; shown on the site after you approve them
const REVIEW_SHEET = 'Reviews';
const REVIEW_HEADERS = ['orderId', 'createdAt', 'name', 'place', 'rating', 'text', 'productName', 'status', 'updatedAt', 'phone'];
const REVIEW_STATUSES = ['Pending', 'Approved', 'Rejected'];

// Abandoned carts: checkouts where a valid phone was typed but no order was placed
const DRAFT_SHEET = 'Abandoned';
const DRAFT_HEADERS = ['draftId', 'createdAt', 'updatedAt', 'name', 'phone', 'productId', 'productName', 'qty', 'area', 'district', 'address', 'status', 'orderId'];
const DRAFT_STATUSES = ['New', 'Called', 'NoAnswer', 'Recovered', 'NotInterested', 'Ordered'];
const DRAFT_DAYS = 30;   // the admin list shows this many days

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
      case 'saveDraft':        return json_(saveDraft_(body));
      case 'getAbandoned':     requireToken_(body); return json_(getAbandoned_());
      case 'updateDraft':      requireToken_(body); return json_(updateDraft_(body));
      case 'subscribe':        return json_(subscribe_(body));
      case 'getProducts':      return json_(getProducts_());
      case 'adminProducts':    requireToken_(body); return json_({ ok: true, products: readProducts_() });
      case 'saveProduct':      requireToken_(body); return json_(saveProduct_(body));
      case 'uploadImage':      requireToken_(body); return json_(uploadImage_(body));
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
  // A cart sends items: [{productId, qty}]; the single-product checkout sends productId + qty.
  const CATALOG = productMap_();
  const rawItems = Array.isArray(b.items) && b.items.length ? b.items.slice(0, 20) : [{ productId: b.productId, qty: b.qty }];
  const lines = [];
  rawItems.forEach(it => {
    const pid = String(it && it.productId || '');
    const product = CATALOG[pid];
    if (!product) throw userError_('পণ্যটি পাওয়া যায়নি।');
    if (product.inStock === false) throw userError_(product.name + ' এখন স্টকে নেই।');
    if (!(product.price > 0)) throw userError_('দাম এখনও সেট করা হয়নি। কল বা WhatsApp-এ অর্ডার করুন।');
    const q = Number(it.qty);
    if (!Number.isInteger(q) || q < 1 || q > MAX_QTY) throw userError_('পরিমাণ ১ থেকে ' + MAX_QTY + ' এর মধ্যে হতে হবে।');
    const same = lines.filter(l => l.pid === pid)[0];
    if (same) { same.qty = Math.min(MAX_QTY, same.qty + q); } else { lines.push({ pid: pid, product: product, qty: q }); }
  });

  const name = clean_(b.name, 60);
  if (name.length < 2) throw userError_('নাম লিখুন।');

  const phone = normalizePhone_(b.phone);
  if (!/^01[3-9]\d{8}$/.test(phone)) throw userError_('সঠিক মোবাইল নম্বর দিন।');

  const area = b.area === 'inside' || b.area === 'outside' ? b.area : '';
  if (!area) throw userError_('ডেলিভারি এলাকা নির্বাচন করুন।');

  let district = 'ঢাকা (সিটি)';
  if (area === 'outside') {
    district = clean_(b.district, 40);
    if (DISTRICTS.indexOf(district) === -1) throw userError_('সঠিক জেলা নির্বাচন করুন।');
  }

  // Payment: cod (default) or the full amount by bKash / Nagad with the TrxID
  const payment = PAYMENTS[b.payment] ? b.payment : 'cod';
  let trxId = '';
  let payMethod = payment === 'cod' ? '' : payment;
  if (payment === 'cod' && area === 'outside' && ADVANCE_OUTSIDE_DHAKA > 0) {   // old optional advance, off while 0
    trxId = toEnDigits_(String(b.trxId || '')).trim().toUpperCase();
    if (!/^[A-Z0-9]{8,12}$/.test(trxId)) throw userError_('সঠিক ট্রানজেকশন আইডি দিন।');
    payMethod = String(b.payMethod || '');
    if (!PAY_METHODS[payMethod]) throw userError_('কোন মাধ্যমে টাকা পাঠিয়েছেন (বিকাশ/নগদ/উপায়/রকেট) বেছে নিন।');
  }
  if (payment !== 'cod') {
    trxId = toEnDigits_(String(b.trxId || '')).trim().toUpperCase();
    if (!/^[A-Z0-9]{8,12}$/.test(trxId)) throw userError_('সঠিক ট্রানজেকশন আইডি (TrxID) দিন — ৮ থেকে ১২ অক্ষরের।');
  }
  const uid = String(b.uid || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 64);

  const address = clean_(b.address, 300);
  if (address.length < 10) throw userError_('সম্পূর্ণ ঠিকানা লিখুন।');
  const note = clean_(b.note, 300);
  const requestId = String(b.requestId || '').replace(/[^a-z0-9]/gi, '').slice(0, 40);

  // ---- Server-side pricing (per line, so the belt's quantity discount still applies)
  let subtotal = 0, discount = 0, qty = 0;
  lines.forEach(l => { const st = l.product.price * l.qty; subtotal += st; discount += discountFor_(st, l.qty, l.pid); qty += l.qty; });
  const total = subtotal - discount;
  const advance = payment !== 'cod' ? total : (area === 'outside' ? Math.min(ADVANCE_OUTSIDE_DHAKA, total) : 0);
  const due = total - advance;
  const productIds = lines.map(l => l.pid).join(', ');
  const productNames = lines.map(l => l.product.name + ' × ' + l.qty).join('; ');
  const unitPrice = lines.length === 1 ? lines[0].product.price : '';
  const suppliers = lines.filter(l => l.product.supplier).map(l => l.product.supplier).filter((v, i, a) => a.indexOf(v) === i);

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
      productIds, productNames, qty, unitPrice, total, advance, due,
      trxId, 'New', note, ts, requestId, payMethod ? (PAYMENTS[payMethod] || PAY_METHODS[payMethod] || payMethod) : PAYMENTS.cod,
      uid,
    ].map(safeCell_));
    SpreadsheetApp.flush();

    const result = { orderId: orderId, productName: productNames, subtotal: subtotal, discount: discount, total: total, advance: advance, due: due, payment: payment };
    if (requestId) cache.put('req_' + requestId, JSON.stringify(result), TOKEN_TTL);

    // This checkout is no longer abandoned
    if (requestId) markDraftOrdered_(requestId, orderId);

    // Alerts run after the row is safely written; a failure here never loses the order
    notify_({ orderId, name, phone, product: productNames + (suppliers.length ? ' (' + suppliers.join(', ') + ' থেকে অর্ডার দিন)' : ''), qty, total, advance, due, area, district, address, trxId, payMethod: payMethod ? (PAYMENTS[payMethod] || PAY_METHODS[payMethod] || payMethod) : PAYMENTS.cod, note });
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
   Abandoned cart
   ========================================================================== */

// Called by the checkout while the customer types (debounced) and when they leave the page.
// One row per checkout visit (draftId = the checkout's requestId), updated in place.
function saveDraft_(b) {
  if (b.website) return { ok: true };                                   // bot: pretend success
  const draftId = String(b.draftId || '');
  if (!/^r[a-z0-9]{6,40}$/.test(draftId)) throw userError_('Invalid draft');
  const phone = normalizePhone_(b.phone);
  if (!/^01[3-9]\d{8}$/.test(phone)) return { ok: true, skipped: true };  // nothing to follow up yet

  const cache = CacheService.getScriptCache();
  if (cache.get('req_' + draftId)) return { ok: true, ordered: true };  // already became an order
  if (cache.get('drt_' + draftId)) return { ok: true, throttled: true };
  // Spam guard: at most 300 new or updated drafts per hour
  const hourKey = 'drh_' + Utilities.formatDate(new Date(), TZ, 'yyMMddHH');
  const perHour = Number(cache.get(hourKey) || 0);
  if (perHour >= 300) return { ok: true, throttled: true };

  const productId = PRODUCTS[String(b.productId)] ? String(b.productId) : Object.keys(PRODUCTS)[0];
  let qty = Number(b.qty);
  if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) qty = 1;
  const area = b.area === 'inside' || b.area === 'outside' ? b.area : '';
  let district = clean_(b.district, 40);
  if (area !== 'outside' || DISTRICTS.indexOf(district) === -1) district = '';
  const name = clean_(b.name, 60);
  const address = clean_(b.address, 300);

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return { ok: true, throttled: true };
  try {
    const sheet = getDraftSheet_();
    purgeOldDrafts_(sheet);
    const ts = now_();
    const row = findIn_(sheet, DRAFT_HEADERS, 'draftId', draftId);
    const values = [name, phone, productId, PRODUCTS[productId].name, qty, area, district, address].map(safeCell_);
    if (row) {
      const cur = sheet.getRange(row, 1, 1, DRAFT_HEADERS.length).getDisplayValues()[0];
      if (cur[DRAFT_HEADERS.indexOf('status')] === 'Ordered') return { ok: true, ordered: true };
      sheet.getRange(row, DRAFT_HEADERS.indexOf('updatedAt') + 1, 1, 1 + values.length).setValues([[ts].concat(values)]);
    } else {
      sheet.appendRow([draftId, ts, ts].concat(values, ['New', '']));
    }
    cache.put('drt_' + draftId, '1', 2);
    cache.put(hourKey, String(perHour + 1), 3600);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

function markDraftOrdered_(draftId, orderId) {
  try {
    const sheet = getDraftSheet_();
    const row = findIn_(sheet, DRAFT_HEADERS, 'draftId', draftId);
    if (!row) return;
    sheet.getRange(row, DRAFT_HEADERS.indexOf('updatedAt') + 1).setValue(now_());
    sheet.getRange(row, DRAFT_HEADERS.indexOf('status') + 1).setValue('Ordered');
    sheet.getRange(row, DRAFT_HEADERS.indexOf('orderId') + 1).setValue(orderId);
  } catch (err) { console.error('markDraftOrdered failed', err); }   // never block the order
}

// Privacy policy promise: unfinished checkouts are deleted after DRAFT_DAYS.
// Rows are appended in time order, so the old ones are always at the top.
function purgeOldDrafts_(sheet) {
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const since = Utilities.formatDate(new Date(Date.now() - DRAFT_DAYS * 86400000), TZ, "yyyy-MM-dd'T'HH:mm:ss");
  if (String(sheet.getRange(2, 2).getDisplayValue()) >= since) return 0;       // quick exit
  const created = sheet.getRange(2, 2, last - 1, 1).getDisplayValues();
  let n = 0;
  while (n < created.length && String(created[n][0]) < since) n++;
  if (n) sheet.deleteRows(2, n);
  return n;
}

function getAbandoned_() {
  const sheet = getDraftSheet_();
  purgeOldDrafts_(sheet);
  const last = sheet.getLastRow();
  if (last < 2) return { ok: true, drafts: [], statuses: DRAFT_STATUSES };
  const since = Utilities.formatDate(new Date(Date.now() - DRAFT_DAYS * 86400000), TZ, "yyyy-MM-dd'T'HH:mm:ss");

  // A customer who ordered later (e.g. from another tab) counts as ordered too
  const orderedAt = {};
  const os = getSheet_(), ol = os.getLastRow();
  if (ol >= 2) {
    os.getRange(2, 1, ol - 1, HEADERS.length).getDisplayValues().forEach(r => {
      const ph = r[HEADERS.indexOf('phone')], at = r[HEADERS.indexOf('createdAt')];
      if (!orderedAt[ph] || at > orderedAt[ph].at) orderedAt[ph] = { at: at, id: r[0] };
    });
  }
  const drafts = sheet.getRange(2, 1, last - 1, DRAFT_HEADERS.length).getDisplayValues()
    .filter(r => r[0] && r[1] >= since)
    .map(r => {
      const d = {};
      DRAFT_HEADERS.forEach((h, i) => { d[h] = r[i]; });
      d.qty = Number(d.qty) || 1;
      const o = orderedAt[d.phone];
      if (d.status !== 'Ordered' && o && o.at >= d.createdAt.slice(0, 19)) { d.status = 'Ordered'; d.orderId = o.id; }
      return d;
    })
    .reverse();
  return { ok: true, drafts: drafts, statuses: DRAFT_STATUSES };
}

function updateDraft_(b) {
  const status = String(b.status || '');
  if (DRAFT_STATUSES.indexOf(status) === -1 || status === 'Ordered') throw userError_('অজানা স্ট্যাটাস।');
  const draftId = String(b.draftId || '').replace(/[^a-z0-9]/gi, '');
  if (!draftId) throw userError_('আইডি নেই।');
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) throw userError_('সার্ভার ব্যস্ত, আবার চেষ্টা করুন।');
  try {
    const sheet = getDraftSheet_();
    const row = findIn_(sheet, DRAFT_HEADERS, 'draftId', draftId);
    if (!row) throw userError_('পাওয়া যায়নি।');
    sheet.getRange(row, DRAFT_HEADERS.indexOf('status') + 1).setValue(status);
    return { ok: true, draftId: draftId, status: status };
  } finally {
    lock.releaseLock();
  }
}

function getDraftSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(DRAFT_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(DRAFT_SHEET);
    sheet.getRange(1, 1, 1, DRAFT_HEADERS.length).setValues([DRAFT_HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, sheet.getMaxRows(), DRAFT_HEADERS.length).setNumberFormat('@');
  }
  return sheet;
}

/* ==========================================================================
   Newsletter sign-ups (store footer) — one row per email, duplicates ignored
   ========================================================================== */
const SUB_SHEET = 'Subscribers';
const SUB_HEADERS = ['email', 'createdAt'];

function subscribe_(b) {
  if (b.website) return { ok: true };                                  // bot: pretend success
  const email = String(b.email || '').trim().toLowerCase().slice(0, 120);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw userError_('Please enter a valid email address.');
  const cache = CacheService.getScriptCache();
  const hourKey = 'sub_' + Utilities.formatDate(new Date(), TZ, 'yyMMddHH');
  const perHour = Number(cache.get(hourKey) || 0);
  if (perHour >= 200) return { ok: true, throttled: true };            // spam guard
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) throw userError_('Server busy, please try again.');
  try {
    const sheet = getSubscriberSheet_();
    if (findIn_(sheet, SUB_HEADERS, 'email', email)) return { ok: true, already: true };
    sheet.appendRow([email, now_()].map(safeCell_));
    cache.put(hourKey, String(perHour + 1), 3600);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

function getSubscriberSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SUB_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(SUB_SHEET);
    sheet.getRange(1, 1, 1, SUB_HEADERS.length).setValues([SUB_HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, sheet.getMaxRows(), SUB_HEADERS.length).setNumberFormat('@');
  }
  return sheet;
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
    'অগ্রিম: ' + (o.trxId ? (o.payMethod || '') + ' · TrxID ' + o.trxId : '—'),
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
  } else if (sheet.getLastColumn() < HEADERS.length) {
    // An older sheet: add the new column titles at the end (existing rows stay as they are)
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
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
/* ==========================================================================
   Products — edited from the dashboard (admin.html → পণ্য)
   The "Products" sheet overrides config.js: an empty cell keeps the website's own value.
   Prices here are what the checkout charges.
   ========================================================================== */
const PRODUCT_SHEET = 'Products';
const PRODUCT_HEADERS = ['id', 'name', 'brand', 'category', 'price', 'oldPrice', 'inStock', 'visible', 'images', 'blurb', 'description', 'benefits', 'howTo', 'tags', 'supplier', 'sort', 'updatedAt'];
const PRODUCT_TAGS = ['featured', 'new', 'trending'];
const IMAGE_FOLDER = 'Bakaina product images';

function getProductSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(PRODUCT_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(PRODUCT_SHEET);
    sheet.getRange(1, 1, 1, PRODUCT_HEADERS.length).setValues([PRODUCT_HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, sheet.getMaxRows(), PRODUCT_HEADERS.length).setNumberFormat('@');
    // Start with the products the shop already sells (empty cells = keep the website's text and photos)
    const ts = now_();
    Object.keys(PRODUCTS).forEach((id, i) => {
      sheet.appendRow([id, '', '', '', String(PRODUCTS[id].price), PRODUCTS[id].oldPrice ? String(PRODUCTS[id].oldPrice) : '', 'yes', 'yes', '', '', '', '', '', '', PRODUCTS[id].supplier || '', String(i + 1), ts]);
    });
  }
  return sheet;
}
function readProducts_() {
  const sheet = getProductSheet_();
  const last = sheet.getLastRow();
  if (last < 2) return [];
  const lines = v => String(v || '').split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  return sheet.getRange(2, 1, last - 1, PRODUCT_HEADERS.length).getDisplayValues()
    .filter(r => r[0])
    .map(r => {
      const o = {}; PRODUCT_HEADERS.forEach((h, i) => { o[h] = r[i]; });
      o.price = Number(o.price) || 0; o.oldPrice = Number(o.oldPrice) || 0; o.sort = Number(o.sort) || 0;
      o.inStock = o.inStock !== 'no'; o.visible = o.visible !== 'no';
      o.images = lines(o.images); o.benefits = lines(o.benefits); o.howTo = lines(o.howTo);
      o.tags = String(o.tags || '').split(',').map(x => x.trim()).filter(t => PRODUCT_TAGS.indexOf(t) > -1);
      return o;
    })
    .sort((a, b) => a.sort - b.sort);
}
// What the checkout can sell: built-in products, then the sheet on top (hidden ones removed)
function productMap_() {
  const map = {};
  Object.keys(PRODUCTS).forEach(id => { map[id] = Object.assign({ id: id }, PRODUCTS[id]); });
  let rows = [];
  try { rows = readProducts_(); } catch (e) { console.error(e); }
  rows.forEach(p => {
    if (!p.visible) { delete map[p.id]; return; }
    const base = map[p.id] || { id: p.id };
    map[p.id] = Object.assign(base, {
      name: p.name || base.name || p.id,
      price: p.price > 0 ? p.price : base.price,
      supplier: p.supplier || base.supplier || '',
      inStock: p.inStock,
    });
  });
  return map;
}
function getProducts_() {
  const cache = CacheService.getScriptCache();
  const hit = cache.get('products_public');
  if (hit) return { ok: true, products: JSON.parse(hit) };
  const products = readProducts_().map(p => { const o = Object.assign({}, p); delete o.supplier; delete o.updatedAt; return o; });
  try { cache.put('products_public', JSON.stringify(products), 300); } catch (e) {}
  return { ok: true, products: products };
}
function saveProduct_(b) {
  const p = b.product || {};
  const id = String(p.id || '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  if (id.length < 2) throw userError_('পণ্যের ID দিন (ইংরেজি ছোট হাতের অক্ষর ও ড্যাশ)।');
  const name = clean_(p.name, 120);
  const price = Math.round(Number(p.price));
  if (!(price > 0 && price <= 1000000)) throw userError_('সঠিক দাম দিন।');
  const oldPrice = p.oldPrice ? Math.round(Number(p.oldPrice)) : 0;
  if (oldPrice && oldPrice <= price) throw userError_('আগের দাম বর্তমান দামের চেয়ে বেশি হতে হবে (না থাকলে খালি রাখুন)।');
  const category = String(p.category || '').replace(/[^a-z0-9-]/g, '').slice(0, 30);
  const images = (Array.isArray(p.images) ? p.images : []).map(String)
    .filter(u => /^https:\/\/[\w.-]+\/[\w\-./?=&%]+$/.test(u) || /^img\/[\w\-./]+$/.test(u)).slice(0, 8);
  const lines = (a, n, len) => (Array.isArray(a) ? a : String(a || '').split(/\r?\n/)).map(x => clean_(x, len)).filter(Boolean).slice(0, n).join('\n');
  const tags = (Array.isArray(p.tags) ? p.tags : []).filter(t => PRODUCT_TAGS.indexOf(t) > -1).join(',');
  const row = [id, name, clean_(p.brand, 40), category, String(price), oldPrice ? String(oldPrice) : '', p.inStock === false ? 'no' : 'yes', p.visible === false ? 'no' : 'yes',
    images.join('\n'), clean_(p.blurb, 160), clean_(p.description, 3000), lines(p.benefits, 12, 300), lines(p.howTo, 12, 300), tags, clean_(p.supplier, 40), String(Number(p.sort) || 0), now_()];
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) throw userError_('সার্ভার ব্যস্ত, আবার চেষ্টা করুন।');
  try {
    const sheet = getProductSheet_();
    const at = findIn_(sheet, PRODUCT_HEADERS, 'id', id);
    if (b.isNew && at) throw userError_('এই ID-র পণ্য আগে থেকেই আছে। অন্য ID দিন।');
    if (at) sheet.getRange(at, 1, 1, PRODUCT_HEADERS.length).setValues([row.map(safeCell_)]);
    else sheet.appendRow(row.map(safeCell_));
    SpreadsheetApp.flush();
  } finally { lock.releaseLock(); }
  CacheService.getScriptCache().remove('products_public');
  return { ok: true, id: id };
}
// Photo from the dashboard → Google Drive (anyone with the link can view) → its image address
function uploadImage_(b) {
  const data = String(b.data || '');
  const m = data.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/);
  if (!m) throw userError_('শুধু JPG, PNG বা WebP ছবি দিন।');
  const bytes = Utilities.base64Decode(m[2]);
  if (bytes.length > 4 * 1024 * 1024) throw userError_('ছবি ৪ MB-এর চেয়ে ছোট হতে হবে।');
  const props = PropertiesService.getScriptProperties();
  let folder = null;
  const fid = props.getProperty('IMAGE_FOLDER_ID');
  if (fid) { try { folder = DriveApp.getFolderById(fid); } catch (e) { folder = null; } }
  if (!folder) { folder = DriveApp.createFolder(IMAGE_FOLDER); props.setProperty('IMAGE_FOLDER_ID', folder.getId()); }
  const name = clean_(b.name, 60).replace(/[^\w.-]+/g, '-') || 'product';
  const file = folder.createFile(Utilities.newBlob(bytes, 'image/' + m[1], name + '.' + (m[1] === 'jpeg' ? 'jpg' : m[1])));
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return { ok: true, url: 'https://lh3.googleusercontent.com/d/' + file.getId() };
}

function setup() {
  getSheet_();
  getProductSheet_();
  getReviewSheet_();
  getDraftSheet_();
  getSubscriberSheet_();
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('ADMIN_PASSWORD')) console.warn('⚠ Set ADMIN_PASSWORD in Script Properties before using admin.html');
  // Touch the services so the authorization prompt covers them
  MailApp.getRemainingDailyQuota();
  UrlFetchApp.getRequest('https://api.telegram.org');
  DriveApp.getRootFolder();   // permission to save product photos
  console.log('Setup complete. Sheet "' + SHEET_NAME + '" is ready.');
}

// Optional: run from the editor to check Telegram/email alerts without placing an order
function testAlert() {
  notify_({ orderId: 'ORD-TEST-0000', name: 'টেস্ট', phone: '01700000000', product: PRODUCTS['pad-pink'].name, qty: 1,
            total: PRICE, advance: ADVANCE_OUTSIDE_DHAKA, due: PRICE - ADVANCE_OUTSIDE_DHAKA, area: 'outside', district: 'চট্টগ্রাম', address: 'টেস্ট ঠিকানা', payMethod: PAY_METHODS.bkash, trxId: 'TEST12345', note: '' });
}
