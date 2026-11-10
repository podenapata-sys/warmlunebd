/* Bakaina skincare product page: product.html?id=<shopProducts id>. Everything comes from config.js. */
(function () {
  'use strict';
  var W = window.WL || {};
  var L = window.I18N, T = L.t, P = L.pick;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var money = function (n) { return (W.currency || '৳') + L.num(Number(n).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')); };
  var en = L.lang === 'en';
  var pair = function (x) { return Array.isArray(x) ? (en && x[1] ? x[1] : x[0]) : x; };   // [bangla, english] → current language
  document.documentElement.classList.add('js');

  /* Shared bits (same as the home page) */
  if (W.announcement) $('[data-announce]').textContent = P(W, 'announcement');
  $$('[data-year]').forEach(function (el) { el.textContent = L.num(new Date().getFullYear()); });
  if (W.email) $$('[data-email]').forEach(function (a) { a.href = 'mailto:' + W.email; var sp = $('[data-email-text]', a); if (sp) sp.textContent = W.email; });
  var menuBtn = $('[data-menu]'), nav = $('.nav');
  menuBtn.addEventListener('click', function () { var open = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', open); });

  var id = new URLSearchParams(location.search).get('id');
  var p = (W.shopProducts || []).filter(function (x) { return x.id === id && !x.combo; })[0];
  if (!p || !(p.price > 0)) { $('[data-pp-missing]').hidden = false; return; }
  $('[data-pp]').hidden = false;

  var name = P(p, 'name');
  document.title = name + ' | Bakaina';

  /* Meta Pixel: page view + product view */
  if (W.pixelId) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    fbq('init', W.pixelId); fbq('track', 'PageView');
    fbq('track', 'ViewContent', { content_ids: [p.id], content_name: p.name_en || p.name, content_type: 'product', value: p.price, currency: 'BDT' });
  }

  $('[data-pp-img]').src = p.image; $('[data-pp-img]').alt = name;
  $('[data-pp-brand]').textContent = p.brand || '';
  $('[data-pp-name]').textContent = name;
  $('[data-pp-blurb]').textContent = P(p, 'blurb') || '';
  $('[data-pp-intro]').textContent = P(p, 'intro') || '';
  $('[data-pp-size]').textContent = p.size || '';
  // Benefits, ingredients and steps are written in config.js (trusted, may hold <strong>)
  $('[data-pp-benefits]').innerHTML = (p.benefits || []).map(function (b) { return '<li>' + pair(b) + '</li>'; }).join('');
  $('[data-pp-ingredients]').innerHTML = (p.ingredients || []).map(function (b) { return '<li>' + pair(b) + '</li>'; }).join('');
  $('[data-pp-how]').innerHTML = (p.howTo || []).map(function (b) { return '<li>' + esc(pair(b)) + '</li>'; }).join('');
  $('[data-pp-details]').textContent = pair(p.details) || '';
  $('[data-pp-price]').textContent = money(p.price);
  if (p.oldPrice > p.price) { $('[data-pp-old]').textContent = money(p.oldPrice); $('[data-pp-old]').hidden = false; }

  /* Quantity + total (no bulk discount on skincare) */
  var qty = 1;
  function render() {
    $('[data-pp-qty]').textContent = L.num(qty);
    $('[data-pp-minus]').disabled = qty <= 1;
    $('[data-pp-plus]').disabled = qty >= 10;
    $('[data-pp-total]').textContent = money(p.price * qty);
    $('[data-pp-buy]').href = 'checkout.html?product=' + encodeURIComponent(p.id) + '&qty=' + qty;
  }
  $('[data-pp-minus]').addEventListener('click', function () { if (qty > 1) { qty--; render(); } });
  $('[data-pp-plus]').addEventListener('click', function () { if (qty < 10) { qty++; render(); } });
  render();

  /* The gel mask page offers the belt + mask combo */
  var combo = (W.shopProducts || []).filter(function (x) { return x.combo; })[0];
  if (combo && p.id === 'medicube-gel-mask') {
    var c = $('[data-pp-combo]');
    c.hidden = false; c.href = combo.url || ('checkout.html?product=' + combo.id);
    $('[data-pp-combo-img]').src = combo.image;
    $('[data-pp-combo-text]').textContent = P(combo, 'blurb');
    $('[data-pp-combo-price]').innerHTML = (combo.oldPrice > combo.price ? '<s>' + money(combo.oldPrice) + '</s>' : '') + '<strong>' + money(combo.price) + '</strong>';
  }
})();
