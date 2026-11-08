/* Bakaina product page logic. All content comes from config.js (window.WL). */
(function () {
  'use strict';
  var W = window.WL || {};
  var L = window.I18N, T = L.t, P = L.pick;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var BN = '০১২৩৪৫৬৭৮৯';
  var toBn = function (s) { return L.num(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var money = function (n) { if (!(Number(n) > 0)) return (W.currency || '৳') + T('p.price'); return (W.currency || '$') + toBn(Number(n).toFixed(W.currency === '৳' ? 0 : 2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')); };
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  document.documentElement.classList.add('js');

  var state = { color: 0, qty: 1, slide: 0 };

  /* ---------- Meta Pixel ---------- */
  if (W.pixelId) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    fbq('init', W.pixelId); fbq('track', 'PageView');
    fbq('track', 'ViewContent', { content_ids: ['pad-pink'], content_name: 'Bakaina Cordless Heating & Massage Belt', content_type: 'product', value: W.price || 0, currency: 'BDT' });
  }

  /* ---------- Toast ---------- */
  var tTimer;
  function toast(msg) {
    var t = $('[data-toast]'); t.textContent = msg; t.hidden = false;
    clearTimeout(tTimer); tTimer = setTimeout(function () { t.hidden = true; }, 2200);
  }

  /* ---------- Static values from config ---------- */
  if (W.announcement) $('[data-announce]').textContent = P(W, 'announcement');
  // Price framing: monthly equivalent (price ÷ 12, rounded) and a short "why this price"
  if (W.showPerMonth && W.price > 0) {
    var pm = $('[data-per-month]');
    pm.textContent = T('p.perMonth', { amt: money(Math.round(W.price / 12)) });
    pm.hidden = false;
  }
  if (W.showWhyPrice) $('[data-why-price]').hidden = false;

  // Sale badge + "সেল" tag only when there is a real previous price to compare with
  var onSale = W.price > 0 && W.oldPrice > W.price;
  if (onSale) {
    var pctOff = T('p.badge', { pct: toBn(Math.round((W.oldPrice - W.price) / W.oldPrice * 100)) });
    $('[data-sale-badge]').textContent = pctOff;
    $$('.price-row .sale').forEach(function (el) { el.textContent = pctOff; });   // "১৫% ছাড়" next to the price
  }
  else $('[data-sale-badge]').hidden = true;
  if (!onSale) $$('.sale').forEach(function (el) { el.hidden = true; });
  $('[data-price]').textContent = money(W.price);
  if (W.price > 0 && W.oldPrice > W.price) $('[data-old-price]').textContent = money(W.oldPrice); else $('[data-old-price]').hidden = true;
  if (W.rating && W.reviewCount) $('[data-rating-text]').textContent = T('rating.text', { r: toBn(W.rating), n: toBn(W.reviewCount) });
  else $('[data-rating-text]').textContent = T('rating.placeholder');
  $$('[data-year]').forEach(function (el) { el.textContent = toBn(new Date().getFullYear()); });
  if (W.email && W.email.indexOf('@') > 0) $$('[data-email]').forEach(function (a) { a.href = 'mailto:' + W.email; var sp = $('[data-email-text]', a); if (sp) { sp.removeAttribute('data-i18n'); sp.textContent = W.email; } });

  // Fill a placeholder box with a real image when one is configured
  function fillPh(box, src, alt) {
    if (!box || !src) return;
    box.classList.add('has-img');
    box.innerHTML = '<img src="' + esc(src) + '" alt="' + esc(alt || '') + '" loading="lazy" decoding="async">';
  }
  fillPh($('[data-lifestyle]'), W.lifestyleImage, T('life.ph'));
  (W.featureImages || []).forEach(function (src, i) { fillPh($('[data-feature="' + i + '"]'), src, $('[data-feature="' + i + '"] span') && $('[data-feature="' + i + '"] span').textContent); });

  /* ---------- Gallery (swipe on phones, arrows, thumbnails) ---------- */
  var gallery = W.gallery || [];
  var track = $('[data-track]'), thumbs = $('[data-thumbs]');
  track.innerHTML = gallery.map(function (g, i) {
    var label = P(g, 'label');
    return '<div class="gallery-slide" role="group" aria-label="' + esc(T('g.photo', { n: toBn(i + 1) })) + ': ' + esc(label) + '">' +
      (g.src ? '<div class="ph has-img"><img src="' + esc(g.src) + '" alt="' + esc(label) + '"' + (i ? ' loading="lazy"' : '') + '></div>'
             : '<div class="ph"><span class="ph-icon" aria-hidden="true"></span><strong>' + esc(i === 0 ? T('g.boxPhoto') : T('g.photoOf', { label: label })) + '</strong><span>' + esc(P(g, 'hint')) + '</span></div>') +
      '</div>';
  }).join('');
  thumbs.innerHTML = gallery.map(function (g, i) {
    var label = P(g, 'label');
    return '<button type="button" role="tab" aria-label="' + esc(label) + '">' + (g.src ? '<img src="' + esc(g.src) + '" alt="">' : esc(label)) + '</button>';
  }).join('');
  function goSlide(i) {
    i = (i + gallery.length) % gallery.length;
    track.scrollTo({ left: track.clientWidth * i, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  function syncSlide() {
    var i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
    state.slide = i;
    $$('button', thumbs).forEach(function (b, j) { b.classList.toggle('on', j === i); b.setAttribute('aria-selected', j === i); });
  }
  $$('button', thumbs).forEach(function (b, i) { b.addEventListener('click', function () { goSlide(i); }); });
  $('[data-prev]').addEventListener('click', function () { goSlide(state.slide - 1); });
  $('[data-next]').addEventListener('click', function () { goSlide(state.slide + 1); });
  track.addEventListener('scroll', function () { requestAnimationFrame(syncSlide); }, { passive: true });
  track.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') goSlide(state.slide + 1); if (e.key === 'ArrowLeft') goSlide(state.slide - 1); });
  // Design shows the last thumbnail ("বক্সে যা আছে") selected while the first slide is up;
  // we keep thumbnails in sync with the visible slide instead, which is clearer for buyers.
  syncSlide();

  /* ---------- Colour + quantity ---------- */
  var colors = W.colors || [];
  var sw = $('[data-swatches]');
  sw.innerHTML = colors.map(function (c, i) {
    return '<button type="button" role="radio" aria-checked="' + (i === 0) + '" aria-label="' + esc(P(c, 'name')) + '" title="' + esc(P(c, 'name')) + '" style="background:' + esc(c.hex) + '"></button>';
  }).join('');
  $$('button', sw).forEach(function (b, i) {
    b.addEventListener('click', function () {
      state.color = i;
      $$('button', sw).forEach(function (x, j) { x.setAttribute('aria-checked', j === i); });
      $('[data-color-name]').textContent = P(colors[i], 'name');
    });
  });
  if (colors[0]) $('[data-color-name]').textContent = P(colors[0], 'name');

  /* Quantity discount (config.js → qtyDiscount; the server applies the same rule) */
  var QD = W.qtyDiscount || {};
  var qdOn = QD.percent > 0 && QD.minQty > 1 && W.price > 0;
  function priceFor(qty) {
    var sub = W.price * qty;
    var disc = qdOn && qty >= QD.minQty ? Math.round(sub * QD.percent / 100) : 0;
    return { sub: sub, disc: disc, total: sub - disc };
  }
  /* Bundle cards (1 / 2 / 3 pieces). Crossed-out price = pieces × the real old price, same rule as the price row. */
  var bundles = (W.bundles && W.bundles.length ? W.bundles : [1, 2, 3]).filter(function (n) { return n >= 1 && n <= 10; });
  var bundleBox = $('[data-bundle]'), bundleList = $('[data-bundle-list]');
  state.qty = bundles.indexOf(W.bundleDefault) > -1 ? W.bundleDefault : bundles[0];
  if (!(W.price > 0)) { bundleBox.hidden = true; state.qty = 1; }
  else {
    bundleList.innerHTML = bundles.map(function (n) {
      var p = priceFor(n), was = W.oldPrice > W.price ? W.oldPrice * n : (p.disc ? p.sub : 0);
      var sub = p.disc ? T('b.each', { amt: money(Math.round(p.total / n)), pct: toBn(QD.percent) }) : (n === 1 ? T('b.std') : '');
      return '<label class="bopt" data-n="' + n + '"><input type="radio" name="bundle" value="' + n + '"' + (n === state.qty ? ' checked' : '') + '>' +
        '<span class="bopt-q"><strong>' + esc(n === 1 ? T('b.qty1') : T('b.qtyN', { n: toBn(n) })) + '</strong>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span>' +
        '<span class="bopt-p"><strong>' + money(p.total) + '</strong>' + (was > p.total ? '<s>' + money(was) + '</s>' : '') + '</span></label>';
    }).join('');
    bundleList.addEventListener('change', function (e) { if (e.target.name === 'bundle') { state.qty = Number(e.target.value); renderQty(); } });
  }
  function renderQty() {
    $$('.bopt').forEach(function (l) { l.classList.toggle('on', Number(l.getAttribute('data-n')) === state.qty); });
    if (!(W.price > 0)) return;
    var total = money(priceFor(state.qty).total);
    $('[data-bundle-total]').textContent = total;
    $('[data-sb-total]').textContent = total;
    $('[data-sb-items]').textContent = T('sb.items', { n: toBn(state.qty) });
  }
  renderQty();

  /* Sticky buy bar: shows whenever the main order buttons are off screen */
  var sticky = $('[data-sticky]'), mainBuy = $('.info [data-buy]');
  if (sticky && mainBuy && W.price > 0 && 'IntersectionObserver' in window) {
    if (gallery[0] && gallery[0].src) $('[data-sb-img]').src = gallery[0].src;
    new IntersectionObserver(function (en) {
      var show = !en[0].isIntersecting;
      sticky.hidden = !show;
      document.body.classList.toggle('has-sticky', show);
    }).observe(mainBuy);
  }

  /* ---------- Cart + buy (WhatsApp order) ---------- */
  var cart = []; try { cart = JSON.parse(store.get('wl-cart')) || []; } catch (e) {}
  function renderCart() {
    var n = cart.reduce(function (s, x) { return s + x.qty; }, 0);
    $('[data-cart-count]').textContent = toBn(n);
  }
  // Checkout handles one colour per order; colour IDs match config.js → CONFIG.products
  var COLOR_IDS = ['pink', 'white', 'lavender'];
  function checkoutUrl(colorIndex, qty) {
    return 'checkout.html?product=pad-' + (COLOR_IDS[colorIndex] || COLOR_IDS[0]) + '&qty=' + qty;
  }
  var current = function () { return { color: (colors[state.color] || {}).name || '', idx: state.color, qty: state.qty }; };
  $('[data-add]').addEventListener('click', function () {
    var c = current(), hit = cart.filter(function (x) { return x.idx === c.idx; })[0];
    if (hit) hit.qty = Math.min(10, hit.qty + c.qty); else cart.push(c);
    store.set('wl-cart', JSON.stringify(cart)); renderCart();
    if (window.fbq) fbq('track', 'AddToCart', { content_ids: ['pad-' + COLOR_IDS[c.idx]], value: W.price > 0 ? priceFor(c.qty).total : 0, currency: 'BDT' });
    toast(T('toast.added'));
  });
  $$('[data-buy]').forEach(function (b) { b.addEventListener('click', function () { location.href = checkoutUrl(state.color, state.qty); }); });
  $('[data-cart]').addEventListener('click', function () {
    if (!cart.length) { toast(T('toast.empty')); return; }
    var last = cart[cart.length - 1];
    if (cart.length > 1) toast(T('toast.oneColor'));
    setTimeout(function () { location.href = checkoutUrl(last.idx, last.qty); }, cart.length > 1 ? 900 : 0);
  });
  renderCart();

  /* ---------- Header: language toggle + mobile menu ---------- */
  // Language toggle buttons are handled by i18n.js
  var menuBtn = $('[data-menu]'), nav = $('.nav');
  menuBtn.addEventListener('click', function () { var open = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', open); });
  $$('.nav a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }); });

  /* ---------- Stats band ---------- */
  $('[data-stats]').innerHTML = (W.stats || []).map(function (s) {
    return '<div class="reveal"><div class="val">' + esc(P(s, 'value')) + '</div><div class="lbl">' + esc(P(s, 'label')) + '</div></div>';
  }).join('');

  /* ---------- Reviews: real ones from config, else the design's placeholder cards ---------- */
  var reviews = (W.reviews || []).filter(function (r) { return r && r.name && r.text; });
  var stars = function (n) { n = Math.max(1, Math.min(5, Math.round(n || 5))); return '<span class="stars" aria-label="' + esc(T('rev.stars', { n: toBn(n) })) + '">' + '★'.repeat(n) + '</span>'; };
  var card = function (r, photo, placeholder) {
    return '<article class="rcard reveal' + (placeholder ? ' placeholder' : '') + '">' +
      (photo ? (r.photo ? '<img src="' + esc(r.photo) + '" alt="' + esc(T('rev.photoOf', { name: r.name })) + '" loading="lazy">' : '<div class="ph"><span>' + esc(T('rev.photo')) + '</span></div>') : '') +
      '<div class="who"><span class="name">' + esc(r.name) + '</span><span class="chip">' + esc(T('rev.chip')) + '</span></div>' +
      stars(r.rating) + '<p>' + esc(P(r, 'text')) + '</p></article>';
  };
  if (reviews.length) {
    $('[data-reviews-sub]').textContent = T('rev.subReal');
    $('[data-reviews]').innerHTML = reviews.map(function (r) { return card(r, !!r.photo, false); }).join('');
  } else {
    // Mockup layout: 6 placeholder cards, photos on cards 1, 3 and 5. Clearly marked as placeholders.
    $('[data-reviews-sub]').textContent = T('rev.subPh');
    var ph = { name: T('rev.phName'), rating: 5, text: T('rev.phText') };
    $('[data-reviews]').innerHTML = [true, false, false, true, true, false].map(function (photo) { return card(ph, photo, true); }).join('');
  }

  /* ---------- Newsletter (stores locally until you connect an email tool) ---------- */
  $('[data-news]').addEventListener('submit', function (e) {
    e.preventDefault();
    var input = e.target.email, msg = $('[data-news-msg]');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) { msg.textContent = T('news.bad'); msg.hidden = false; input.focus(); return; }
    var list = []; try { list = JSON.parse(store.get('wl-news')) || []; } catch (x) {}
    list.push(input.value.trim()); store.set('wl-news', JSON.stringify(list));
    msg.textContent = T('news.ok'); msg.hidden = false; e.target.reset();
  });

  /* ---------- Scroll-expansion showcase ----------
     A tall section with a sticky stage: as the page scrolls through it, the media card
     grows from a small card to (almost) full screen, the background fades and the two
     title words slide apart. It only READS the scroll position — it never blocks or
     redirects scrolling, so visitors can always keep moving towards "Buy now". */
  (function initExpand() {
    var sec = $('[data-expand]');
    if (!sec) return;
    var media = $('[data-expand-media]', sec), bg = $('[data-expand-bg]', sec);
    var left = $('[data-expand-left]', sec), right = $('[data-expand-right]', sec), hint = $('[data-expand-hint]', sec);
    var sc = W.showcase || {};
    if (sc.src && sc.type === 'image') {
      media.innerHTML = '<img src="' + esc(sc.src) + '" alt="' + esc(T('p.title')) + '" loading="lazy" decoding="async">';
    } else if (sc.src) {
      // Muted + playsinline so phones autoplay it; only loads when near the screen
      // WebM (VP9) first where available, MP4 (H.264) for every other browser
      media.innerHTML = '<video muted loop playsinline preload="none"' + (sc.poster ? ' poster="' + esc(sc.poster) + '"' : '') + '>' +
        (sc.srcWebm ? '<source data-src="' + esc(sc.srcWebm) + '" type="video/webm">' : '') +
        '<source data-src="' + esc(sc.src) + '" type="video/mp4"></video>';
    } else {
      media.innerHTML = '<div class="expand-ph"><span class="ph-icon" aria-hidden="true"></span><strong>' + esc(T('exp.ph')) + '</strong><small>' + esc(T('exp.phSub')) + '</small></div>';
    }
    var video = $('video', media);

    var lerp = function (a, b, t) { return a + (b - a) * t; };
    var ease = function (t) { return 1 - Math.pow(1 - t, 3); };   // ease-out cubic
    var ticking = false;

    function frame() {
      ticking = false;
      var vw = innerWidth, vh = innerHeight, mobile = vw < 768;
      var r = sec.getBoundingClientRect();
      var travel = Math.max(1, sec.offsetHeight - vh);
      var p = Math.min(1, Math.max(0, -r.top / travel));
      if (reduceMotion) p = 1;
      var e = ease(p);
      var w0 = mobile ? Math.min(240, vw * 0.62) : 300, h0 = mobile ? 320 : 400;
      var w1 = vw * (mobile ? 0.94 : 0.92), h1 = vh * (mobile ? 0.72 : 0.82);
      media.style.width = lerp(w0, w1, e) + 'px';
      media.style.height = lerp(h0, h1, e) + 'px';
      media.style.borderRadius = lerp(24, 16, e) + 'px';
      bg.style.opacity = String(1 - e * 0.85);
      var shift = e * (mobile ? 46 : 32);                          // vw each title word travels
      left.style.transform = 'translateX(' + (-shift) + 'vw)';
      right.style.transform = 'translateX(' + shift + 'vw)';
      left.style.opacity = right.style.opacity = String(1 - Math.max(0, (p - 0.55) / 0.45));
      hint.style.opacity = String(Math.max(0, 1 - p * 4));
      sec.classList.toggle('is-full', p > 0.98);
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    frame();

    // Load / play the video only while the section is on screen (saves mobile data)
    if (video && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        en.forEach(function (x) {
          if (x.isIntersecting) {
            if (!video.dataset.loaded) {
              $$('source', video).forEach(function (s) { s.src = s.getAttribute('data-src'); });
              video.dataset.loaded = '1';
              video.load();
            }
            if (!reduceMotion) { var pr = video.play(); if (pr && pr.catch) pr.catch(function () {}); }
          } else video.pause();
        });
      }, { rootMargin: '200px 0px' }).observe(sec);
    }
  })();

  /* ---------- Fade-up reveal ---------- */
  var els = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) els.forEach(function (el) { el.classList.add('in'); });
  else {
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () { els.forEach(function (el) { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in'); }); }, 2500);
  }
  /* Hidden shortcut: tap the header logo tap-tap, pause, tap-tap to open the admin dashboard.
     (Each pair within ~0.45 s, the pause 0.6–2 s.) The dashboard still needs the password. */
  (function () {
    var logo = document.querySelector('header .logo');
    if (!logo) return;
    var QUICK = 450, PAUSE_MIN = 600, PAUSE_MAX = 2000;
    var times = [], timer = null;
    function matches(t) {
      if (t.length < 4) return false;
      var a = t.slice(-4), g1 = a[1] - a[0], g2 = a[2] - a[1], g3 = a[3] - a[2];
      return g1 <= QUICK && g2 >= PAUSE_MIN && g2 <= PAUSE_MAX && g3 <= QUICK;
    }
    logo.addEventListener('click', function (e) {
      var href = logo.getAttribute('href') || '#', now = Date.now();
      e.preventDefault();
      clearTimeout(timer);
      times.push(now); if (times.length > 4) times.shift();
      if (matches(times)) { times = []; location.href = 'admin.html'; return; }
      var home = href === '#';
      if (home && times.length === 1) window.scrollTo({ top: 0, behavior: 'smooth' });
      // A lone tap acts normally right away; after 2+ taps wait to see if the pattern continues
      var wait = times.length === 1 ? QUICK : PAUSE_MAX;
      timer = setTimeout(function () { times = []; if (!home) location.href = href; }, wait);
    });
  })();
})();
