/* ==========================================================================
   WarmLune product page — everything you edit lives here.
   Anything left empty shows the design's placeholder box/text instead.
   ========================================================================== */
window.WL = {
  brand: 'WarmLune',
  announcement: 'সব অর্ডারে ৫০% ছাড় ও ফ্রি ডেলিভারি',
  announcement_en: '50% off and free delivery on every order',
  // Any field ending in _en is the English version shown when the visitor picks EN.

  // Price in taka. Leave price null until decided: the page shows "[দাম]" and checkout stays closed.
  // ⚠ Also set PRICE in Code.gs — the server recalculates every order total.
  currency: '৳',
  price: null,                      // e.g. 1990
  oldPrice: null,                   // e.g. 3990 (shown crossed out)
  saleBadge: '৫০% ছাড়',
  saleBadge_en: '50% off',

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
  returnPolicy_en: '[Write the 30-day money-back guarantee terms]',

  // Rating line under the title. Leave null to show the design's placeholder.
  rating: null,                     // e.g. 4.8
  reviewCount: null,                // e.g. 126

  // Product photos (gallery order matches the thumbnails). '' = placeholder box.
  gallery: [
    { label: 'প্রোডাক্ট',       label_en: 'Product',        src: '', hint: 'এখানে আসল প্রোডাক্টের ছবি দিন', hint_en: 'Add the real product photo here' },
    { label: 'ব্যবহাররত',      label_en: 'In use',         src: '', hint: 'প্যাড ব্যবহাররত অবস্থার ছবি দিন', hint_en: 'Add a photo of the pad being worn' },
    { label: 'ডিসপ্লে',         label_en: 'Display',        src: '', hint: 'ডিসপ্লে ও কন্ট্রোলের ছবি দিন', hint_en: 'Add a photo of the display and controls' },
    { label: 'বক্সে যা আছে',    label_en: 'In the box',     src: '', hint: 'এখানে আসল প্রোডাক্টের ছবি দিন', hint_en: 'Add a photo of the box contents' },
  ],
  lifestyleImage: '',               // "প্যাড পরে আরাম করছেন এমন একজন নারী"
  featureImages: ['', '', ''],      // heat close-up, display & control, worn under clothes

  // The supplier lists one colour (pink). Add more only if you can actually ship them.
  colors: [
    { name: 'পিংক', name_en: 'Pink', hex: '#F2A3BC' },
  ],

  // Dark stats band. Fill with your real specs.
  stats: [
    { value: '৩ লেভেল', value_en: '3 levels', label: 'লো · মিডিয়াম · হাই তাপ', label_en: 'Low · medium · high heat' },
    { value: 'LCD', value_en: 'LCD', label: 'ডিসপ্লেতে লেভেল দেখুন', label_en: 'See your level on the display' },
    { value: 'অটো শাট-অফ', value_en: 'Auto shut-off', label: 'অতিরিক্ত গরম রোধে', label_en: 'Helps prevent overheating' },
  ],

  // REAL, verified customer reviews only. While this is empty, the page shows the
  // design's placeholder cards (clearly marked as placeholders) — fill before launch.
  // Format: { name: 'নুসরাত জ.', rating: 5, text: '…', text_en: '(optional English translation)', photo: 'img/review-1.jpg' }
  reviews: [],
};

/* ==========================================================================
   Adapter for the checkout / thank-you / review / admin pages (shop.js, admin.js).
   They expect window.CONFIG; it is built from the values above — don't edit below.
   Each colour is its own product ID so the order sheet records the colour.
   ========================================================================== */
(function (W) {
  var ids = ['pink', 'white', 'lavender'];
  var lang = window.I18N ? window.I18N.lang : 'bn';
  window.CONFIG = {
    brand: W.brand, phone: W.phone, whatsapp: W.whatsapp, facebookPage: '#',
    bkashNumber: W.bkashNumber, advanceOutsideDhaka: W.advanceOutsideDhaka,
    pixelId: W.pixelId, appsScriptUrl: W.appsScriptUrl, siteUrl: W.siteUrl,
    returnPolicy: lang === 'en' && W.returnPolicy_en ? W.returnPolicy_en : W.returnPolicy, maxQty: 10, happyCustomers: 0, testimonials: [], sellingPoints: [],
    featuredProductId: 'pad-' + ids[0],
    products: (W.colors || []).map(function (c, i) {
      return {
        id: 'pad-' + (ids[i] || i),
        name: (lang === 'en' ? 'WarmLune Heating Pad — ' + (c.name_en || c.name) : 'WarmLune হিটিং প্যাড — ' + c.name),
        price: Number(W.price) || 0, oldPrice: W.oldPrice || null,
        image: [(W.gallery && W.gallery[0] && W.gallery[0].src) || 'img/swatch-' + (ids[i] || i) + '.svg'],
        short: '', features: [], color: c.hex,
      };
    }),
  };
})(window.WL);
