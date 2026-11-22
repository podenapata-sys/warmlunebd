/* ==========================================================================
   Bakaina store — homepage (index.html) and product listing (products.html).
   Everything comes from config.js (window.WL: belt settings, shopProducts, store).
   ========================================================================== */
(function () {
  'use strict';
  var W = window.WL || {}, S = W.store || {};
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var money = function (n) { return '৳' + Number(n).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
  var store = {
    get: function (k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var page = document.body.getAttribute('data-page');   // 'home' | 'products'

  /* ---------- Icons (inline line icons) ---------- */
  var P = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    heart: '<path d="M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5C19 15.6 12 20 12 20Z"/>',
    bag: '<path d="M5 8h14l-1.2 12H6.2L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    left: '<path d="m15 5-7 7 7 7"/>', right: '<path d="m9 5 7 7-7 7"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    cart: '<path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2"/><circle cx="9" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    truck: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.1-2.4 3.6"/><path d="M12 17h.01"/>',
    phone: '<path d="M5 4h3l1.5 4-2 1.3a11 11 0 0 0 5.2 5.2L14 12.5l4 1.5v3a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
    whatsapp: '<path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/><path d="M9 9.5c.2 1.5 1.5 3.4 3.5 4.5l1.2-1 1.8.8c-.2 1-1 1.7-2 1.7-2.8 0-6-3.2-6-6 0-1 .7-1.8 1.7-2l.8 1.8z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V8z"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.2 6.8h.01"/>',
    youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9 5 3-5 3z"/>',
    tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 2.6 2.4 4.4 5 4.6"/>',
    // Category icons
    skincare: '<path d="M10 3h4v3h-4z"/><path d="M9 6h6l1 3v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V9z"/><path d="M8 12h8"/>',
    bodycare: '<path d="M8 8h8l1 2v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9z"/><path d="M10 8V5h4v3"/><path d="M14 5h3"/><path d="M10 14h4"/>',
    haircare: '<path d="M5 4v16"/><path d="M5 6h6M5 9h6M5 12h6M5 15h6M5 18h6"/><path d="M15 4c2 3 4 4.5 4 8a4 4 0 0 1-8 0c0-3.5 2-5 4-8z"/>',
    appliance: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><circle cx="12" cy="13" r="4"/><path d="M9 6.5h.01M12 6.5h3"/>',
    household: '<path d="M4 11 12 4l8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-5h4v5"/>',
  };
  function icon(n, cls) { return '<svg class="icon' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (P[n] || '') + '</svg>'; }

  /* ---------- Products: belt + shopProducts, plus category & tags from store.products ---------- */
  var meta = S.products || {};
  var beltReviews = (W.reviews || []).filter(function (r) { return r && r.rating; });
  var products = [];
  if (W.price > 0) products.push({
    id: 'belt', checkoutId: 'pad-pink', name: 'WarmLune™ Heating Belt',
    image: (W.gallery && W.gallery[0] && W.gallery[0].src) || '', price: W.price, oldPrice: W.oldPrice,
    url: 'heating-belt.html', reviewCount: beltReviews.length,
    rating: beltReviews.length ? beltReviews.reduce(function (s, r) { return s + r.rating; }, 0) / beltReviews.length : 0,
  });
  (W.shopProducts || []).forEach(function (p) {
    if (!(p.price > 0)) return;
    products.push({ id: p.id, checkoutId: p.id, name: p.name_en || p.name, image: p.image || '', price: p.price, oldPrice: p.oldPrice,
      url: p.url || ('product.html?id=' + encodeURIComponent(p.id)), reviewCount: 0, rating: 0, soldOut: !!p.soldOut, hasOptions: !!p.hasOptions });
  });
  products.forEach(function (p) {
    var m = meta[p.id] || {};
    p.category = m.category || ''; p.tags = m.tags || [];
    if (m.soldOut) p.soldOut = true;
    p.off = p.oldPrice > p.price ? Math.round((p.oldPrice - p.price) / p.oldPrice * 100) : 0;
  });
  var byId = function (id) { return products.filter(function (p) { return p.id === id; })[0]; };
  var cats = S.categories || [];
  var catName = function (id) { var c = cats.filter(function (x) { return x.id === id; })[0]; return c ? c.name : id; };
  var tones = ['peach', 'blue', 'pink', 'mint', 'yellow', 'lavender'];

  var wa = function (text) { return 'https://wa.me/' + (W.whatsapp || '') + (text ? '?text=' + encodeURIComponent(text) : ''); };
  var TRACK = wa('আসসালামু আলাইকুম, আমার অর্ডারের আপডেট জানতে চাই। অর্ডার নম্বর: ');
  var HELP = wa('আসসালামু আলাইকুম, আমি Bakaina-এর পণ্য সম্পর্কে জানতে চাই।');

  /* ---------- Cart & wishlist (this browser only) ---------- */
  var cart = store.get('bk-cart', []).filter(function (x) { return byId(x.id); });
  var wish = store.get('bk-wish', []).filter(function (id) { return byId(id); });
  function saveCart() { store.set('bk-cart', cart); renderCounts(); renderCart(); }
  function saveWish() { store.set('bk-wish', wish); renderCounts(); }
  function addToCart(id) {
    var hit = cart.filter(function (x) { return x.id === id; })[0];
    if (hit) hit.qty = Math.min(10, hit.qty + 1); else cart.push({ id: id, qty: 1 });
    saveCart(); toast('Added to cart ✓');
    if (window.fbq) { var p = byId(id); fbq('track', 'AddToCart', { content_ids: [p.checkoutId], content_type: 'product', value: p.price, currency: 'BDT' }); }
  }
  function toggleWish(id, btn) {
    var i = wish.indexOf(id);
    if (i > -1) wish.splice(i, 1); else wish.push(id);
    saveWish();
    $$('[data-heart="' + id + '"]').forEach(function (b) { b.setAttribute('aria-pressed', String(i === -1)); });
    toast(i === -1 ? 'Saved to your wishlist' : 'Removed from your wishlist');
    if (page === 'products' && view === 'wishlist') renderListing();
  }
  function cartCount() { return cart.reduce(function (s, x) { return s + x.qty; }, 0); }

  /* ---------- Product card ---------- */
  function media(p) {
    return p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async" width="600" height="600">'
      : '<span class="ph tone-' + tones[p.name.length % tones.length] + '">' + icon(cats.filter(function (c) { return c.id === p.category; })[0] ? cats.filter(function (c) { return c.id === p.category; })[0].icon : 'bag') + '</span>';
  }
  function stars(p) {
    if (!(p.reviewCount > 0)) return '';
    var n = Math.round(p.rating);
    return '<div class="rating"><span class="stars" aria-hidden="true">' + '★'.repeat(n) + '<span style="color:#ddd">' + '★'.repeat(5 - n) + '</span></span>' +
      '<span>' + p.rating.toFixed(1) + ' (' + p.reviewCount + ')</span><span class="sr-only">Rated ' + p.rating.toFixed(1) + ' out of 5 from ' + p.reviewCount + ' reviews</span></div>';
  }
  function action(p) {
    if (p.soldOut) return '<button class="btn btn-block is-disabled" type="button" disabled>Sold out</button>';
    if (p.hasOptions) return '<a class="choose" href="' + esc(p.url) + '">Choose options</a>';
    return '<button class="btn btn-orange btn-block" type="button" data-add="' + esc(p.id) + '">' + icon('cart') + 'Add to Cart</button>';
  }
  function card(p, horizontal) {
    var saved = wish.indexOf(p.id) > -1;
    return '<article class="card' + (horizontal ? ' card-h' : '') + '">' +
      '<a class="card-media" href="' + esc(p.url) + '" tabindex="-1" aria-hidden="true">' + media(p) +
        (p.off ? '<span class="sale-badge">-' + p.off + '%</span>' : '') + '</a>' +
      '<button class="heart" type="button" data-heart="' + esc(p.id) + '" aria-pressed="' + saved + '" aria-label="Save ' + esc(p.name) + ' to wishlist">' + icon('heart') + '</button>' +
      '<div class="card-body">' +
        '<h3 class="card-name"><a href="' + esc(p.url) + '">' + esc(p.name) + '</a></h3>' + stars(p) +
        '<div class="price"><strong>' + money(p.price) + '</strong>' + (p.off ? '<s><span class="sr-only">Was </span>' + money(p.oldPrice) + '</s>' : '') + '</div>' +
        action(p) +
      '</div></article>';
  }

  /* ---------- Header, drawers, footer ---------- */
  function header() {
    var searchForm = function (id) {
      return '<div class="search" role="search"><form action="products.html" method="get" data-search-form>' +
        '<label class="sr-only" for="' + id + '">Search products</label>' +
        '<input id="' + id + '" name="q" type="search" placeholder="Search for your favourite products…" autocomplete="off" data-search-input>' +
        '<button class="search-go" type="submit" aria-label="Search">' + icon('search') + '</button></form>' +
        '<div class="suggest" data-suggest hidden></div></div>';
    };
    return '<a class="skip" href="#main">Skip to content</a>' +
      '<header class="hdr"><div class="wrap hdr-in">' +
        '<a class="logo" href="./" data-logo aria-label="' + esc(W.brand || 'Bakaina') + ' home"><img src="img/logo-mark.png" alt="" width="34" height="34">' + esc(W.brand || 'Bakaina') + '</a>' +
        searchForm('q-desk') +
        '<div class="hdr-tools">' +
          '<button class="icon-btn only-phone" type="button" data-search-toggle aria-expanded="false" aria-controls="search-row" aria-label="Search">' + icon('search') + '</button>' +
          '<a class="icon-btn only-desk" href="products.html?view=account" aria-label="My account">' + icon('user') + '</a>' +
          '<a class="icon-btn" href="products.html?view=wishlist" aria-label="Wishlist">' + icon('heart') + '<span class="badge" data-wish-count hidden></span></a>' +
          '<button class="icon-btn" type="button" data-open="cart" aria-label="Cart">' + icon('bag') + '<span class="badge" data-cart-count hidden></span></button>' +
          '<button class="icon-btn" type="button" data-open="menu" aria-label="Menu" aria-controls="drawer-menu">' + icon('menu') + '</button>' +
        '</div></div>' +
        '<div class="search-row" id="search-row" hidden><div class="wrap">' + searchForm('q-phone') + '</div></div>' +
      '</header>';
  }
  function drawers() {
    var counts = {}; products.forEach(function (p) { counts[p.category] = (counts[p.category] || 0) + 1; });
    return '<div class="scrim" data-scrim hidden></div>' +
      '<aside class="drawer" id="drawer-menu" data-drawer="menu" role="dialog" aria-modal="true" aria-labelledby="menu-title" hidden>' +
        '<div class="drawer-head"><h2 id="menu-title">Menu</h2><button class="icon-btn" type="button" data-close aria-label="Close menu">' + icon('close') + '</button></div>' +
        '<nav class="drawer-body" aria-label="Main">' +
          '<p class="drawer-title">Shop by category</p><ul class="drawer-list">' +
            '<li><a href="products.html">' + icon('grid') + 'All products<span class="count">' + products.length + '</span></a></li>' +
            cats.map(function (c) { return '<li><a href="products.html?cat=' + esc(c.id) + '">' + icon(c.icon) + esc(c.name) + '<span class="count">' + (counts[c.id] || 0) + '</span></a></li>'; }).join('') +
          '</ul><p class="drawer-title">Account</p><ul class="drawer-list">' +
            '<li><a href="products.html?view=account">' + icon('user') + 'My account</a></li>' +
            '<li><a href="products.html?view=wishlist">' + icon('heart') + 'Wishlist<span class="count" data-wish-count-text></span></a></li>' +
            '<li><a href="' + TRACK + '" target="_blank" rel="noopener">' + icon('truck') + 'Track order</a></li>' +
            '<li><a href="' + HELP + '" target="_blank" rel="noopener">' + icon('help') + 'Help & support</a></li>' +
          '</ul></nav></aside>' +
      '<aside class="drawer" data-drawer="cart" role="dialog" aria-modal="true" aria-labelledby="cart-title" hidden>' +
        '<div class="drawer-head"><h2 id="cart-title">Your cart</h2><button class="icon-btn" type="button" data-close aria-label="Close cart">' + icon('close') + '</button></div>' +
        '<div class="drawer-body" data-cart-body></div><div class="drawer-foot" data-cart-foot></div></aside>' +
      '<div class="toast" data-toast role="status" aria-live="polite"></div>';
  }
  function footer() {
    var soc = S.social || {}, socials = ['facebook', 'instagram', 'youtube', 'tiktok'].filter(function (k) { return soc[k]; });
    var names = { facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube', tiktok: 'TikTok' };
    return '<footer class="ftr"><div class="wrap ftr-grid">' +
      '<div><a class="logo" href="./"><img src="img/logo-mark.png" alt="" width="34" height="34">' + esc(W.brand || 'Bakaina') + '</a>' +
        '<p>' + esc(S.tagline || '') + '</p>' +
        (socials.length ? '<div class="socials">' + socials.map(function (k) { return '<a href="' + esc(soc[k]) + '" target="_blank" rel="noopener" aria-label="' + names[k] + '">' + icon(k) + '</a>'; }).join('') + '</div>' : '') + '</div>' +
      '<nav aria-label="Quick links"><h3>Quick Links</h3><ul>' +
        '<li><a href="products.html">Shop all</a></li><li><a href="products.html?tag=new">New arrivals</a></li>' +
        '<li><a href="products.html?tag=bestseller">Best sellers</a></li><li><a href="products.html?sale=1">Offers</a></li></ul></nav>' +
      '<nav aria-label="Customer service"><h3>Customer Service</h3><ul>' +
        '<li><a href="' + TRACK + '" target="_blank" rel="noopener">Track order</a></li><li><a href="delivery.html">Delivery information</a></li>' +
        '<li><a href="refund.html">Returns & refunds</a></li><li><a href="privacy.html">Privacy policy</a></li>' +
        '<li><a href="' + HELP + '" target="_blank" rel="noopener">Contact us</a></li></ul></nav>' +
      '<div><h3 id="news-h">Newsletter</h3>' +
        '<form class="news" data-news novalidate aria-labelledby="news-h"><label class="sr-only" for="news-email">Email address</label>' +
          '<input id="news-email" type="email" name="email" placeholder="Your email address" autocomplete="email" required>' +
          '<input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">' +
          '<button class="btn btn-orange" type="submit">Subscribe</button></form><p class="news-msg" data-news-msg role="status"></p>' +
        '<ul>' + (W.phone ? '<li><a href="tel:' + esc(W.phone) + '">' + icon('phone') + esc(W.phone) + '</a></li>' : '') +
          (W.whatsapp ? '<li><a href="' + HELP + '" target="_blank" rel="noopener">' + icon('whatsapp') + 'WhatsApp us</a></li>' : '') +
          (W.email ? '<li><a href="mailto:' + esc(W.email) + '">' + icon('mail') + esc(W.email) + '</a></li>' : '') + '</ul></div>' +
      '</div><div class="wrap ftr-bottom"><div class="pills" aria-label="Payment options">' +
        (S.payments || []).map(function (x) { return '<span class="pill">' + esc(x) + '</span>'; }).join('') + '</div>' +
        '<p class="copy">© ' + new Date().getFullYear() + ' ' + esc(W.brand || 'Bakaina') + '. All rights reserved.</p></div></footer>';
  }

  /* ---------- Homepage sections ---------- */
  function slideHtml(s, i, n) {
    var lab = 'aria-roledescription="slide" role="group" aria-label="' + (i + 1) + ' of ' + n + '"';
    if (s.type === 'image') return '<div class="slide slide-img" ' + lab + '><a href="' + esc(s.url || 'products.html') + '"><img src="' + esc(s.image) + '" alt="' + esc(s.alt || '') + '"' + (i ? ' loading="lazy"' : '') + ' width="1280" height="720"></a></div>';
    return '<div class="slide slide-text slide-' + (s.type === 'peach' ? 'peach' : 'navy') + '" ' + lab + '><div class="slide-copy">' +
      (s.label ? '<p class="eyebrow">' + esc(s.label) + '</p>' : '') + '<h2>' + esc(s.title) + '</h2>' + (s.text ? '<p>' + esc(s.text) + '</p>' : '') +
      (s.button ? '<a class="btn ' + (s.type === 'peach' ? 'btn-navy' : 'btn-orange') + '" href="' + esc(s.url || 'products.html') + '">' + esc(s.button) + ' ' + icon('arrow') + '</a>' : '') + '</div></div>';
  }
  function home() {
    var slides = S.slides || [];
    var trending = products.filter(function (p) { return p.tags.indexOf('trending') > -1; }).slice(0, 4);
    var maxOff = products.reduce(function (m, p) { return Math.max(m, p.off); }, 0);
    var tabs = [['special', 'Special Product'], ['new', 'New Product'], ['bestseller', 'Best Seller']]
      .map(function (t) { return { id: t[0], label: t[1], items: products.filter(function (p) { return p.tags.indexOf(t[0]) > -1; }).slice(0, 8) }; })
      .filter(function (t) { return t.items.length; });
    var html = '';
    // Hero
    html += '<section class="hero" aria-label="Featured"><div class="wrap hero-grid">' +
      '<div class="slider" data-slider aria-roledescription="carousel" aria-label="Highlights">' +
        '<div class="slides" data-slides aria-live="off">' + slides.map(function (s, i) { return slideHtml(s, i, slides.length); }).join('') + '</div>' +
        (slides.length > 1 ? '<button class="slider-arrow prev" type="button" data-prev aria-label="Previous slide">' + icon('left') + '</button>' +
          '<button class="slider-arrow next" type="button" data-next aria-label="Next slide">' + icon('right') + '</button>' +
          '<div class="dots">' + slides.map(function (s, i) { return '<button class="dot" type="button" data-dot="' + i + '" aria-label="Go to slide ' + (i + 1) + '"' + (i ? '' : ' aria-current="true"') + '></button>'; }).join('') + '</div>' : '') +
      '</div><div class="side-banners">' + (S.sideBanners || []).map(function (b) {
        return '<div class="side-banner tone-' + esc(b.tone || 'peach') + '"><h3>' + esc(b.title) + '</h3><p>' + esc(b.text || '') + '</p><a class="btn btn-navy" href="' + esc(b.url) + '">' + esc(b.button || 'Shop now') + '</a></div>';
      }).join('') + '</div></div></section>';
    // Categories
    if (cats.length) html += '<section class="sec" aria-labelledby="h-cats"><div class="wrap"><div class="sec-head"><h2 id="h-cats">Shop by Category</h2></div><div class="cats">' +
      cats.map(function (c) { return '<a class="cat" href="products.html?cat=' + esc(c.id) + '"><span class="cat-tile tone-' + esc(c.tone || 'peach') + '">' + icon(c.icon) + '</span>' + esc(c.name) + '</a>'; }).join('') + '</div></div></section>';
    // Trending
    if (trending.length) html += '<section class="sec" aria-labelledby="h-trend" style="padding-top:0"><div class="wrap"><div class="sec-head"><h2 id="h-trend">Trending Products</h2></div><div class="hgrid">' +
      trending.map(function (p) { return card(p, true); }).join('') + '</div></div></section>';
    // Collections
    (S.collections || []).forEach(function (col, i) {
      var items = products.filter(function (p) { return p.category === col.category; }).slice(0, 8);
      if (!items.length) return;
      html += '<section class="sec" aria-labelledby="h-col' + i + '" style="padding-top:0"><div class="wrap"><div class="sec-head-left"><div><h2 id="h-col' + i + '">' + esc(col.title) + '</h2>' +
        (col.subtitle ? '<p>' + esc(col.subtitle) + '</p>' : '') + '</div><a class="see-all" href="products.html?cat=' + esc(col.category) + '">See all <span class="sr-only">' + esc(col.title) + '</span>' + icon('arrow') + '</a></div>' +
        '<div class="grid">' + items.map(function (p) { return card(p); }).join('') + '</div></div></section>';
    });
    // Promo (only with a real discount)
    var pr = S.promo;
    if (pr && maxOff > 0) html += '<section class="promo" aria-label="Offer"><div class="wrap"><div class="promo-in"><div>' +
      (pr.label ? '<p class="eyebrow">' + esc(pr.label) + '</p>' : '') + '<h2>' + esc(String(pr.title || '').replace('{max}', maxOff)) + '</h2>' + (pr.text ? '<p>' + esc(pr.text) + '</p>' : '') +
      '</div><a class="btn btn-orange" href="' + esc(pr.url || 'products.html?sale=1') + '">' + esc(pr.button || 'Shop the Sale') + ' ' + icon('arrow') + '</a></div></div></section>';
    // Our products (tabs)
    if (tabs.length) html += '<section class="sec" aria-labelledby="h-ours"><div class="wrap"><div class="sec-head"><h2 id="h-ours">Our Products</h2></div>' +
      '<div class="tabs" role="tablist" aria-label="Product groups">' + tabs.map(function (t, i) {
        return '<button class="tab" type="button" role="tab" id="tab-' + t.id + '" aria-controls="panel-ours" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-tab="' + t.id + '">' + esc(t.label) + '</button>';
      }).join('') + '</div><div class="grid" id="panel-ours" role="tabpanel" aria-labelledby="tab-' + tabs[0].id + '" data-tab-panel>' + tabs[0].items.map(function (p) { return card(p); }).join('') + '</div></div></section>';
    $('#main').innerHTML = html;

    // Tabs
    var tabBtns = $$('[data-tab]');
    function selectTab(btn) {
      tabBtns.forEach(function (b) { var on = b === btn; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
      var t = tabs.filter(function (x) { return x.id === btn.getAttribute('data-tab'); })[0];
      var panel = $('[data-tab-panel]'); panel.setAttribute('aria-labelledby', btn.id);
      panel.innerHTML = t.items.map(function (p) { return card(p); }).join('');
    }
    tabBtns.forEach(function (b, i) {
      b.addEventListener('click', function () { selectTab(b); });
      b.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
        var nb = tabBtns[(i + d + tabBtns.length) % tabBtns.length]; nb.focus(); selectTab(nb);
      });
    });
    initSlider();
  }

  function initSlider() {
    var root = $('[data-slider]'); if (!root) return;
    var track = $('[data-slides]', root), n = track.children.length, cur = 0, timer = null, paused = false;
    function go(i) {
      cur = (i + n) % n; track.style.transform = 'translateX(' + (-100 * cur) + '%)';
      $$('[data-dot]', root).forEach(function (d, j) { if (j === cur) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
      $$('.slide', root).forEach(function (s, j) { s.setAttribute('aria-hidden', String(j !== cur)); $$('a', s).forEach(function (a) { a.tabIndex = j === cur ? 0 : -1; }); });
    }
    function play() { stop(); if (!reduceMotion && !paused && n > 1) timer = setInterval(function () { go(cur + 1); }, 5000); }
    function stop() { clearInterval(timer); }
    $$('[data-dot]', root).forEach(function (d) { d.addEventListener('click', function () { go(+d.getAttribute('data-dot')); play(); }); });
    var pv = $('[data-prev]', root), nx = $('[data-next]', root);
    if (pv) pv.addEventListener('click', function () { go(cur - 1); play(); });
    if (nx) nx.addEventListener('click', function () { go(cur + 1); play(); });
    root.addEventListener('mouseenter', function () { paused = true; stop(); });
    root.addEventListener('mouseleave', function () { paused = false; play(); });
    root.addEventListener('focusin', function () { paused = true; stop(); });
    root.addEventListener('focusout', function () { paused = false; play(); });
    // Swipe on phones
    var x0 = null;
    track.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    track.addEventListener('touchend', function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); x0 = null; play(); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else play(); });
    go(0); play();
  }

  /* ---------- Listing page (products.html) ---------- */
  var params = new URLSearchParams(location.search);
  var view = params.get('view');
  function renderListing() {
    var cat = params.get('cat'), q = (params.get('q') || '').trim(), sale = params.get('sale'), tag = params.get('tag');
    var list = products.slice(), title = 'All products', sub = products.length + ' products';
    var main = $('#main');
    if (view === 'account') {
      document.title = 'My account | ' + (W.brand || 'Bakaina');
      main.innerHTML = '<div class="wrap page-head"><nav class="crumbs" aria-label="Breadcrumb"><a href="./">Home</a> / <span>My account</span></nav><h1>My account</h1></div>' +
        '<div class="wrap sec"><div class="acct">' +
          '<div class="box"><h2>Track an order</h2><p>No password needed. Send us your order number on WhatsApp and we will tell you where it is.</p><a class="btn btn-navy" href="' + TRACK + '" target="_blank" rel="noopener">' + icon('whatsapp') + 'Track on WhatsApp</a></div>' +
          '<div class="box"><h2>Your wishlist</h2><p>' + wish.length + ' saved product' + (wish.length === 1 ? '' : 's') + ' on this device.</p><a class="btn btn-orange" href="products.html?view=wishlist">Open wishlist</a></div>' +
          '<div class="box"><h2>Need help?</h2><p>Questions about a product, delivery or a return.</p><a class="btn btn-white" style="border:1.5px solid var(--line)" href="' + HELP + '" target="_blank" rel="noopener">Contact us</a></div>' +
        '</div></div>';
      return;
    }
    if (view === 'wishlist') { list = products.filter(function (p) { return wish.indexOf(p.id) > -1; }); title = 'Wishlist'; sub = list.length + ' saved on this device'; }
    else if (cat) { list = list.filter(function (p) { return p.category === cat; }); title = catName(cat); sub = list.length + ' product' + (list.length === 1 ? '' : 's'); }
    else if (q) {
      var words = q.toLowerCase().split(/\s+/);
      list = list.filter(function (p) { var hay = (p.name + ' ' + catName(p.category)).toLowerCase(); return words.every(function (w) { return hay.indexOf(w) > -1; }); });
      title = 'Results for “' + q + '”'; sub = list.length + ' product' + (list.length === 1 ? '' : 's');
    } else if (sale) { list = list.filter(function (p) { return p.off > 0; }); title = 'Offers'; sub = list.length + ' on sale'; }
    else if (tag) { list = list.filter(function (p) { return p.tags.indexOf(tag) > -1; }); title = { new: 'New arrivals', bestseller: 'Best sellers', special: 'Special products', trending: 'Trending' }[tag] || 'Products'; sub = list.length + ' product' + (list.length === 1 ? '' : 's'); }
    document.title = title + ' | ' + (W.brand || 'Bakaina');
    var chips = '<nav class="chips" aria-label="Categories"><a class="chip" href="products.html"' + (!cat && !q && !sale && !tag && !view ? ' aria-current="page"' : '') + '>All</a>' +
      cats.map(function (c) { return '<a class="chip" href="products.html?cat=' + esc(c.id) + '"' + (cat === c.id ? ' aria-current="page"' : '') + '>' + esc(c.name) + '</a>'; }).join('') + '</nav>';
    var empty = view === 'wishlist'
      ? '<div class="empty"><h2>Your wishlist is empty</h2><p>Tap the heart on any product to save it here.</p><a class="btn btn-orange" href="products.html">Browse products</a></div>'
      : tag === 'bestseller'
        ? '<div class="empty"><h2>Best sellers coming soon</h2><p>Our best sellers will appear here once the orders are in.</p><a class="btn btn-orange" href="products.html">Browse all products</a></div>'
        : '<div class="empty"><h2>New products are on the way</h2><p>Looking for something specific? Ask us on WhatsApp.</p><a class="btn btn-navy" href="' + HELP + '" target="_blank" rel="noopener">' + icon('whatsapp') + 'Ask on WhatsApp</a></div>';
    main.innerHTML = '<div class="wrap page-head"><nav class="crumbs" aria-label="Breadcrumb"><a href="./">Home</a> / <span>' + esc(title) + '</span></nav><h1>' + esc(title) + '</h1><p>' + esc(sub) + '</p>' + chips + '</div>' +
      '<div class="wrap sec" style="padding-top:12px">' + (list.length ? '<div class="grid">' + list.map(function (p) { return card(p); }).join('') + '</div>' : empty) + '</div>';
    var inp = $$('[data-search-input]'); if (q) inp.forEach(function (i) { i.value = q; });
  }

  /* ---------- Cart drawer ---------- */
  function renderCounts() {
    var n = cartCount();
    $$('[data-cart-count]').forEach(function (b) { b.textContent = n; b.hidden = !n; });
    $$('[data-wish-count]').forEach(function (b) { b.textContent = wish.length; b.hidden = !wish.length; });
    $$('[data-wish-count-text]').forEach(function (b) { b.textContent = wish.length || ''; });
  }
  function renderCart() {
    var body = $('[data-cart-body]'), foot = $('[data-cart-foot]'); if (!body) return;
    if (!cart.length) {
      body.innerHTML = '<div class="cart-empty">' + icon('bag') + '<p>Your cart is empty.</p><a class="btn btn-orange" href="products.html">Start shopping</a></div>';
      foot.innerHTML = ''; return;
    }
    var total = 0;
    body.innerHTML = cart.map(function (x) {
      var p = byId(x.id); total += p.price * x.qty;
      return '<div class="cart-item">' + (p.image ? '<img src="' + esc(p.image) + '" alt="">' : '<span class="ph tone-peach">' + icon('bag') + '</span>') +
        '<div><h3>' + esc(p.name) + '</h3><div class="ci-price">' + money(p.price * x.qty) + '</div><div class="ci-row">' +
          '<div class="qty"><button type="button" data-q="-1" data-id="' + esc(p.id) + '" aria-label="Decrease quantity of ' + esc(p.name) + '"' + (x.qty <= 1 ? ' disabled' : '') + '>−</button>' +
          '<output aria-label="Quantity">' + x.qty + '</output><button type="button" data-q="1" data-id="' + esc(p.id) + '" aria-label="Increase quantity of ' + esc(p.name) + '"' + (x.qty >= 10 ? ' disabled' : '') + '>+</button></div>' +
          (cart.length > 1 ? '<a class="btn btn-navy ci-order" href="checkout.html?product=' + encodeURIComponent(p.checkoutId) + '&qty=' + x.qty + '">Order this</a>' : '') +
          '<button class="link-btn" type="button" data-remove="' + esc(p.id) + '">Remove</button></div></div></div>';
    }).join('');
    var lines = cart.map(function (x) { var p = byId(x.id); return '• ' + p.name + ' × ' + x.qty + ' = ' + money(p.price * x.qty); });
    var waAll = wa('আসসালামু আলাইকুম, আমি এগুলো অর্ডার করতে চাই:\n' + lines.join('\n') + '\nমোট: ' + money(total) + '\nনাম:\nমোবাইল:\nঠিকানা:');
    var only = cart.length === 1 ? byId(cart[0].id) : null;
    foot.innerHTML = '<div class="cart-total"><span>Total</span><strong>' + money(total) + '</strong></div>' +
      '<p class="cart-note">Free delivery · Cash on delivery all over Bangladesh' + (cart.length > 1 ? '. Order each item above, or send the whole cart to us on WhatsApp.' : '.') + '</p>' +
      (only ? '<a class="btn btn-orange btn-block" href="checkout.html?product=' + encodeURIComponent(only.checkoutId) + '&qty=' + cart[0].qty + '">Checkout</a>' : '') +
      '<a class="btn ' + (only ? 'btn-white' : 'btn-orange') + ' btn-block" style="margin-top:8px;' + (only ? 'border:1.5px solid var(--line)' : '') + '" href="' + waAll + '" target="_blank" rel="noopener">' + icon('whatsapp') + 'Order ' + (only ? 'on WhatsApp' : 'the whole cart on WhatsApp') + '</a>';
  }

  /* ---------- Drawer open/close ---------- */
  var lastFocus = null;
  function openDrawer(name) {
    var d = $('[data-drawer="' + name + '"]'), sc = $('[data-scrim]');
    if (name === 'cart') renderCart();
    var tst = $('[data-toast]'); if (tst) tst.classList.remove('show');
    lastFocus = document.activeElement;
    d.hidden = false; sc.hidden = false;
    requestAnimationFrame(function () { d.classList.add('open'); sc.classList.add('open'); });
    document.body.style.overflow = 'hidden';
    var btn = $('[data-close]', d); if (btn) btn.focus();
  }
  function closeDrawers() {
    $$('[data-drawer]').forEach(function (d) { if (d.hidden) return; d.classList.remove('open'); setTimeout(function () { d.hidden = true; }, reduceMotion ? 0 : 250); });
    var sc = $('[data-scrim]'); sc.classList.remove('open'); setTimeout(function () { sc.hidden = true; }, reduceMotion ? 0 : 200);
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  /* ---------- Search suggestions ---------- */
  function suggest(input) {
    var box = $('[data-suggest]', input.closest('.search')), q = input.value.trim().toLowerCase();
    if (!q) { box.hidden = true; return; }
    var hits = products.filter(function (p) { return (p.name + ' ' + catName(p.category)).toLowerCase().indexOf(q) > -1; }).slice(0, 5);
    box.innerHTML = hits.length ? hits.map(function (p) {
      return '<a href="' + esc(p.url) + '">' + (p.image ? '<img src="' + esc(p.image) + '" alt="">' : '<span class="ph tone-peach">' + icon('bag') + '</span>') +
        '<span class="s-name">' + esc(p.name) + '</span><span class="s-price">' + money(p.price) + '</span></a>';
    }).join('') : '<div class="s-none">No products found for “' + esc(input.value.trim()) + '”</div>';
    box.hidden = false;
  }

  /* ---------- Toast ---------- */
  var tt;
  function toast(msg) { var t = $('[data-toast]'); if (!t) return; t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('show'); }, 2200); }

  /* ---------- Boot ---------- */
  $('[data-chrome-header]').outerHTML = header() + drawers();
  $('[data-chrome-footer]').outerHTML = footer();
  if (page === 'home') home(); else renderListing();
  renderCounts();

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-add],[data-heart],[data-open],[data-close],[data-scrim],[data-q],[data-remove],[data-search-toggle]');
    if (!t) {
      if (!e.target.closest('.search')) $$('[data-suggest]').forEach(function (b) { b.hidden = true; });
      return;
    }
    if (t.hasAttribute('data-add')) addToCart(t.getAttribute('data-add'));
    else if (t.hasAttribute('data-heart')) toggleWish(t.getAttribute('data-heart'), t);
    else if (t.hasAttribute('data-open')) openDrawer(t.getAttribute('data-open'));
    else if (t.hasAttribute('data-close') || t.hasAttribute('data-scrim')) closeDrawers();
    else if (t.hasAttribute('data-q')) { var it = cart.filter(function (x) { return x.id === t.getAttribute('data-id'); })[0]; it.qty = Math.max(1, Math.min(10, it.qty + Number(t.getAttribute('data-q')))); saveCart(); }
    else if (t.hasAttribute('data-remove')) { cart = cart.filter(function (x) { return x.id !== t.getAttribute('data-remove'); }); saveCart(); var f = $('[data-close]', $('[data-drawer="cart"]')); if (f) f.focus(); }
    else if (t.hasAttribute('data-search-toggle')) {
      var row = $('#search-row'), open = row.hidden; row.hidden = !open; t.setAttribute('aria-expanded', String(open));
      if (open) $('[data-search-input]', row).focus();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if ($$('[data-drawer]').some(function (d) { return !d.hidden; })) closeDrawers();
    $$('[data-suggest]').forEach(function (b) { b.hidden = true; });
  });
  // Keep Tab inside an open drawer
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var d = $$('[data-drawer]').filter(function (x) { return !x.hidden; })[0]; if (!d) return;
    var f = $$('a[href],button:not([disabled]),input', d).filter(function (x) { return x.offsetParent !== null; });
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });
  $$('[data-search-input]').forEach(function (inp) { inp.addEventListener('input', function () { suggest(inp); }); });
  $$('[data-search-form]').forEach(function (f) { f.addEventListener('submit', function (e) { var v = $('[data-search-input]', f).value.trim(); if (!v) { e.preventDefault(); $('[data-search-input]', f).focus(); } }); });

  // Newsletter → Code.gs (action: subscribe)
  var news = $('[data-news]');
  if (news) news.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = $('[data-news-msg]'), email = news.email.value.trim(), btn = $('button', news);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.textContent = 'Please enter a valid email address.'; news.email.focus(); return; }
    if (!W.appsScriptUrl) { msg.textContent = 'Sorry, sign-up is not available right now.'; return; }
    btn.disabled = true; msg.textContent = 'Subscribing…';
    fetch(W.appsScriptUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'subscribe', email: email, website: news.website.value }) })
      .then(function (r) { return r.json(); })
      .then(function (res) { if (!res.ok) throw new Error(); msg.textContent = 'Thanks! You are on the list.'; news.reset(); })
      .catch(function () { msg.textContent = 'Could not subscribe right now. Please try again later.'; })
      .then(function () { btn.disabled = false; });
  });

  // Hidden admin shortcut on the homepage logo: tap-tap, pause, tap-tap (same as the other pages)
  var logo = $('[data-logo]');
  if (logo && page === 'home') (function () {
    var QUICK = 450, PAUSE_MIN = 600, PAUSE_MAX = 2000, times = [], timer = null;
    logo.addEventListener('click', function (e) {
      e.preventDefault(); clearTimeout(timer);
      times.push(Date.now()); if (times.length > 4) times.shift();
      if (times.length === 4) { var a = times; if (a[1] - a[0] <= QUICK && a[2] - a[1] >= PAUSE_MIN && a[2] - a[1] <= PAUSE_MAX && a[3] - a[2] <= QUICK) { times = []; location.href = 'admin.html'; return; } }
      if (times.length === 1) window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      timer = setTimeout(function () { times = []; }, times.length === 1 ? QUICK : PAUSE_MAX);
    });
  })();

  // Meta Pixel: page view
  if (W.pixelId) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    fbq('init', W.pixelId); fbq('track', 'PageView');
  }
})();
