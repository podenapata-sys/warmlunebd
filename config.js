/* ==========================================================================
   WarmLune product page — everything you edit lives here.
   Anything left empty shows the design's placeholder box/text instead.
   ========================================================================== */
window.WL = {
  brand: 'WarmLune',
  announcement: 'সারাদেশে ফ্রি ডেলিভারি · পণ্য হাতে পেয়ে মূল্য পরিশোধ',
  announcement_en: 'Free delivery across Bangladesh · Pay when it arrives',
  // Any field ending in _en is the English version shown when the visitor picks EN.

  // Price in taka. Leave price null until decided: the page shows "[দাম]" and checkout stays closed.
  // ⚠ Also set PRICE in Code.gs — the server recalculates every order total.
  currency: '৳',
  price: 1690,                      // sale price
  // Quantity discount: buy minQty or more → percent off the WHOLE order. percent: 0 turns it off.
  // ⚠ Mirror it in Code.gs (QTY_DISCOUNT) — the server recalculates every total.
  qtyDiscount: { minQty: 2, percent: 20 },

  // Price framing (both honest: worked out from the price / true for an online-only shop)
  showPerMonth: true,               // "used for a year, just ৳166 a month"
  showWhyPrice: true,               // "why this price? online only, no shop rent"
  oldPrice: 1990,                   // regular price (real — the price the site sold at before)                   // only a price you REALLY sold at before; it turns on the sale badge, tag and crossed-out price
  // Sale badge is calculated from price + oldPrice (e.g. ১৫% ছাড়) — no fixed number to keep in sync

  // Contact
  whatsapp: '8801632932249',        // international format, no "+"
  phone: '01632932249',
  email: 'fssolutionsss@gmail.com',

  // Checkout & backend (same system as the Jaynamaz shop)
  bkashNumber: '01632932249',       // default advance number (Send Money) for wallets without their own `number`
  // Wallets accepted for the outside-Dhaka advance. Keep in sync with PAY_METHODS in Code.gs.
  // Give a wallet its own `number` if it differs (Rocket account numbers have 12 digits).
  payMethods: [
    { id: 'bkash',  name: 'বিকাশ',  name_en: 'bKash' },
    { id: 'nagad',  name: 'নগদ',    name_en: 'Nagad' },
    { id: 'upay',   name: 'উপায়',  name_en: 'Upay' },
    { id: 'rocket', name: 'রকেট',   name_en: 'Rocket', number: '016329322490' },
  ],
  advanceOutsideDhaka: 200,
  appsScriptUrl: 'https://script.google.com/macros/s/AKfycbwECdKABZwsqdkjTPgLuVbn7hCmg1K3-ne26MZoL9N5VAi39ByAcxBOSzdJGb4XzD8jvA/exec',                // Web App URL from Code.gs deployment (…/exec)
  pixelId: '1460286499445516',                      // Meta Pixel ID
  siteUrl: 'https://podenapata-sys.github.io/warmlunebd',
  // Short version; the full terms are in refund.html
  returnPolicy: 'ডেলিভারিম্যানের সামনে খুলে দেখে নিন। ভাঙা, ভুল বা কিছু কম থাকলে তখনই ফেরত দিন। ৭ দিনের মধ্যে উৎপাদনগত ত্রুটিতে বিনামূল্যে নতুন বেল্ট।',
  returnPolicy_en: 'Check it in front of the delivery person and refuse it if it is broken, wrong or incomplete. Manufacturing defects within 7 days get a free new belt.',

  // Rating line under the title. Leave null to show the design's placeholder.
  rating: '5.0',                    // average of the reviews below
  reviewCount: 6,                   // number of reviews below

  // Product photos (gallery order matches the thumbnails). '' = placeholder box.
  gallery: [
    { label: 'প্রোডাক্ট',       label_en: 'Product',        src: 'img/gallery-1.jpg', hint: 'এখানে আসল প্রোডাক্টের ছবি দিন', hint_en: 'Add the real product photo here' },
    { label: 'ব্যবহাররত',      label_en: 'In use',         src: 'img/gallery-2.jpg', hint: 'প্যাড ব্যবহাররত অবস্থার ছবি দিন', hint_en: 'Add a photo of the pad being worn' },
    { label: 'ডিসপ্লে',         label_en: 'Display',        src: 'img/gallery-3.jpg', hint: 'ডিসপ্লে ও কন্ট্রোলের ছবি দিন', hint_en: 'Add a photo of the display and controls' },
    { label: 'বক্সে যা আছে',    label_en: 'In the box',     src: 'img/gallery-4.jpg', hint: 'এখানে আসল প্রোডাক্টের ছবি দিন', hint_en: 'Add a photo of the box contents' },
  ],
  // Scroll-expansion showcase under the product block. Best with a short, silent, looping
  // product video (MP4, under ~5 MB). type: 'video' or 'image'. Empty src = branded placeholder.
  showcase: { type: 'video', src: 'media/showcase.mp4', srcWebm: 'media/showcase.webm', poster: 'img/showcase-poster.jpg' },
  lifestyleImage: 'img/lifestyle.jpg',   // temporary: sofa photo. Replace with the 'woman on bed' shot when ready               // "প্যাড পরে আরাম করছেন এমন একজন নারী"
  featureImages: ['img/feature-1.jpg', 'img/feature-2.jpg', 'img/feature-3.jpg'],      // heat close-up, display & control, worn under clothes

  // The supplier lists one colour (pink). Add more only if you can actually ship them.
  colors: [
    { name: 'পিংক', name_en: 'Pink', hex: '#F2A3BC' },
  ],

  // Dark stats band. Fill with your real specs.
  stats: [
    { value: '৩–৬ সেকেন্ড', value_en: '3–6 sec', label: 'দ্রুত গরম হয়', label_en: 'To heat up' },
    { value: '৫০–৬০°C', value_en: '50–60°C', label: '৩ লেভেলের তাপ', label_en: '3 heat levels' },
    { value: '২–৩ ঘণ্টা', value_en: '2–3 hrs', label: 'এক চার্জে চলে', label_en: 'Per charge' },
  ],

  // REAL, verified customer reviews only. While this is empty, the page shows the
  // design's placeholder cards (clearly marked as placeholders) — fill before launch.
  // Format: { name: 'নুসরাত জ.', rating: 5, text: '…', text_en: '(optional English translation)', photo: 'img/review-1.jpg' }
  // Real customer reviews (confirmed real by the owner). Names shortened to first name + initial.
  reviews: [
    { name: 'Nusrat J.', rating: 5, text: "Period pain হলে আমার অনেক কষ্ট হয়। WarmLune use করার পর heat অনেক relaxing লাগে। Office এ থাকলেও use করতে পারি, really helpful!" },
    { name: 'Tasnim A.', rating: 5, photo: 'img/review-tasnim.jpg', text: "Product টা honestly অনেক সুন্দর। Heat level adjust করা যায় আর vibration feature টাও ভালো লাগে। Charging দিয়ে সহজেই use করা যায়।" },
    { name: 'Farzana R.', rating: 5, text: "আমি প্রথমে একটু skeptical ছিলাম, but এটা use করার পর ভালো লেগেছে। Heating feature টা comfortable এবং design টাও cute & portable." },
    { name: 'Sadia I.', rating: 5, photo: 'img/review-sadia.jpg', text: "বাসায় কাজ করার সময় এটা use করি। Wireless হওয়ায় কোনো ঝামেলা নেই। LCD display টা খুব convenient, overall nice product." },
    { name: 'Mim C.', rating: 5, text: "Travel করার সময় সাথে নিয়ে গিয়েছিলাম। Size ছোট, carry করা easy. Heat আর massage দুটো feature একসাথে থাকাটা বেশ ভালো লেগেছে।" },
    { name: 'Jannatul F.', rating: 5, text: "Period days এ একটু comfort পাওয়ার জন্য কিনেছিলাম। Use করা easy, heat settings গুলোও ভালো। Rechargeable হওয়ায় বারবার plug লাগাতে হয় না।" },
  ],
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
    brand: W.brand, phone: W.phone, whatsapp: W.whatsapp, email: W.email, facebookPage: '#',
    bkashNumber: W.bkashNumber, advanceOutsideDhaka: W.advanceOutsideDhaka, payMethods: W.payMethods,
    pixelId: W.pixelId, appsScriptUrl: W.appsScriptUrl, siteUrl: W.siteUrl,
    qtyDiscount: W.qtyDiscount,
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
