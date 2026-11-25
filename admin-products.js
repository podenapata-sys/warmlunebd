/* ==========================================================================
   Dashboard → পণ্য (Products): add products, edit text/photos, change prices,
   stock and visibility. Saved to the "Products" sheet by Code.gs; the website
   reads it on every visit. Uses the same admin login as the orders dashboard.
   ========================================================================== */
(function () {
  'use strict';
  var W = window.WL || {}, C = window.CONFIG || {}, S = W.store || {};
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var money = function (n) { return '৳' + Number(n || 0).toLocaleString('en-IN'); };
  var strip = function (h) { return String(h || '').replace(/<[^>]*>/g, ''); };
  var en = function (a) { return (a || []).map(function (x) { return strip(Array.isArray(x) ? (x[1] || x[0]) : x); }); };
  var cats = (S.categories || []).map(function (c) { return { id: c.id, name: c.name }; });
  var meta = S.products || {};
  var root = null, rows = [], editing = null;

  function token() { try { return sessionStorage.getItem('adminToken'); } catch (e) { return null; } }
  function api(action, data) {
    return fetch(C.appsScriptUrl || W.appsScriptUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(Object.assign({ action: action, token: token() }, data || {})) })
      .then(function (r) { return r.json(); })
      .then(function (res) { if (!res.ok) throw new Error(res.error || 'সমস্যা হয়েছে'); return res; });
  }

  // What the website shows today for the built-in products (so the form starts filled in)
  function siteDefaults() {
    var d = {};
    if (W.price > 0) d['pad-pink'] = { name: 'WarmLune™ Heating Belt', brand: 'WarmLune', price: W.price, oldPrice: W.oldPrice || 0, category: (meta.belt || {}).category || '',
      images: (W.gallery || []).map(function (g) { return g.src; }).filter(Boolean), blurb: ((W.catalog || [])[0] || {}).blurb_en || '', tags: (meta.belt || {}).tags || [] };
    (W.shopProducts || []).forEach(function (p) {
      d[p.id] = { name: p.name_en || p.name, brand: p.brand || '', price: p.price, oldPrice: p.oldPrice || 0, category: (meta[p.id] || {}).category || '',
        images: (p.images && p.images.length ? p.images : [p.image]).filter(Boolean), blurb: p.blurb_en || '', description: p.intro_en || '',
        benefits: en(p.benefits), howTo: en(p.howTo), tags: (meta[p.id] || {}).tags || [] };
    });
    return d;
  }
  var DEF = siteDefaults();
  function full(r) {   // sheet row + website text for empty cells
    var d = DEF[r.id] || {};
    var pick = function (k) { var v = r[k]; return (Array.isArray(v) ? v.length : v) ? v : d[k]; };
    var tags = (r.tags && r.tags.length ? r.tags : (d.tags || []).map(function (t) { return t === 'special' ? 'featured' : t; })).filter(function (t) { return ['featured', 'new', 'trending'].indexOf(t) > -1; });
    return { id: r.id, name: pick('name') || r.id, brand: pick('brand') || '', category: pick('category') || '', price: r.price || d.price || 0, oldPrice: r.price ? (r.oldPrice || 0) : (d.oldPrice || 0),
      inStock: r.inStock !== false, visible: r.visible !== false, images: pick('images') || [], blurb: pick('blurb') || '', description: pick('description') || '',
      benefits: pick('benefits') || [], howTo: pick('howTo') || [], tags: tags, supplier: r.supplier || '', sort: r.sort || 0 };
  }

  function catName(id) { var c = cats.filter(function (x) { return x.id === id; })[0]; return c ? c.name : '—'; }
  function list() {
    root.innerHTML = '<div class="pm-bar"><p class="hint">মোট ' + rows.length + 'টি পণ্য। দাম বদলে "সেভ" চাপলেই ওয়েবসাইটে ও চেকআউটে নতুন দাম চলবে (৫ মিনিটের মধ্যে)।</p>' +
      '<div><button class="btn sm outline" type="button" data-pm-reload>↻ রিফ্রেশ</button> <button class="btn sm" type="button" data-pm-new>+ নতুন পণ্য</button></div></div>' +
      '<div class="table-wrap"><table class="orders pm-table"><thead><tr><th>ছবি</th><th>পণ্য</th><th>ক্যাটাগরি</th><th>দাম (৳)</th><th>আগের দাম (৳)</th><th>স্টকে আছে</th><th>দেখাবে</th><th></th></tr></thead><tbody>' +
      rows.map(function (r, i) {
        var f = full(r);
        return '<tr data-i="' + i + '"' + (f.visible ? '' : ' class="pm-off"') + '><td>' + (f.images[0] ? '<img class="pm-thumb" src="' + esc(f.images[0]) + '" alt="">' : '<span class="pm-thumb"></span>') + '</td>' +
          '<td><strong>' + esc(f.name) + '</strong><br><small class="hint">' + esc(f.id) + '</small></td><td>' + esc(catName(f.category)) + '</td>' +
          '<td><input class="pm-num" type="number" min="1" step="1" inputmode="numeric" data-f="price" value="' + esc(f.price) + '" aria-label="দাম"></td>' +
          '<td><input class="pm-num" type="number" min="0" step="1" inputmode="numeric" data-f="oldPrice" value="' + esc(f.oldPrice || '') + '" aria-label="আগের দাম"></td>' +
          '<td><input type="checkbox" data-f="inStock"' + (f.inStock ? ' checked' : '') + ' aria-label="স্টকে আছে"></td>' +
          '<td><input type="checkbox" data-f="visible"' + (f.visible ? ' checked' : '') + ' aria-label="ওয়েবসাইটে দেখাবে"></td>' +
          '<td class="pm-act"><button class="btn sm" type="button" data-pm-save="' + i + '">সেভ</button> <button class="btn sm outline" type="button" data-pm-edit="' + i + '">এডিট</button></td></tr>';
      }).join('') + '</tbody></table></div><p class="form-error" data-pm-err hidden></p>';
  }

  function form(p, isNew) {
    editing = { p: p, isNew: isNew };
    var tagBox = function (t, label) { return '<label class="pm-chk"><input type="checkbox" name="tag" value="' + t + '"' + (p.tags.indexOf(t) > -1 ? ' checked' : '') + '> ' + label + '</label>'; };
    root.innerHTML = '<form class="panel pm-form" data-pm-form novalidate><h3>' + (isNew ? 'নতুন পণ্য' : 'পণ্য এডিট: ' + esc(p.name)) + '</h3>' +
      '<div class="pm-grid">' +
        '<div class="field"><label for="pm-name">নাম (ওয়েবসাইটে যেমন দেখাবে)</label><input id="pm-name" name="name" maxlength="120" required value="' + esc(p.name) + '"></div>' +
        '<div class="field"><label for="pm-id">ID (লিংকে থাকবে, পরে বদলানো যায় না)</label><input id="pm-id" name="id" maxlength="40" ' + (isNew ? '' : 'readonly ') + 'value="' + esc(p.id) + '" placeholder="যেমন usb-mini-fan"></div>' +
        '<div class="field"><label for="pm-brand">ব্র্যান্ড</label><input id="pm-brand" name="brand" maxlength="40" value="' + esc(p.brand) + '"></div>' +
        '<div class="field"><label for="pm-cat">ক্যাটাগরি</label><select id="pm-cat" name="category"><option value="">বেছে নিন</option>' + cats.map(function (c) { return '<option value="' + esc(c.id) + '"' + (c.id === p.category ? ' selected' : '') + '>' + esc(c.name) + '</option>'; }).join('') + '</select></div>' +
        '<div class="field"><label for="pm-price">দাম (৳)</label><input id="pm-price" name="price" type="number" min="1" step="1" inputmode="numeric" required value="' + esc(p.price || '') + '"></div>' +
        '<div class="field"><label for="pm-old">আগের দাম (৳) — শুধু সত্যি আগে এই দামে বিক্রি হলে</label><input id="pm-old" name="oldPrice" type="number" min="0" step="1" inputmode="numeric" value="' + esc(p.oldPrice || '') + '"></div>' +
        '<div class="field"><label for="pm-sup">সাপ্লায়ার (শুধু আপনি দেখবেন)</label><input id="pm-sup" name="supplier" maxlength="40" value="' + esc(p.supplier) + '"></div>' +
        '<div class="field"><label for="pm-sort">ক্রম (ছোট সংখ্যা আগে দেখাবে)</label><input id="pm-sort" name="sort" type="number" step="1" value="' + esc(p.sort || 0) + '"></div>' +
      '</div>' +
      '<div class="pm-row"><label class="pm-chk"><input type="checkbox" name="inStock"' + (p.inStock ? ' checked' : '') + '> স্টকে আছে</label><label class="pm-chk"><input type="checkbox" name="visible"' + (p.visible ? ' checked' : '') + '> ওয়েবসাইটে দেখাবে</label>' +
        tagBox('featured', 'Featured') + tagBox('new', 'New arrival') + tagBox('trending', 'Trending') + '</div>' +
      '<div class="field"><label>ছবি (প্রথমটা মূল ছবি; সর্বোচ্চ ৮টি)</label><div class="pm-imgs" data-pm-imgs></div>' +
        '<label class="btn sm outline pm-up">+ ছবি যোগ করুন<input type="file" accept="image/jpeg,image/png,image/webp" multiple data-pm-file hidden></label> <span class="hint" data-pm-upmsg></span></div>' +
      '<div class="field"><label for="pm-blurb">ছোট বর্ণনা (এক লাইনে)</label><input id="pm-blurb" name="blurb" maxlength="160" value="' + esc(p.blurb) + '"></div>' +
      '<div class="field"><label for="pm-desc">বিস্তারিত বর্ণনা</label><textarea id="pm-desc" name="description" rows="4" maxlength="3000">' + esc(p.description) + '</textarea></div>' +
      '<div class="pm-grid"><div class="field"><label for="pm-ben">সুবিধা (প্রতি লাইনে একটি)</label><textarea id="pm-ben" name="benefits" rows="5">' + esc(p.benefits.join('\n')) + '</textarea></div>' +
        '<div class="field"><label for="pm-how">ব্যবহারের নিয়ম (প্রতি লাইনে একটি ধাপ)</label><textarea id="pm-how" name="howTo" rows="5">' + esc(p.howTo.join('\n')) + '</textarea></div></div>' +
      '<p class="form-error" data-pm-ferr hidden></p>' +
      '<div class="pm-row"><button class="btn" type="submit">সেভ করুন</button> <button class="btn outline" type="button" data-pm-cancel>বাতিল</button>' +
        (isNew ? '' : ' <a class="btn outline" href="./?view=product&amp;id=' + encodeURIComponent(p.id === 'pad-pink' ? 'belt' : p.id) + '" target="_blank" rel="noopener">ওয়েবসাইটে দেখুন</a>') + '</div></form>';
    drawImgs();
  }
  function drawImgs() {
    var imgs = editing.p.images;
    $('[data-pm-imgs]', root).innerHTML = imgs.length ? imgs.map(function (u, i) {
      return '<figure><img src="' + esc(u) + '" alt=""><figcaption>' + (i ? '<button type="button" data-pm-first="' + i + '" title="মূল ছবি করুন">★ মূল</button>' : '<span>মূল ছবি</span>') +
        '<button type="button" data-pm-del="' + i + '" title="সরান" aria-label="ছবি সরান">✕</button></figcaption></figure>';
    }).join('') : '<p class="hint">এখনো কোনো ছবি নেই।</p>';
  }
  function resize(file) {
    return new Promise(function (ok, bad) {
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        var m = 1200, w = img.naturalWidth, h = img.naturalHeight, k = Math.min(1, m / Math.max(w, h));
        var c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
        var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url); ok(c.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = function () { URL.revokeObjectURL(url); bad(new Error('ছবিটি খোলা যায়নি।')); };
      img.src = url;
    });
  }
  function collect(f) {
    var lines = function (v) { return String(v || '').split(/\r?\n/).map(function (x) { return x.trim(); }).filter(Boolean); };
    return { id: f.id.value.trim(), name: f.name.value.trim(), brand: f.brand.value.trim(), category: f.category.value, price: Number(f.price.value), oldPrice: Number(f.oldPrice.value) || 0,
      supplier: f.supplier.value.trim(), sort: Number(f.sort.value) || 0, inStock: f.inStock.checked, visible: f.visible.checked,
      tags: Array.prototype.slice.call(f.querySelectorAll('[name=tag]:checked')).map(function (x) { return x.value; }),
      images: editing.p.images.slice(), blurb: f.blurb.value.trim(), description: f.description.value.trim(), benefits: lines(f.benefits.value), howTo: lines(f.howTo.value) };
  }
  var slug = function (s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40); };

  function load() {
    root.innerHTML = '<p class="hint">লোড হচ্ছে…</p>';
    return api('adminProducts').then(function (res) { rows = res.products || []; list(); })
      .catch(function (e) { var u = String(C.appsScriptUrl || W.appsScriptUrl || ''); root.innerHTML = '<div class="form-error">পণ্য আনা যায়নি: ' + esc(e.message) + '<br>Code.gs নতুন ভার্সন deploy করা হয়েছে কি না দেখুন।<br><small>ওয়েবসাইট এই deployment ব্যবহার করছে: …' + esc(u.slice(-26)) + ' — <a href="' + esc(u) + '" target="_blank" rel="noopener">খুলে দেখুন</a> (নতুন code হলে "version" লেখা থাকবে)</small></div>'; });
  }

  function bind() {
    root.addEventListener('click', function (e) {
      var t = e.target;
      if (t.closest('[data-pm-reload]')) load();
      else if (t.closest('[data-pm-new]')) form({ id: '', name: '', brand: '', category: '', price: '', oldPrice: 0, inStock: true, visible: true, images: [], blurb: '', description: '', benefits: [], howTo: [], tags: ['new'], supplier: '', sort: rows.length + 1 }, true);
      else if (t.closest('[data-pm-edit]')) form(full(rows[Number(t.closest('[data-pm-edit]').getAttribute('data-pm-edit'))]), false);
      else if (t.closest('[data-pm-cancel]')) list();
      else if (t.closest('[data-pm-del]')) { editing.p.images.splice(Number(t.closest('[data-pm-del]').getAttribute('data-pm-del')), 1); drawImgs(); }
      else if (t.closest('[data-pm-first]')) { var i = Number(t.closest('[data-pm-first]').getAttribute('data-pm-first')); editing.p.images.unshift(editing.p.images.splice(i, 1)[0]); drawImgs(); }
      else if (t.closest('[data-pm-save]')) {
        var b = t.closest('[data-pm-save]'), tr = b.closest('tr'), r = rows[Number(b.getAttribute('data-pm-save'))], p = full(r), err = $('[data-pm-err]', root);
        p.price = Number(tr.querySelector('[data-f=price]').value); p.oldPrice = Number(tr.querySelector('[data-f=oldPrice]').value) || 0;
        p.inStock = tr.querySelector('[data-f=inStock]').checked; p.visible = tr.querySelector('[data-f=visible]').checked;
        b.disabled = true; b.textContent = '…'; err.hidden = true;
        api('saveProduct', { product: p }).then(function () { b.textContent = '✓'; return load(); })
          .catch(function (x) { b.disabled = false; b.textContent = 'সেভ'; err.textContent = x.message; err.hidden = false; });
      }
    });
    root.addEventListener('input', function (e) {
      if (editing && editing.isNew && e.target.name === 'name') { var idf = $('#pm-id', root); if (!idf.dataset.touched) idf.value = slug(e.target.value); }
      if (e.target.id === 'pm-id') e.target.dataset.touched = '1';
    });
    root.addEventListener('change', function (e) {
      if (!e.target.matches('[data-pm-file]')) return;
      var files = Array.prototype.slice.call(e.target.files || []), msg = $('[data-pm-upmsg]', root), name = slug($('#pm-name', root).value) || 'product';
      var room = 8 - editing.p.images.length; files = files.slice(0, Math.max(0, room));
      var n = 0, chain = Promise.resolve();
      files.forEach(function (f) {
        chain = chain.then(function () { msg.textContent = 'আপলোড হচ্ছে ' + (++n) + '/' + files.length + '…'; return resize(f); })
          .then(function (data) { return api('uploadImage', { data: data, name: name }); })
          .then(function (res) { editing.p.images.push(res.url); drawImgs(); });
      });
      chain.then(function () { msg.textContent = files.length ? 'ছবি যোগ হয়েছে ✓' : 'সর্বোচ্চ ৮টি ছবি।'; })
        .catch(function (x) { msg.textContent = 'আপলোড হয়নি: ' + x.message; });
      e.target.value = '';
    });
    root.addEventListener('submit', function (e) {
      if (!e.target.matches('[data-pm-form]')) return;
      e.preventDefault();
      var f = e.target, p = collect(f), err = $('[data-pm-ferr]', root), btn = f.querySelector('[type=submit]');
      var fail = function (m) { err.textContent = m; err.hidden = false; };
      if (p.name.length < 2) return fail('পণ্যের নাম দিন।');
      if (editing.isNew) { p.id = slug(p.id || p.name); if (p.id.length < 2) return fail('ID দিন (ইংরেজি অক্ষর)।'); }
      if (!(p.price > 0)) return fail('সঠিক দাম দিন।');
      if (p.oldPrice && p.oldPrice <= p.price) return fail('আগের দাম বর্তমান দামের চেয়ে বেশি হতে হবে, না হলে খালি রাখুন।');
      if (!p.category) return fail('ক্যাটাগরি বেছে নিন।');
      if (!p.images.length) return fail('অন্তত একটি ছবি দিন।');
      err.hidden = true; btn.disabled = true; btn.textContent = 'সেভ হচ্ছে…';
      api('saveProduct', { product: p, isNew: editing.isNew }).then(load)
        .catch(function (x) { btn.disabled = false; btn.textContent = 'সেভ করুন'; fail(x.message); });
    });
  }

  var tab = document.querySelector('[data-tab="products"]');
  if (tab) tab.addEventListener('click', function () {
    if (!root) { root = document.querySelector('[data-products]'); bind(); }
    load();
  });
})();
