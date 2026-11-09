/* Bakaina home page: product grid, featured product and reviews, all from config.js (window.WL). */
(function () {
  'use strict';
  var W = window.WL || {};
  var L = window.I18N, T = L.t, P = L.pick;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var money = function (n) { return (W.currency || '৳') + L.num(Number(n).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')); };
  document.documentElement.classList.add('js');

  /* ---------- Meta Pixel (page view only) ---------- */
  if (W.pixelId) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    fbq('init', W.pixelId); fbq('track', 'PageView');
  }

  /* ---------- Shared bits ---------- */
  if (W.announcement) $('[data-announce]').textContent = P(W, 'announcement');
  $$('[data-year]').forEach(function (el) { el.textContent = L.num(new Date().getFullYear()); });
  $$('[data-phone]').forEach(function (el) { el.textContent = L.num(W.phone || ''); });
  $$('[data-tel]').forEach(function (el) { el.href = 'tel:' + (W.phone || ''); });
  $$('[data-wa]').forEach(function (el) {
    el.href = 'https://wa.me/' + (W.whatsapp || '') + '?text=' + encodeURIComponent(T('wa.hello'));
    el.target = '_blank'; el.rel = 'noopener';
  });
  if (W.email) $$('[data-email]').forEach(function (a) { a.href = 'mailto:' + W.email; var sp = $('[data-email-text]', a); if (sp) sp.textContent = W.email; });

  /* ---------- Products ---------- */
  function priceOf(item) {
    return item.usePagePrice ? { now: W.price, was: W.oldPrice } : { now: item.price, was: item.oldPrice };
  }
  function priceHtml(item) {
    var p = priceOf(item);
    if (!(p.now > 0)) return '';
    var off = p.was > p.now ? Math.round((p.was - p.now) / p.was * 100) : 0;
    return (off ? '<s>' + money(p.was) + '</s> ' : '') + '<strong>' + money(p.now) + '</strong>' +
      (off ? ' <span class="hm-off">' + esc(T('p.badge', { pct: L.num(off) })) + '</span>' : '');
  }
  var catalog = (W.catalog || []).filter(function (c) { return c && c.name && c.url; });
  $('[data-catalog]').innerHTML = catalog.map(function (c) {
    return '<a class="hm-card" role="listitem" href="' + esc(c.url) + '" data-product="' + esc(c.id) + '">' +
      '<span class="hm-card-img">' + (c.tag ? '<span class="hm-tag">' + esc(P(c, 'tag')) + '</span>' : '') +
        '<img src="' + esc(c.image) + '" alt="' + esc(P(c, 'name')) + '" loading="lazy" decoding="async"></span>' +
      '<span class="hm-card-body"><strong class="hm-card-name">' + esc(P(c, 'name')) + '</strong>' +
        (c.blurb ? '<span class="hm-card-blurb">' + esc(P(c, 'blurb')) + '</span>' : '') +
        '<span class="hm-price">' + priceHtml(c) + '</span>' +
        '<span class="btn btn-primary hm-card-btn">' + esc(T('h.order')) + '</span></span></a>';
  }).join('') + (catalog.length < 3
    ? '<div class="hm-card hm-soon" role="listitem"><span class="hm-soon-icon" aria-hidden="true">+</span><strong>' + esc(T('h.soon')) + '</strong><span>' + esc(T('h.soonSub')) + '</span>' +
      '<a class="btn btn-outline" href="https://wa.me/' + esc(W.whatsapp || '') + '?text=' + encodeURIComponent(T('wa.hello')) + '" target="_blank" rel="noopener">WhatsApp</a></div>'
    : '');

  /* Featured product in the hero = the first product in the list */
  var f = catalog[0];
  if (f) {
    $('[data-feature]').href = f.url;
    $('[data-feature-img]').src = f.image;
    $('[data-feature-img]').alt = P(f, 'name');
    $('[data-feature-name]').textContent = P(f, 'name');
    $('[data-feature-price]').innerHTML = priceHtml(f);
  } else $('[data-feature]').hidden = true;

  /* ---------- Reviews: real ones from config.js, shown with the product they are about ---------- */
  var reviews = (W.reviews || []).filter(function (r) { return r && r.name && r.text; }).slice(0, 3);
  if (!reviews.length) $('[data-reviews-wrap]').hidden = true;
  $('[data-reviews]').innerHTML = reviews.map(function (r) {
    var n = Math.max(1, Math.min(5, Math.round(r.rating || 5)));
    return '<figure class="hm-review"><div class="stars" aria-label="' + esc(T('rev.stars', { n: L.num(n) })) + '">' + '★'.repeat(n) + '</div>' +
      '<blockquote>' + esc(P(r, 'text')) + '</blockquote>' +
      '<figcaption><strong>' + esc(r.name) + '</strong> · ' + esc(T('h.reviewOf')) + '</figcaption></figure>';
  }).join('');

  /* ---------- Mobile menu ---------- */
  var menuBtn = $('[data-menu]'), nav = $('.nav');
  menuBtn.addEventListener('click', function () { var open = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', open); });
  $$('.nav a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }); });

  /* Hidden shortcut: tap-tap, pause, tap-tap on the logo opens the admin dashboard (same as the other pages). */
  (function () {
    var logo = document.querySelector('header .logo');
    if (!logo) return;
    var QUICK = 450, PAUSE_MIN = 600, PAUSE_MAX = 2000, times = [], timer = null;
    logo.addEventListener('click', function (e) {
      e.preventDefault(); clearTimeout(timer);
      times.push(Date.now()); if (times.length > 4) times.shift();
      if (times.length === 4) {
        var a = times, g1 = a[1] - a[0], g2 = a[2] - a[1], g3 = a[3] - a[2];
        if (g1 <= QUICK && g2 >= PAUSE_MIN && g2 <= PAUSE_MAX && g3 <= QUICK) { times = []; location.href = 'admin.html'; return; }
      }
      if (times.length === 1) window.scrollTo({ top: 0, behavior: 'smooth' });
      timer = setTimeout(function () { times = []; }, times.length === 1 ? QUICK : PAUSE_MAX);
    });
  })();
})();
