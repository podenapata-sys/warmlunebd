/* WarmLune product page logic. All content comes from config.js (window.WL). */
(function () {
  'use strict';
  var W = window.WL || {};
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var BN = '০১২৩৪৫৬৭৮৯';
  var toBn = function (s) { return String(s).replace(/\d/g, function (d) { return BN[d]; }); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var money = function (n) { if (!(Number(n) > 0)) return (W.currency || '৳') + '[দাম]'; return (W.currency || '$') + toBn(Number(n).toFixed(W.currency === '৳' ? 0 : 2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')); };
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  document.documentElement.classList.add('js');

  var state = { color: 0, qty: 1, slide: 0 };

  /* ---------- Meta Pixel ---------- */
  if (W.pixelId) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    fbq('init', W.pixelId); fbq('track', 'PageView');
    fbq('track', 'ViewContent', { content_ids: ['pad-pink'], content_name: 'WarmLune হিটিং প্যাড', content_type: 'product', value: W.price || 0, currency: 'BDT' });
  }

  /* ---------- Toast ---------- */
  var tTimer;
  function toast(msg) {
    var t = $('[data-toast]'); t.textContent = msg; t.hidden = false;
    clearTimeout(tTimer); tTimer = setTimeout(function () { t.hidden = true; }, 2200);
  }

  /* ---------- Static values from config ---------- */
  if (W.announcement) $('[data-announce]').textContent = W.announcement;
  if (W.saleBadge) $('[data-sale-badge]').textContent = W.saleBadge; else $('[data-sale-badge]').hidden = true;
  $('[data-price]').textContent = money(W.price);
  if (W.price > 0 && W.oldPrice > W.price) $('[data-old-price]').textContent = money(W.oldPrice); else $('[data-old-price]').hidden = true;
  if (W.rating && W.reviewCount) $('[data-rating-text]').textContent = toBn(W.rating) + ' — ' + toBn(W.reviewCount) + 'টি যাচাইকৃত রিভিউ';
  $$('[data-year]').forEach(function (el) { el.textContent = toBn(new Date().getFullYear()); });
  if (W.email && W.email.indexOf('@') > 0) $$('[data-email]').forEach(function (a) { a.href = 'mailto:' + W.email; a.textContent = 'যোগাযোগ: ' + W.email; });

  // Fill a placeholder box with a real image when one is configured
  function fillPh(box, src, alt) {
    if (!box || !src) return;
    box.classList.add('has-img');
    box.innerHTML = '<img src="' + esc(src) + '" alt="' + esc(alt || '') + '" loading="lazy" decoding="async">';
  }
  fillPh($('[data-lifestyle]'), W.lifestyleImage, 'WarmLune প্যাড পরে আরাম করছেন');
  (W.featureImages || []).forEach(function (src, i) { fillPh($('[data-feature="' + i + '"]'), src, $('[data-feature="' + i + '"] span') && $('[data-feature="' + i + '"] span').textContent); });

  /* ---------- Gallery (swipe on phones, arrows, thumbnails) ---------- */
  var gallery = W.gallery || [];
  var track = $('[data-track]'), thumbs = $('[data-thumbs]');
  track.innerHTML = gallery.map(function (g, i) {
    return '<div class="gallery-slide" role="group" aria-label="ছবি ' + toBn(i + 1) + ': ' + esc(g.label) + '">' +
      (g.src ? '<div class="ph has-img"><img src="' + esc(g.src) + '" alt="' + esc(g.label) + '"' + (i ? ' loading="lazy"' : '') + '></div>'
             : '<div class="ph"><span class="ph-icon" aria-hidden="true"></span><strong>' + esc(g.label === 'প্রোডাক্ট' ? 'বক্সে যা আছে ছবি' : g.label + ' ছবি') + '</strong><span>' + esc(g.hint) + '</span></div>') +
      '</div>';
  }).join('');
  thumbs.innerHTML = gallery.map(function (g, i) {
    return '<button type="button" role="tab" aria-label="' + esc(g.label) + '">' + (g.src ? '<img src="' + esc(g.src) + '" alt="">' : esc(g.label)) + '</button>';
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
    return '<button type="button" role="radio" aria-checked="' + (i === 0) + '" aria-label="' + esc(c.name) + '" title="' + esc(c.name) + '" style="background:' + esc(c.hex) + '"></button>';
  }).join('');
  $$('button', sw).forEach(function (b, i) {
    b.addEventListener('click', function () {
      state.color = i;
      $$('button', sw).forEach(function (x, j) { x.setAttribute('aria-checked', j === i); });
      $('[data-color-name]').textContent = colors[i].name;
    });
  });
  if (colors[0]) $('[data-color-name]').textContent = colors[0].name;

  $$('[data-qty]').forEach(function (b) {
    b.addEventListener('click', function () {
      state.qty = Math.max(1, Math.min(10, state.qty + Number(b.getAttribute('data-qty'))));
      $('[data-qty-val]').textContent = toBn(state.qty);
    });
  });

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
    if (window.fbq) fbq('track', 'AddToCart', { content_ids: ['pad-' + COLOR_IDS[c.idx]], value: (W.price || 0) * c.qty, currency: 'BDT' });
    toast('কার্টে যোগ হয়েছে');
  });
  $$('[data-buy]').forEach(function (b) { b.addEventListener('click', function () { location.href = checkoutUrl(state.color, state.qty); }); });
  $('[data-cart]').addEventListener('click', function () {
    if (!cart.length) { toast('কার্ট খালি'); return; }
    var last = cart[cart.length - 1];
    if (cart.length > 1) toast('একবারে একটি রং — বাকিগুলো পরের অর্ডারে বা WhatsApp-এ');
    setTimeout(function () { location.href = checkoutUrl(last.idx, last.qty); }, cart.length > 1 ? 900 : 0);
  });
  renderCart();

  /* ---------- Header: language toggle + mobile menu ---------- */
  $$('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('[data-lang]').forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); });
      if (b.getAttribute('data-lang') === 'en') toast('English version coming soon');
    });
  });
  var menuBtn = $('[data-menu]'), nav = $('.nav');
  menuBtn.addEventListener('click', function () { var open = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', open); });
  $$('.nav a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }); });

  /* ---------- Stats band ---------- */
  $('[data-stats]').innerHTML = (W.stats || []).map(function (s) {
    return '<div class="reveal"><div class="val">' + esc(s.value) + '</div><div class="lbl">' + esc(s.label) + '</div></div>';
  }).join('');

  /* ---------- Reviews: real ones from config, else the design's placeholder cards ---------- */
  var reviews = (W.reviews || []).filter(function (r) { return r && r.name && r.text; });
  var stars = function (n) { n = Math.max(1, Math.min(5, Math.round(n || 5))); return '<span class="stars" aria-label="' + toBn(n) + ' স্টার">' + '★'.repeat(n) + '</span>'; };
  var card = function (r, photo, placeholder) {
    return '<article class="rcard reveal' + (placeholder ? ' placeholder' : '') + '">' +
      (photo ? (r.photo ? '<img src="' + esc(r.photo) + '" alt="' + esc(r.name) + '-এর ছবি" loading="lazy">' : '<div class="ph"><span>ক্রেতার ছবি</span></div>') : '') +
      '<div class="who"><span class="name">' + esc(r.name) + '</span><span class="chip">যাচাইকৃত ক্রেতা</span></div>' +
      stars(r.rating) + '<p>' + esc(r.text) + '</p></article>';
  };
  if (reviews.length) {
    $('[data-reviews-sub]').textContent = 'যাচাইকৃত ক্রেতাদের আসল অভিজ্ঞতা।';
    $('[data-reviews]').innerHTML = reviews.map(function (r) { return card(r, !!r.photo, false); }).join('');
  } else {
    // Mockup layout: 6 placeholder cards, photos on cards 1, 3 and 5. Clearly marked as placeholders.
    var ph = { name: '[ক্রেতার নাম]', rating: 5, text: '[এখানে আসল ক্রেতার রিভিউ দিন — ভালো হয় যদি তাতে সমস্যা আর ফলাফল দুটোই উল্লেখ থাকে।]' };
    $('[data-reviews]').innerHTML = [true, false, false, true, true, false].map(function (photo) { return card(ph, photo, true); }).join('');
  }

  /* ---------- Newsletter (stores locally until you connect an email tool) ---------- */
  $('[data-news]').addEventListener('submit', function (e) {
    e.preventDefault();
    var input = e.target.email, msg = $('[data-news-msg]');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) { msg.textContent = 'সঠিক ইমেইল দিন।'; msg.hidden = false; input.focus(); return; }
    var list = []; try { list = JSON.parse(store.get('wl-news')) || []; } catch (x) {}
    list.push(input.value.trim()); store.set('wl-news', JSON.stringify(list));
    msg.textContent = 'ধন্যবাদ! সাবস্ক্রাইব সম্পন্ন হয়েছে।'; msg.hidden = false; e.target.reset();
  });

  /* ---------- Fade-up reveal ---------- */
  var els = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) els.forEach(function (el) { el.classList.add('in'); });
  else {
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () { els.forEach(function (el) { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in'); }); }, 2500);
  }
})();
