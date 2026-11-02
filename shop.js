/* ==========================================================================
   Storefront logic for index.html, checkout.html and thank-you.html.
   Page is chosen by <body data-page="...">. Settings live in config.js.
   ========================================================================== */
(function () {
  'use strict';
  var C = window.CONFIG;
  var page = document.body.getAttribute('data-page');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  /* ---------- Helpers ---------- */
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var BN_DIGITS = '০১২৩৪৫৬৭৮৯';

  // ৳ amount with Bangla digits, e.g. 8450 → ৳৮,৪৫০
  function taka(n) { return '৳' + toBn(Number(n).toLocaleString('en-IN')); }
  // Digits follow the chosen language (i18n.js); falls back to Bangla if i18n.js is absent
  var L = window.I18N || { t: function (k) { return k; }, num: function (s) { return String(s).replace(/\d/g, function (d) { return BN_DIGITS[d]; }); }, district: function (d) { return d; }, lang: 'bn' };
  var T = L.t;
  function toBn(s) { return L.num(s); }
  // Bangla → English digits (customers often type ০১৭…)
  function toEn(s) { return String(s || '').replace(/[০-৯]/g, function (d) { return BN_DIGITS.indexOf(d); }); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function product(id) { return C.products.filter(function (p) { return p.id === id; })[0]; }
  function ssGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  function waLink(text) { return 'https://wa.me/' + C.whatsapp + (text ? '?text=' + encodeURIComponent(text) : ''); }

  // Normalise a BD mobile: Bangla digits, spaces, +88 prefix → 01XXXXXXXXX
  function normalizePhone(v) {
    var d = toEn(v).replace(/[^\d]/g, '');
    if (d.indexOf('880') === 0) d = d.slice(2);
    else if (d.indexOf('88') === 0 && d.length === 13) d = d.slice(2);
    return d;
  }
  var PHONE_RE = /^01[3-9]\d{8}$/;

  /* ---------- Meta Pixel ---------- */
  function initPixel() {
    if (!C.pixelId) return;
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    fbq('init', C.pixelId);
    fbq('track', 'PageView');
  }
  function track(event, data, opts) {
    if (window.fbq) fbq('track', event, data || {}, opts || {});
  }

  /* ---------- Shared chrome: brand name, contact links ---------- */
  function fillShared() {
    $$('[data-brand]').forEach(function (el) { el.textContent = C.brand; });
    document.title = document.title.replace('{brand}', C.brand);
    $$('[data-phone]').forEach(function (el) { el.textContent = toBn(C.phone); });
    $$('[data-tel]').forEach(function (el) { el.href = 'tel:' + C.phone; });
    $$('[data-fb]').forEach(function (el) { el.href = C.facebookPage; });
    $$('[data-wa]').forEach(function (el) {
      el.href = waLink(el.getAttribute('data-wa') || T('wa.hello'));
      el.target = '_blank'; el.rel = 'noopener';
    });
    $$('[data-return-policy]').forEach(function (el) { el.textContent = C.returnPolicy; });
    $$('[data-email]').forEach(function (el) { el.textContent = C.email || ''; });
    $$('[data-email-link]').forEach(function (el) { if (C.email) el.href = 'mailto:' + C.email; });
    // Pages written out in both languages (policies): show the active one
    $$('[data-lang-block]').forEach(function (el) { el.hidden = el.getAttribute('data-lang-block') !== (L.lang || 'bn'); });
    $$('[data-advance]').forEach(function (el) { el.textContent = taka(C.advanceOutsideDhaka); });
    $$('[data-price-of]').forEach(function (el) { el.textContent = taka(product(el.getAttribute('data-price-of')).price); });
    $$('[data-year]').forEach(function (el) { el.textContent = toBn(new Date().getFullYear()); });
  }

  /* ======================================================================
     MOTION — fade-up reveals, staggered groups, number counters, sliders.
     Everything is skipped (content shown instantly) for prefers-reduced-motion.
     ====================================================================== */

  // Fade-up reveal: elements rise 40px and fade in when they reach the bottom
  // ~3% of the screen. Children of [data-stagger] enter one after another.
  function initReveal() {
    $$('[data-stagger]').forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.classList.add('reveal');
        child.style.transitionDelay = Math.min(i, 6) * 90 + 'ms';
      });
    });
    var els = $$('.reveal');
    var show = function (el) { el.classList.add('in'); };
    if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach(show); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { show(en.target); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -3% 0px', threshold: 0 });
    els.forEach(function (el) { io.observe(el); });
    // Safety net: anything already scrolled past (anchor jumps, fast flings) never stays hidden
    function sweep() {
      var h = window.innerHeight;
      els.forEach(function (el) { if (!el.classList.contains('in') && el.getBoundingClientRect().top < h) { show(el); io.unobserve(el); } });
    }
    window.addEventListener('load', function () { setTimeout(sweep, 300); });
    setTimeout(sweep, 2500);
    window.addEventListener('hashchange', function () { setTimeout(sweep, 50); });
  }

  // Number counters: <span data-count="64" data-prefix="৳" data-suffix="+">
  // Count up from 0 with an ease-out when visible; reset when scrolled back below.
  function initCounters() {
    var els = $$('[data-count]');
    if (!els.length) return;
    var fmt = function (el, n) { el.textContent = (el.getAttribute('data-prefix') || '') + toBn(Math.round(n).toLocaleString('en-IN')) + (el.getAttribute('data-suffix') || ''); };
    var DURATION = 2400;
    function run(el) {
      var target = Number(el.getAttribute('data-count')) || 0;
      var t0 = null;
      cancelAnimationFrame(el._raf);
      el._raf = requestAnimationFrame(function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / DURATION);
        fmt(el, target * (1 - Math.pow(1 - p, 3)));   // ease-out cubic
        if (p < 1) el._raf = requestAnimationFrame(step);
      });
    }
    if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach(function (el) { fmt(el, Number(el.getAttribute('data-count')) || 0); }); return; }
    els.forEach(function (el) { fmt(el, 0); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var el = en.target;
        if (en.isIntersecting && !el._done) { el._done = true; run(el); }
        // Replay next time: reset only once it has left through the bottom of the screen
        else if (!en.isIntersecting && en.boundingClientRect.top > 0 && el._done) { el._done = false; cancelAnimationFrame(el._raf); fmt(el, 0); }
      });
    }, { rootMargin: '0px 0px -15% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  // Slider: native scroll-snap track (smooth touch swipe) + mouse drag + arrows + dots.
  // Markup: [data-slider] > [data-track] > slides, plus optional [data-prev] [data-next] [data-dots]
  function initSliders() { $$('[data-slider]').forEach(initSlider); }
  function initSlider(root) {
    {
      var track = root && $('[data-track]', root);
      if (!track || !track.children.length) return;
      if (root._slider) { root._slider.refresh(); return; }
      var slides = Array.prototype.slice.call(track.children);
      var dotsWrap = $('[data-dots]', root);
      var behavior = reduceMotion ? 'auto' : 'smooth';
      // Slide i's scroll position, measured against the track itself
      var pos = function (i) { return slides[i].getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft; };
      var nearest = function (x) {
        var best = 0, d = Infinity;
        slides.forEach(function (_, i) { var dd = Math.abs(pos(i) - x); if (dd < d) { d = dd; best = i; } });
        return best;
      };
      var current = function () { return nearest(track.scrollLeft); };
      var go = function (i) {
        i = Math.max(0, Math.min(slides.length - 1, i));
        track.scrollTo({ left: pos(i), behavior: behavior });
      };
      if (dotsWrap) {
        dotsWrap.innerHTML = slides.map(function (_, i) { return '<button type="button" aria-label="স্লাইড ' + toBn(i + 1) + '"></button>'; }).join('');
        $$('button', dotsWrap).forEach(function (b, i) { b.addEventListener('click', function () { go(i); }); });
      }
      var sync = function () {
        var c = current(), max = track.scrollWidth - track.clientWidth - 2;
        if (dotsWrap) $$('button', dotsWrap).forEach(function (b, i) { b.classList.toggle('on', i === c); b.setAttribute('aria-current', i === c ? 'true' : 'false'); });
        var prev = $('[data-prev]', root), next = $('[data-next]', root);
        if (prev) prev.disabled = track.scrollLeft <= 2;
        if (next) next.disabled = track.scrollLeft >= max;
      };
      var prev = $('[data-prev]', root), next = $('[data-next]', root);
      if (prev) prev.addEventListener('click', function () { go(current() - 1); });
      if (next) next.addEventListener('click', function () { go(current() + 1); });
      var raf;
      track.addEventListener('scroll', function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(sync); }, { passive: true });
      window.addEventListener('resize', sync);
      track.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(current() + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(current() - 1); }
      });

      // Mouse drag (touch already scrolls natively)
      var down = false, startX = 0, startLeft = 0, moved = false;
      track.addEventListener('pointerdown', function (e) {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
        track.classList.add('dragging');
      });
      window.addEventListener('pointermove', function (e) {
        if (!down) return;
        var dx = e.clientX - startX;
        if (Math.abs(dx) > 4) moved = true;
        track.scrollLeft = startLeft - dx;
      });
      window.addEventListener('pointerup', function (e) {
        if (!down) return;
        down = false; track.classList.remove('dragging');
        var dx = e.clientX - startX, c = current();
        // A short fling still moves one slide
        if (Math.abs(dx) > 40) go(dx < 0 ? Math.max(c, currentFrom(startLeft) + 1) : Math.min(c, currentFrom(startLeft) - 1)); else go(c);
      });
      function currentFrom(left) { return nearest(left); }
      // Don't follow a link/click that ended a drag
      track.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
      track.addEventListener('dragstart', function (e) { e.preventDefault(); });
      root._slider = {
        refresh: function () {
          slides = Array.prototype.slice.call(track.children);
          if (dotsWrap) {
            dotsWrap.innerHTML = slides.map(function (_, i) { return '<button type="button" aria-label="স্লাইড ' + toBn(i + 1) + '"></button>'; }).join('');
            $$('button', dotsWrap).forEach(function (b, i) { b.addEventListener('click', function () { go(i); }); });
          }
          track.scrollLeft = 0; sync();
        },
      };
      sync();
    }
  }

  function imgsHtml(p, cls) {
    return p.image.map(function (src, i) {
      return '<img src="' + esc(src) + '" alt="' + esc(p.name) + (p.image.length > 1 ? ' — ছবি ' + toBn(i + 1) : '') + '" loading="lazy" decoding="async" width="600" height="600"' + (cls ? ' class="' + cls + '"' : '') + '>';
    }).join('');
  }
  function priceHtml(p) {
    var h = '<span class="price">' + taka(p.price) + '</span>';
    if (p.oldPrice && p.oldPrice > p.price) {
      h += ' <span class="price-old">' + taka(p.oldPrice) + '</span> <span class="save">' + taka(p.oldPrice - p.price) + ' সাশ্রয়</span>';
    }
    return h;
  }

  function stars(n) {
    n = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
    return n ? '<span class="stars" role="img" aria-label="' + toBn(n) + ' স্টার">' + '★'.repeat(n) + '<span class="off">' + '★'.repeat(5 - n) + '</span></span>' : '';
  }
  function renderReviews(list) {
    var sec = $('[data-reviews]');
    if (!sec || !list.length) return;
    sec.hidden = false;
    $('[data-track]', sec).innerHTML = list.map(function (t) {
      return '<figure class="quote">' + (t.rating ? stars(t.rating) : '<span class="quote-mark" aria-hidden="true">“</span>') +
        '<blockquote style="margin:0"><p>' + esc(t.text) + '</p></blockquote>' +
        '<figcaption class="quote-who"><strong>' + esc(t.name) + '</strong>' + esc([t.place, t.product].filter(Boolean).join(' · ')) +
        (t.product || t.month ? '<span class="verified">✓ ভেরিফাইড ক্রেতা</span>' : '') + '</figcaption></figure>';
    }).join('');
    initSlider($('[data-slider]', sec));
    // The section may have been revealed already; make sure new content is visible
    $$('.reveal', sec).forEach(function (el) { el.classList.add('in'); });
  }

  /* ======================================================================
     LANDING
     ====================================================================== */
  function initLanding() {
    // Product cards
    var grid = $('[data-products]');
    grid.innerHTML = C.products.map(function (p) {
      var featured = p.id === C.featuredProductId;
      return '<article class="card' + (featured ? ' featured' : '') + '" data-product-id="' + esc(p.id) + '">' +
        (featured ? '<span class="card-tag">সবচেয়ে জনপ্রিয়</span>' : '') +
        '<div class="card-media' + (p.image.length > 1 ? ' multi' : '') + '">' + imgsHtml(p) + '</div>' +
        '<div class="card-body">' +
          '<h3>' + esc(p.name) + '</h3>' +
          '<p>' + esc(p.short) + '</p>' +
          '<ul class="card-feats">' + p.features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
          '<div class="card-foot"><div class="card-price">' + priceHtml(p) + '</div>' +
          '<a class="btn block" href="checkout.html?product=' + encodeURIComponent(p.id) + '">অর্ডার করুন</a></div>' +
        '</div></article>';
    }).join('');

    // ViewContent: once per product, when at least half the card is on screen
    if ('IntersectionObserver' in window) {
      var seen = {};
      var vo = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var id = en.target.getAttribute('data-product-id');
          if (en.isIntersecting && !seen[id]) {
            seen[id] = true;
            var p = product(id);
            track('ViewContent', { content_ids: [id], content_name: p.name, content_type: 'product', value: p.price, currency: 'BDT' });
            vo.unobserve(en.target);
          }
        });
      }, { threshold: 0.5 });
      $$('[data-product-id]', grid).forEach(function (el) { vo.observe(el); });
    }

    // Counters: combo saving comes from the prices; customer count only if you set a real one
    var combo = product('combo');
    $$('[data-saving]').forEach(function (el) {
      if (combo && combo.oldPrice > combo.price) el.setAttribute('data-count', combo.oldPrice - combo.price);
      else el.closest('li').hidden = true;
    });
    if (C.happyCustomers > 0) {
      var li = $('[data-customers]');
      li.hidden = false;
      $('.num', li).setAttribute('data-count', C.happyCustomers);
      $('[data-stats]').style.setProperty('--cols', 4);
    }

    // Selling points
    var pts = $('[data-points]');
    if (pts) {
      if ((C.sellingPoints || []).length) {
        pts.innerHTML = C.sellingPoints.map(function (p, i) {
          return '<li><span class="pt-num">' + toBn(String(i + 1).padStart(2, '0')) + '</span><h3>' + esc(p.title) + '</h3><p>' + esc(p.text) + '</p></li>';
        }).join('');
      } else pts.closest('section').hidden = true;
    }

    // Reviews: real ones from config.js + approved ones from the Sheet (fetched live)
    var manual = (C.testimonials || []).filter(function (t) { return t && t.text && t.name; });
    renderReviews(manual);
    if (C.appsScriptUrl) {
      fetch(C.appsScriptUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'getPublicReviews' }) })
        .then(function (r) { return r.json(); })
        .then(function (res) { if (res.ok && res.reviews && res.reviews.length) renderReviews(manual.concat(res.reviews)); })
        .catch(function () { /* reviews are optional; the page works without them */ });
    }

    // Sticky bar + hero price use the featured product
    var fp = product(C.featuredProductId) || C.products[0];
    $$('[data-featured-price]').forEach(function (el) { el.innerHTML = priceHtml(fp); });
    $$('[data-featured-price-short]').forEach(function (el) { el.textContent = taka(fp.price); });
    $$('[data-featured-name]').forEach(function (el) { el.textContent = fp.name; });
    $$('[data-featured-link]').forEach(function (el) { el.href = 'checkout.html?product=' + encodeURIComponent(fp.id); });
  }

  /* ======================================================================
     CHECKOUT
     ====================================================================== */
  var DISTRICTS = ['বাগেরহাট','বান্দরবান','বরগুনা','বরিশাল','ভোলা','বগুড়া','ব্রাহ্মণবাড়িয়া','চাঁদপুর','চাঁপাইনবাবগঞ্জ','চট্টগ্রাম','চুয়াডাঙ্গা','কুমিল্লা','কক্সবাজার','ঢাকা','দিনাজপুর','ফরিদপুর','ফেনী','গাইবান্ধা','গাজীপুর','গোপালগঞ্জ','হবিগঞ্জ','জামালপুর','যশোর','ঝালকাঠি','ঝিনাইদহ','জয়পুরহাট','খাগড়াছড়ি','খুলনা','কিশোরগঞ্জ','কুড়িগ্রাম','কুষ্টিয়া','লক্ষ্মীপুর','লালমনিরহাট','মাদারীপুর','মাগুরা','মানিকগঞ্জ','মেহেরপুর','মৌলভীবাজার','মুন্সিগঞ্জ','ময়মনসিংহ','নওগাঁ','নড়াইল','নারায়ণগঞ্জ','নরসিংদী','নাটোর','নেত্রকোনা','নীলফামারী','নোয়াখালী','পাবনা','পঞ্চগড়','পটুয়াখালী','পিরোজপুর','রাজবাড়ী','রাজশাহী','রাঙ্গামাটি','রংপুর','সাতক্ষীরা','শরীয়তপুর','শেরপুর','সিরাজগঞ্জ','সুনামগঞ্জ','সিলেট','টাঙ্গাইল','ঠাকুরগাঁও'];

  function initCheckout() {
    var form = $('#order-form');
    var params = new URLSearchParams(location.search);
    var state = {
      productId: product(params.get('product')) ? params.get('product') : C.featuredProductId,
      qty: Math.max(1, Math.min(C.maxQty, parseInt(params.get('qty'), 10) || 1)),
      area: null,
    };
    // No price set yet: keep the form visible but closed, so nobody sees a ৳০ total
    var unpriced = !(product(state.productId).price > 0);
    var startedAt = Date.now();
    // One request id per checkout visit: the server uses it to ignore double submits
    var requestId = ssGet('checkoutRequestId');
    if (!requestId) { requestId = 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10); ssSet('checkoutRequestId', requestId); }

    // Product choices
    $('[data-product-choices]').innerHTML = C.products.map(function (p) {
      return '<label><input type="radio" name="product" value="' + esc(p.id) + '"' + (p.id === state.productId ? ' checked' : '') + '>' +
        '<img src="' + esc(p.image[0]) + '" alt="" width="56" height="56">' +
        '<span><span class="c-name">' + esc(p.name) + '</span><br><span class="c-price">' + (p.price > 0 ? taka(p.price) : T('co.priceSoon')) +
        (p.oldPrice ? ' <s>' + taka(p.oldPrice) + '</s>' : '') + '</span></span></label>';
    }).join('');

    // Districts
    var sel = form.elements.district;
    sel.innerHTML = '<option value="">' + esc(T('co.districtSel')) + '</option>' +
      DISTRICTS.slice().sort(function (a, b) { return a.localeCompare(b, 'bn'); })
        .map(function (d) { return '<option value="' + d + '">' + esc(L.district(d)) + '</option>'; }).join('');

    // Wallet picker (bKash / Nagad / Upay / Rocket) for the outside-Dhaka advance
    var methods = C.payMethods || [{ id: 'bkash', name: 'বিকাশ', name_en: 'bKash' }];
    var wName = function (m) { return L.lang === 'en' && m.name_en ? m.name_en : m.name; };
    $('[data-pay-methods]').innerHTML = methods.map(function (m) {
      return '<label><input type="radio" name="payMethod" value="' + esc(m.id) + '"> ' + esc(wName(m)) + '</label>';
    }).join('');
    // Send-money numbers, grouped: wallets sharing a number appear on one line
    var groups = [];
    methods.forEach(function (m) {
      var n = m.number || C.bkashNumber, g = groups.filter(function (x) { return x.number === n; })[0];
      if (g) g.names.push(wName(m)); else groups.push({ number: n, names: [wName(m)] });
    });
    $('[data-pay-numbers]').innerHTML = groups.map(function (g) {
      return '<div class="pay-num"><span class="pay-num-label">' + esc(g.names.join(' / ')) + '</span>' +
        '<strong class="num"><span data-number>' + esc(toBn(g.number)) + '</span> <button type="button" class="copy-btn" data-copy="' + esc(g.number) + '">' + esc(T('co.copy')) + '</button></strong></div>';
    }).join('');
    $$('[data-copy]').forEach(function (b) {
      b.addEventListener('click', function () {
        var btn = this;
        var done = function () { btn.textContent = T('co.copied'); setTimeout(function () { btn.textContent = T('co.copy'); }, 1500); };
        if (navigator.clipboard) navigator.clipboard.writeText(btn.getAttribute('data-copy')).then(done, done); else done();
      });
    });

    function totals() {
      var p = product(state.productId);
      var subtotal = p.price * state.qty;
      var qd = C.qtyDiscount || {};
      var discount = qd.percent > 0 && state.qty >= qd.minQty ? Math.round(subtotal * qd.percent / 100) : 0;
      var total = subtotal - discount;
      var advance = state.area === 'outside' ? Math.min(C.advanceOutsideDhaka, total) : 0;
      return { p: p, subtotal: subtotal, discount: discount, total: total, advance: advance, due: total - advance };
    }

    function render() {
      var t = totals();
      $('[data-qty]').textContent = toBn(state.qty);
      $('[data-qty-minus]').disabled = state.qty <= 1;
      $('[data-qty-plus]').disabled = state.qty >= C.maxQty;
      var outside = state.area === 'outside';
      $('[data-district-field]').hidden = !outside;
      $('[data-bkash-box]').hidden = !outside;
      $('[data-trx-field]').hidden = !outside;
      $('[data-pay-field]').hidden = !outside;
      $('[data-cod-box]').hidden = state.area !== 'inside';
      $('[data-payment-hint]').hidden = !!state.area;
      sel.required = outside;
      form.elements.trxId.required = outside;

      $('[data-summary]').innerHTML =
        '<div class="summary-item"><img src="' + esc(t.p.image[0]) + '" alt="" width="64" height="64"><div><strong>' + esc(t.p.name) + '</strong><br>' +
          '<span class="hint">' + taka(t.p.price) + ' × ' + toBn(state.qty) + '</span></div></div>' +
        row(T('co.subtotal'), taka(t.subtotal)) +
        (t.discount ? row(T('co.discount', { pct: toBn(C.qtyDiscount.percent), n: toBn(C.qtyDiscount.minQty) }), '<span class="free">− ' + taka(t.discount) + '</span>') : '') +
        row(T('co.delivery'), '<span class="free">' + T('co.free') + '</span>') +
        (t.advance ? row(T('co.advance'), '− ' + taka(t.advance)) : '') +
        '<div class="summary-row total"><span>' + T('co.due') + '</span><span>' + taka(t.due) + '</span></div>';
      $('[data-bar-total]').textContent = taka(t.due);
    }
    function row(a, b) { return '<div class="summary-row"><span>' + a + '</span><span>' + b + '</span></div>'; }

    form.addEventListener('change', function (e) {
      if (e.target.name === 'product') { state.productId = e.target.value; render(); }
      if (e.target.name === 'area') { state.area = e.target.value; render(); clearError(e.target); }
    });
    $('[data-qty-minus]').addEventListener('click', function () { if (state.qty > 1) { state.qty--; render(); } });
    $('[data-qty-plus]').addEventListener('click', function () { if (state.qty < C.maxQty) { state.qty++; render(); } });
    // Clear field error as soon as the user fixes it
    form.addEventListener('input', function (e) { clearError(e.target); });
    // Sticky bar button submits the form
    $('[data-bar-submit]').addEventListener('click', function () { form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit', { cancelable: true })); });

    function setError(name, on) {
      var f = form.querySelector('[data-field="' + name + '"]');
      if (f) f.classList.toggle('invalid', on);
      return !on;
    }
    function clearError(el) {
      var f = el.closest && el.closest('[data-field]');
      if (f) f.classList.remove('invalid');
    }

    function validate() {
      var el = form.elements, ok = true;
      var phone = normalizePhone(el.phone.value);
      ok = setError('name', el.name.value.trim().length < 2) && ok;
      ok = setError('phone', !PHONE_RE.test(phone)) && ok;
      ok = setError('area', !state.area) && ok;
      if (state.area === 'outside') {
        ok = setError('district', !el.district.value) && ok;
        ok = setError('payMethod', !form.querySelector('input[name=payMethod]:checked')) && ok;
        ok = setError('trxId', !/^[A-Z0-9]{8,12}$/.test(toEn(el.trxId.value).trim().toUpperCase())) && ok;
      }
      ok = setError('address', el.address.value.trim().length < 10) && ok;
      if (!ok) {
        var first = form.querySelector('.invalid input, .invalid select, .invalid textarea');
        if (first) { first.focus({ preventScroll: true }); first.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' }); }
      }
      return ok;
    }

    /* Abandoned cart: once a valid phone is typed, save the details so the shop can
       follow up if the order isn't finished. Debounced; flushed when the page is left.
       The transaction ID is never sent. */
    var draftSent = '', draftTimer = null, ordered = false;
    function draftPayload() {
      var el = form.elements;
      return {
        action: 'saveDraft', draftId: requestId, website: el.website.value,
        name: el.name.value.trim(), phone: normalizePhone(el.phone.value),
        productId: state.productId, qty: state.qty, area: state.area || '',
        district: state.area === 'outside' ? el.district.value : '', address: el.address.value.trim(),
      };
    }
    function saveDraft(leaving) {
      clearTimeout(draftTimer);
      if (ordered || submitting || unpriced || !C.appsScriptUrl) return;
      var d = draftPayload();
      if (!PHONE_RE.test(d.phone)) return;
      var key = JSON.stringify(d);
      if (key === draftSent) return;
      draftSent = key;
      // Leaving the page: sendBeacon is the one request browsers reliably finish after unload
      if (leaving === true && navigator.sendBeacon) {
        try { if (navigator.sendBeacon(C.appsScriptUrl, new Blob([key], { type: 'text/plain;charset=utf-8' }))) return; } catch (x) {}
      }
      try {
        fetch(C.appsScriptUrl, { method: 'POST', keepalive: true, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: key })
          .catch(function () { draftSent = ''; });
      } catch (x) { draftSent = ''; }
    }
    function queueDraft() { clearTimeout(draftTimer); draftTimer = setTimeout(saveDraft, 2000); }
    form.addEventListener('input', queueDraft);
    form.addEventListener('change', queueDraft);
    $$('[data-qty-minus], [data-qty-plus]').forEach(function (b) { b.addEventListener('click', queueDraft); });
    window.addEventListener('pagehide', function () { saveDraft(true); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) saveDraft(true); });

    var submitting = false;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (submitting) return;
      var errBox = $('[data-form-error]');
      errBox.hidden = true;
      if (unpriced) { showError(T('co.unpricedErr', { phone: C.phone })); return; }
      if (!validate()) return;
      if (!C.appsScriptUrl) { showError(T('co.noServer')); return; }

      var el = form.elements, t = totals();
      var payload = {
        action: 'createOrder',
        requestId: requestId,
        website: el.website.value,                      // honeypot: must stay empty
        elapsedMs: Date.now() - startedAt,
        productId: state.productId,
        qty: state.qty,
        name: el.name.value.trim(),
        phone: normalizePhone(el.phone.value),
        area: state.area,
        district: state.area === 'outside' ? el.district.value : 'ঢাকা (সিটি)',
        address: el.address.value.trim(),
        trxId: state.area === 'outside' ? toEn(el.trxId.value).trim().toUpperCase() : '',
        payMethod: state.area === 'outside' ? ((form.querySelector('input[name=payMethod]:checked') || {}).value || '') : '',
        note: el.note.value.trim(),
      };

      setLoading(true);
      var ctrl = 'AbortController' in window ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 25000);
      // text/plain avoids a CORS preflight, which Apps Script cannot answer
      fetch(C.appsScriptUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload), signal: ctrl && ctrl.signal })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          clearTimeout(timer);
          if (!res.ok) throw new Error(res.error || T('co.failed'));
          // Keep a copy for the thank-you page summary; URL only carries id & value
          ssSet('lastOrder', JSON.stringify({ id: res.orderId, productId: payload.productId, name: t.p.name || res.productName, qty: payload.qty, total: res.total, discount: res.discount || 0, advance: res.advance, due: res.due, area: payload.area }));
          try { sessionStorage.removeItem('checkoutRequestId'); } catch (x) {}
          ordered = true; clearTimeout(draftTimer);
          location.href = 'thank-you.html?id=' + encodeURIComponent(res.orderId) + '&value=' + encodeURIComponent(res.total);
        })
        .catch(function (err) {
          clearTimeout(timer);
          setLoading(false);
          var real = err && err.name !== 'AbortError' && err.message && !/fetch|network|JSON/i.test(err.message);
          // Server messages are written in Bangla; in English mode show an English explanation instead
          showError(!real ? T('co.network') : (L.lang === 'en' && /[\u0980-\u09FF]/.test(err.message) ? T('co.serverErr') : err.message));
        });
    });

    function setLoading(on) {
      submitting = on;
      $$('[data-submit]').forEach(function (b) {
        b.disabled = on;
        b.innerHTML = on ? '<span class="spinner" aria-hidden="true"></span> ' + T('co.sending') : b.getAttribute('data-label');
      });
    }
    function showError(msg) {
      var box = $('[data-form-error]');
      box.textContent = msg; box.hidden = false;
      box.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    }
    $$('[data-submit]').forEach(function (b) { b.setAttribute('data-label', b.innerHTML); });

    render();
    if (unpriced) {
      $('[data-summary]').innerHTML = '<p class="hint">' + T('co.unpricedBox') + ' <a href="tel:' + esc(C.phone) + '">' + toBn(C.phone) + '</a></p>';
      $('[data-bar-total]').textContent = '—';
    }
    var p0 = product(state.productId);
    track('InitiateCheckout', { content_ids: [p0.id], content_name: p0.name, value: p0.price, currency: 'BDT', num_items: 1 });
  }

  /* ======================================================================
     REVIEW (review.html?id=ORD-…) — delivered customers only, checked server-side
     ====================================================================== */
  function initReview() {
    var form = $('#review-form');
    var id = (new URLSearchParams(location.search).get('id') || '').replace(/[^A-Z0-9-]/gi, '').toUpperCase().slice(0, 20);
    var startedAt = Date.now();
    var rating = 0;
    $('[data-review-order]').textContent = id || '—';
    if (!id) { $('[data-review-missing]').hidden = false; form.hidden = true; return; }

    // Star picker: radio inputs, so it works with keyboard and screen readers
    var labels = ['খুব খারাপ', 'খারাপ', 'মোটামুটি', 'ভালো', 'অসাধারণ'];
    $('[data-star-picker]').innerHTML = [1, 2, 3, 4, 5].map(function (n) {
      return '<label title="' + labels[n - 1] + '"><input type="radio" name="rating" value="' + n + '"><span aria-hidden="true">★</span><span class="sr-only">' + toBn(n) + ' স্টার — ' + labels[n - 1] + '</span></label>';
    }).join('');
    var paint = function (n) { $$('[data-star-picker] label').forEach(function (l, i) { l.classList.toggle('on', i < n); }); $('[data-star-label]').textContent = n ? labels[n - 1] : ''; };
    form.addEventListener('change', function (e) { if (e.target.name === 'rating') { rating = Number(e.target.value); paint(rating); form.querySelector('[data-field="rating"]').classList.remove('invalid'); } });
    $$('[data-star-picker] label').forEach(function (l, i) {
      l.addEventListener('mouseenter', function () { paint(i + 1); });
      l.addEventListener('mouseleave', function () { paint(rating); });
    });
    form.addEventListener('input', function (e) { var f = e.target.closest('[data-field]'); if (f) f.classList.remove('invalid'); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var el = form.elements, err = $('[data-form-error]'), ok = true;
      err.hidden = true;
      var mark = function (name, bad) { form.querySelector('[data-field="' + name + '"]').classList.toggle('invalid', bad); if (bad) ok = false; };
      mark('rating', !rating);
      mark('name', el.name.value.trim().length < 2);
      mark('phone', !PHONE_RE.test(normalizePhone(el.phone.value)));
      mark('text', el.text.value.trim().length < 10);
      if (!ok) return;
      if (!C.appsScriptUrl) { err.textContent = 'সার্ভার সেট করা হয়নি।'; err.hidden = false; return; }
      var btn = $('[data-submit]');
      btn.disabled = true; btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> পাঠানো হচ্ছে…';
      fetch(C.appsScriptUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({
        action: 'submitReview', orderId: id, phone: normalizePhone(el.phone.value), rating: rating,
        name: el.name.value.trim(), place: el.place.value.trim(), text: el.text.value.trim(),
        website: el.website.value, elapsedMs: Date.now() - startedAt,
      }) })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.ok) throw new Error(res.error);
          form.hidden = true; $('[data-review-done]').hidden = false;
        })
        .catch(function (ex) {
          btn.disabled = false; btn.textContent = 'রিভিউ পাঠান';
          err.textContent = ex && ex.message && !/fetch|network|JSON/i.test(ex.message) ? ex.message : 'নেটওয়ার্ক সমস্যা, আবার চেষ্টা করুন।';
          err.hidden = false;
        });
    });
  }

  /* ======================================================================
     THANK YOU
     ====================================================================== */
  function initThanks() {
    var params = new URLSearchParams(location.search);
    var id = (params.get('id') || '').replace(/[^A-Z0-9-]/gi, '').slice(0, 20);
    var value = Number(params.get('value')) || 0;
    $('[data-order-id]').textContent = id || '—';

    var last = null;
    try { last = JSON.parse(ssGet('lastOrder')); } catch (e) {}
    if (last && last.id === id) {
      $('[data-thanks-summary]').hidden = false;
      $('[data-thanks-summary]').innerHTML =
        '<div class="summary-row"><span>' + T('ty.product') + '</span><span>' + esc(last.name) + ' × ' + toBn(last.qty) + '</span></div>' +
        '<div class="summary-row"><span>' + T('ty.total') + '</span><span>' + taka(last.total) + '</span></div>' +
        (last.discount ? '<div class="summary-row"><span>' + T('co.discount', { pct: toBn((C.qtyDiscount || {}).percent || ''), n: toBn((C.qtyDiscount || {}).minQty || '') }) + '</span><span class="free">− ' + taka(last.discount) + '</span></div>' : '') +
        (last.advance ? '<div class="summary-row"><span>' + T('co.advance') + '</span><span>− ' + taka(last.advance) + '</span></div>' : '') +
        '<div class="summary-row"><span>' + T('ty.delivery') + '</span><span class="free">' + T('co.free') + '</span></div>' +
        '<div class="summary-row total"><span>' + T('co.due') + '</span><span>' + taka(last.due) + '</span></div>';
    }

    var waText = T('ty.waText', { id: id });
    $$('[data-wa-order]').forEach(function (el) { el.href = waLink(waText); el.target = '_blank'; el.rel = 'noopener'; });

    // Purchase fires once per order: refresh/back-forward must not re-fire it
    var key = 'purchase_fired_' + id;
    var fired = ssGet(key);
    try { fired = fired || localStorage.getItem(key); } catch (e) {}
    if (id && value > 0 && !fired) {
      track('Purchase', {
        value: value, currency: 'BDT',
        content_ids: last && last.id === id ? [last.productId] : [],
        content_type: 'product', num_items: last && last.id === id ? last.qty : 1,
      }, { eventID: id });   // eventID lets you dedupe against a future Conversions API setup
      ssSet(key, '1');
      try { localStorage.setItem(key, '1'); } catch (e) {}
    }
  }

  /* ---------- Boot ---------- */
  initPixel();
  fillShared();
  if (page === 'landing') initLanding();
  if (page === 'checkout') initCheckout();
  if (page === 'thanks') initThanks();
  if (page === 'review') initReview();
  /* Hidden shortcut: tap the header logo 4 times quickly to open the admin dashboard.
     The dashboard still needs the password; this only saves typing the address. */
  (function () {
    var logo = document.querySelector('header .logo');
    if (!logo) return;
    var taps = 0, timer = null;
    logo.addEventListener('click', function (e) {
      var href = logo.getAttribute('href') || '#';
      e.preventDefault();
      taps++; clearTimeout(timer);
      if (taps >= 4) { taps = 0; location.href = 'admin.html'; return; }
      if (href === '#') {                       // home page: logo scrolls to top, no wait needed
        if (taps === 1) window.scrollTo({ top: 0, behavior: 'smooth' });
        timer = setTimeout(function () { taps = 0; }, 700);
      } else {                                  // other pages: go home unless more taps follow
        timer = setTimeout(function () { taps = 0; location.href = href; }, 450);
      }
    });
  })();

  initReveal();
  initCounters();
  initSliders();

  // Exposed for the test harness / console debugging only
  window.__shop = { taka: taka, normalizePhone: normalizePhone, DISTRICTS: DISTRICTS };
})();
