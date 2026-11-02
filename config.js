/* ==========================================================================
   WarmLune product page — everything you edit lives here.
   Anything left empty shows the design's placeholder box/text instead.
   ========================================================================== */
window.WL = {
  brand: 'WarmLune',
  announcement: 'সব অর্ডারে ৫০% ছাড় ও ফ্রি ডেলিভারি',

  // Price in taka. Leave price null until decided: the page shows "[দাম]" and checkout stays closed.
  // ⚠ Also set PRICE in Code.gs — the server recalculates every order total.
  currency: '৳',
  price: null,                      // e.g. 1990
  oldPrice: null,                   // e.g. 3990 (shown crossed out)
  saleBadge: '৫০% ছাড়',

  // Contact
  whatsapp: '8801632932249',        // international format, no "+"
  phone: '01632932249',
  email: '[আপনার ইমেইল]',

  // Checkout & backend (same system as the Jaynamaz shop)
  bkashNumber: '01XXXXXXXXX',       // outside-Dhaka customers send the advance here
  advanceOutsideDhaka: 200,
  appsScriptUrl: '',                // Web App URL from Code.gs deployment (…/exec)
  pixelId: '',                      // Meta Pixel ID
  siteUrl: 'https://podenapata-sys.github.io/warmlunebd',
  returnPolicy: '[৩০ দিনের মানি-ব্যাক গ্যারান্টির শর্ত লিখুন]',

  // Rating line under the title. Leave null to show the design's placeholder.
  rating: null,                     // e.g. 4.8
  reviewCount: null,                // e.g. 126

  // Product photos (gallery order matches the thumbnails). '' = placeholder box.
  gallery: [
    { label: 'প্রোডাক্ট',       src: '', hint: 'এখানে আসল প্রোডাক্টের ছবি দিন' },
    { label: 'ব্যবহাররত',      src: '', hint: 'প্যাড ব্যবহাররত অবস্থার ছবি দিন' },
    { label: 'ডিসপ্লে',         src: '', hint: 'ডিসপ্লে ও কন্ট্রোলের ছবি দিন' },
    { label: 'বক্সে যা আছে',    src: '', hint: 'এখানে আসল প্রোডাক্টের ছবি দিন' },
  ],
  lifestyleImage: '',               // "প্যাড পরে আরাম করছেন এমন একজন নারী"
  featureImages: ['', '', ''],      // heat close-up, display & control, worn under clothes

  colors: [
    { name: 'ব্লাশ পিংক', hex: '#F2A3BC' },
    { name: 'পার্ল হোয়াইট', hex: '#F1E6EA' },
    { name: 'ল্যাভেন্ডার', hex: '#C9B2EA' },
  ],

  // Dark stats band. Fill with your real specs.
  stats: [
    { value: '[ব্যাটারি mAh]', label: 'বড় ক্ষমতার ব্যাটারি' },
    { value: '[XX] মিনিট', label: 'প্রতি চার্জে চলে' },
    { value: '[XX] সেকেন্ড', label: 'দ্রুত গরম হয়' },
  ],

  // REAL, verified customer reviews only. While this is empty, the page shows the
  // design's placeholder cards (clearly marked as placeholders) — fill before launch.
  // Format: { name: 'নুসরাত জ.', rating: 5, text: '…', photo: 'img/review-1.jpg' }
  reviews: [],
};

/* ==========================================================================
   Adapter for the checkout / thank-you / review / admin pages (shop.js, admin.js).
   They expect window.CONFIG; it is built from the values above — don't edit below.
   Each colour is its own product ID so the order sheet records the colour.
   ========================================================================== */
(function (W) {
  var ids = ['pink', 'white', 'lavender'];
  window.CONFIG = {
    brand: W.brand, phone: W.phone, whatsapp: W.whatsapp, facebookPage: '#',
    bkashNumber: W.bkashNumber, advanceOutsideDhaka: W.advanceOutsideDhaka,
    pixelId: W.pixelId, appsScriptUrl: W.appsScriptUrl, siteUrl: W.siteUrl,
    returnPolicy: W.returnPolicy, maxQty: 10, happyCustomers: 0, testimonials: [], sellingPoints: [],
    featuredProductId: 'pad-' + ids[0],
    products: (W.colors || []).map(function (c, i) {
      return {
        id: 'pad-' + (ids[i] || i), name: 'WarmLune হিটিং প্যাড — ' + c.name,
        price: Number(W.price) || 0, oldPrice: W.oldPrice || null,
        image: [(W.gallery && W.gallery[0] && W.gallery[0].src) || 'img/swatch-' + (ids[i] || i) + '.svg'],
        short: '', features: [], color: c.hex,
      };
    }),
  };
})(window.WL);
