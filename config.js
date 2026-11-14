/* ==========================================================================
   Bakaina product page — everything you edit lives here.
   Anything left empty shows the design's placeholder box/text instead.
   ========================================================================== */
window.WL = {
  brand: 'Bakaina',
  announcement: 'সারাদেশে ফ্রি ডেলিভারি · পণ্য হাতে পেয়ে মূল্য পরিশোধ',
  announcement_en: 'Free delivery across Bangladesh · Pay when it arrives',
  // Any field ending in _en is the English version shown when the visitor picks EN.

  // Price in taka. Leave price null until decided: the page shows "[দাম]" and checkout stays closed.
  // ⚠ Also set PRICE in Code.gs — the server recalculates every order total.
  currency: '৳',
  price: 1099,                      // sale price
  // Quantity discount: buy minQty or more → percent off the WHOLE order. percent: 0 turns it off.
  // ⚠ Mirror it in Code.gs (QTY_DISCOUNT) — the server recalculates every total.
  // products: which products get it (the belt only — the skincare margins are too thin for 10% off)
  qtyDiscount: { minQty: 2, percent: 10, products: ['pad-pink'] },
  // Bundle cards on the product page (pieces per card) and which one starts selected
  bundles: [1, 2, 3],
  bundleDefault: 1,   // matches the ৳১,০৯৯ in the ads; 2–3 pieces stay one tap away

  // Products shown on the home page (index.html), in this order.
  // To add a product: copy a block, change the details, put its photo in img/ and set url to its page.
  // usePagePrice: true shows the price set above (price / oldPrice) so the belt never shows two prices.
  catalog: [
    {
      id: 'belt',
      name: 'WarmLune™ Heating Belt', name_en: 'WarmLune™ Heating Belt',
      blurb: '৩–৬ সেকেন্ডে গরম · ৩টি হিট লেভেল · ৪টি ম্যাসাজ মোড', blurb_en: 'Warm in 3–6 s · 3 heat levels · 4 massage modes',
      image: 'img/gallery-1.jpg', url: 'heating-belt.html',
      usePagePrice: true,
      tag: 'নতুন', tag_en: 'New',
    },
    // Other products: just give the id of a product in shopProducts below (name, photo and price come from there)
    { productId: 'combo-belt-mask', tag: 'কম্বো অফার', tag_en: 'Combo offer' },
    { productId: 'anua-serum' },
    { productId: 'medicube-pdrn-serum' },
    { productId: 'medicube-capsule-cream' },
    { productId: 'medicube-gel-mask' },
  ],

  // Products with their own page (product.html?id=…), shipped by Zatiq.
  // ⚠ Every price here must match PRODUCTS in Code.gs — the server recalculates every order total.
  // oldPrice: only a price the product REALLY sold at before (leave it out otherwise).
  // Write benefits as "helps / the look of", never "removes / cures": customers and Meta treat skincare promises strictly.
  shopProducts: [
    {
      id: 'combo-belt-mask', combo: true,
      name: 'কম্বো: WarmLune™ Heating Belt + Medicube জেল মাস্ক', name_en: 'Combo: WarmLune™ Heating Belt + Medicube Gel Mask',
      blurb: 'বেল্ট + ১টি PDRN পিংক কোলাজেন জেল মাস্ক', blurb_en: 'Belt + 1 PDRN Pink Collagen Gel Mask',
      price: 1799, oldPrice: 1898,      // oldPrice = the two bought separately (৳1,099 + ৳799)
      image: 'img/p-combo-belt-mask.jpg', url: 'checkout.html?product=combo-belt-mask',
    },
    {
      id: 'anua-serum', brand: 'Anua', size: '30ml',
      name: 'Anua Niacinamide 10% + TXA 4% ডার্ক স্পট সিরাম', name_en: 'Anua Niacinamide 10% + TXA 4% Dark Spot Serum',
      blurb: 'দাগ ও অসমান স্কিন টোন কম দেখাতে', blurb_en: 'For the look of dark spots & uneven tone',
      price: 2499, image: 'img/p-anua-serum.jpg',
      images: ['img/p-anua-serum.jpg', 'img/p-anua-serum-2.jpg', 'img/p-anua-serum-3.jpg', 'img/p-anua-serum-4.jpg', 'img/p-anua-serum-5.jpg'],
      intro: 'হালকা টেক্সচারের এই সিরাম কালো দাগ, ব্রণের দাগ, পিগমেন্টেশন ও অসমান স্কিন টোন কম দেখাতে সাহায্য করে, আর ত্বককে আরও উজ্জ্বল দেখায়।',
      intro_en: 'A lightweight serum that helps reduce the appearance of dark spots, acne marks, hyperpigmentation and uneven skin tone while improving overall radiance.',
      benefits: [
        ['<strong>দাগ কম দেখায়:</strong> পিগমেন্টেশন ও ব্রণের দাগ হালকা দেখাতে সাহায্য করে।', '<strong>Fades the look of spots:</strong> helps fade the appearance of pigmentation and post-acne marks.'],
        ['<strong>উজ্জ্বল ত্বক:</strong> আরও উজ্জ্বল ও সমান দেখতে স্কিন টোন।', '<strong>Brighter skin:</strong> a more radiant, even-looking complexion.'],
        ['<strong>অতিরিক্ত তেল নিয়ন্ত্রণ:</strong> নায়াসিনামাইড সিবাম ব্যালান্স করতে সাহায্য করে।', '<strong>Controls excess oil:</strong> niacinamide helps balance sebum.'],
        ['<strong>মসৃণ টেক্সচার:</strong> বড় লোমকূপ কম দেখাতে সাহায্য করে।', '<strong>Smoother texture:</strong> helps minimise the look of enlarged pores.'],
        ['<strong>হালকা ফর্মুলা:</strong> সহজে শোষিত হয়, ভারী বা তৈলাক্ত লাগে না।', '<strong>Lightweight:</strong> absorbs easily without feeling heavy or greasy.'],
      ],
      ingredients: [
        ['<strong>১০% নায়াসিনামাইড:</strong> অসমান স্কিন টোন, অতিরিক্ত তেল ও দৃশ্যমান লোমকূপের যত্নে।', '<strong>10% Niacinamide:</strong> for uneven tone, excess oil and visible pores.'],
        ['<strong>৪% ট্রানেক্সামিক অ্যাসিড (TXA):</strong> একগুঁয়ে কালো দাগ ও বিবর্ণতা কম দেখাতে।', '<strong>4% Tranexamic Acid (TXA):</strong> targets the look of stubborn dark spots and discoloration.'],
      ],
      howTo: [
        ['মুখ পরিষ্কার করে চাইলে টোনার লাগান।', 'Cleanse and apply toner if you like.'],
        ['২–৩ ফোঁটা সিরাম মুখে লাগান।', 'Apply 2–3 drops to your face.'],
        ['আলতো চাপ দিয়ে শোষিত হতে দিন।', 'Pat gently until absorbed.'],
        ['এরপর ময়েশ্চারাইজার লাগান।', 'Follow with moisturiser.'],
        ['দিনে অবশ্যই SPF 30+ সানস্ক্রিন ব্যবহার করুন।', 'Use SPF 30+ sunscreen during the day.'],
      ],
      details: ['ব্র্যান্ড: Anua · সাইজ: 30ml · ধরন: ফেসিয়াল সিরাম · যাদের জন্য: কালো দাগ, পিগমেন্টেশন, অসমান স্কিন টোন, ব্রণের দাগ', 'Brand: Anua · Size: 30ml · Type: facial serum · For: dark spots, hyperpigmentation, uneven tone, acne marks'],
    },
    {
      id: 'medicube-pdrn-serum', brand: 'Medicube', size: '30ml',
      name: 'Medicube PDRN পিংক পেপটাইড সিরাম', name_en: 'Medicube PDRN Pink Peptide Serum',
      blurb: 'হাইড্রেশন, উজ্জ্বলতা ও টানটান ভাব', blurb_en: 'Hydration, glow and firmness',
      price: 2300, image: 'img/p-medicube-pdrn-serum.jpg',
      images: ['img/p-medicube-pdrn-serum.jpg', 'img/p-medicube-pdrn-serum-2.jpg', 'img/p-medicube-pdrn-serum-3.jpg', 'img/p-medicube-pdrn-serum-4.jpg'],
      intro: '1% PDRN, ৫-পেপটাইড কমপ্লেক্স ও নায়াসিনামাইড সমৃদ্ধ কোরিয়ান সিরাম। ত্বককে আর্দ্র রাখে, উজ্জ্বল দেখায় এবং সূক্ষ্ম রেখা, অসমান টোন ও নিস্তেজ ভাব কম দেখাতে সাহায্য করে।',
      intro_en: 'A Korean serum with 1% PDRN, a 5-peptide complex and niacinamide that hydrates, brightens and helps reduce the appearance of fine lines, uneven tone and dullness.',
      benefits: [
        ['<strong>ইলাস্টিসিটি:</strong> ত্বক আরও টানটান ও ভরাট দেখায়।', '<strong>Elasticity:</strong> skin looks firmer and plumper.'],
        ['<strong>উজ্জ্বল ত্বক:</strong> আরও উজ্জ্বল, সমান দেখতে ত্বক।', '<strong>Brighter skin:</strong> a radiant, even-looking complexion.'],
        ['<strong>অ্যান্টি-এজিং কেয়ার:</strong> সূক্ষ্ম রেখা ও বলিরেখা কম দেখাতে সাহায্য করে।', '<strong>Anti-ageing care:</strong> helps minimise the look of fine lines and wrinkles.'],
        ['<strong>গভীর হাইড্রেশন:</strong> ত্বক নরম ও আর্দ্র রাখে।', '<strong>Deep hydration:</strong> keeps skin soft and moisturised.'],
        ['<strong>স্কিন ব্যারিয়ার সাপোর্ট:</strong> স্বাস্থ্যকর আর্দ্রতার স্তর বজায় রাখতে সাহায্য করে।', '<strong>Barrier support:</strong> helps maintain a healthy moisture barrier.'],
        ['<strong>গ্লাস স্কিন গ্লো:</strong> মসৃণ, সতেজ ও উজ্জ্বল দেখায়।', '<strong>Glass-skin glow:</strong> leaves skin looking smooth, dewy and refreshed.'],
      ],
      ingredients: [
        ['<strong>1% PDRN (Sodium DNA):</strong> হাইড্রেশন ও সতেজ দেখাতে।', '<strong>1% PDRN (Sodium DNA):</strong> hydration and a revitalised look.'],
        ['<strong>5-Peptide Complex:</strong> টানটান ও ইলাস্টিক দেখাতে।', '<strong>5-Peptide Complex:</strong> for the look of firmness and elasticity.'],
        ['<strong>নায়াসিনামাইড:</strong> নিস্তেজ ত্বক উজ্জ্বল দেখাতে।', '<strong>Niacinamide:</strong> brightens dull-looking skin.'],
        ['<strong>অ্যাডেনোসিন:</strong> সূক্ষ্ম রেখা মসৃণ দেখাতে।', '<strong>Adenosine:</strong> smooths the look of fine lines.'],
        ['<strong>হায়ালুরোনিক অ্যাসিড:</strong> আর্দ্রতা ধরে রাখে।', '<strong>Hyaluronic acid:</strong> attracts moisture.'],
      ],
      howTo: [
        ['মুখ পরিষ্কার করে টোনার লাগান।', 'Cleanse and apply toner.'],
        ['২–৩ ফোঁটা মুখ ও গলায় লাগান।', 'Apply 2–3 drops to face and neck.'],
        ['আলতো ম্যাসাজ করে শোষিত হতে দিন।', 'Massage gently until absorbed.'],
        ['এরপর ময়েশ্চারাইজার লাগান।', 'Follow with moisturiser.'],
        ['সকাল ও রাতে ব্যবহার করুন, দিনে SPF 30+ সানস্ক্রিন।', 'Use morning and night; SPF 30+ during the day.'],
      ],
      details: ['ব্র্যান্ড: Medicube · সাইজ: 30ml · উৎপত্তি: দক্ষিণ কোরিয়া · বেশিরভাগ ত্বকের জন্য · যাদের জন্য: সূক্ষ্ম রেখা, নিস্তেজ ভাব, শুষ্কতা, অসমান টোন', 'Brand: Medicube · Size: 30ml · Origin: South Korea · Most skin types · For: fine lines, dullness, dryness, uneven tone'],
    },
    {
      id: 'medicube-capsule-cream', brand: 'Medicube', size: '55g',
      name: 'Medicube PDRN পিংক কোলাজেন ক্যাপসুল ক্রিম', name_en: 'Medicube PDRN Pink Collagen Capsule Cream',
      blurb: 'ক্যাপসুল + জেল ময়েশ্চারাইজার', blurb_en: 'Capsule + gel moisturiser',
      price: 2600, image: 'img/p-medicube-capsule-cream.jpg',
      images: ['img/p-medicube-capsule-cream.jpg', 'img/p-medicube-capsule-cream-2.jpg', 'img/p-medicube-capsule-cream-3.jpg', 'img/p-medicube-capsule-cream-4.jpg'],
      intro: 'গোলাপি কোলাজেন ক্যাপসুল ও স্বচ্ছ জেলের ডুয়াল-টেক্সচার কোরিয়ান ময়েশ্চারাইজার। গভীর আর্দ্রতা দেয়, উজ্জ্বল দেখায় এবং শুষ্ক, নিস্তেজ ও অসমান দেখতে ত্বকের যত্ন নেয়।',
      intro_en: 'A dual-texture Korean moisturiser of pink collagen capsules and clear gel that deeply hydrates, brightens and cares for dry, dull, uneven-looking skin.',
      benefits: [
        ['<strong>গভীর হাইড্রেশন:</strong> ত্বক নরম, আর্দ্র ও ভরাট রাখে।', '<strong>Deep hydration:</strong> keeps skin moisturised, soft and plump.'],
        ['<strong>ইলাস্টিসিটি:</strong> আরও টানটান, তারুণ্যময় দেখায়।', '<strong>Elasticity:</strong> firmer, more youthful-looking skin.'],
        ['<strong>উজ্জ্বল ত্বক:</strong> নিস্তেজ ও অসমান টোন উজ্জ্বল দেখায়।', '<strong>Brighter skin:</strong> helps with dullness and uneven tone.'],
        ['<strong>দাগের যত্ন:</strong> বিবর্ণতা কম দেখাতে সাহায্য করে।', '<strong>Spot care:</strong> helps reduce the look of discoloration.'],
        ['<strong>গ্লাস স্কিন গ্লো:</strong> সতেজ, মসৃণ ও উজ্জ্বল দেখায়।', '<strong>Glass-skin glow:</strong> dewy, smooth and radiant-looking.'],
        ['<strong>নিজের মতো টেক্সচার:</strong> ক্যাপসুল ও জেলের অনুপাত বদলে নিন।', '<strong>Your texture:</strong> adjust the capsule-to-gel ratio.'],
      ],
      ingredients: [
        ['<strong>Salmon PDRN (Sodium DNA):</strong> সতেজ, স্বাস্থ্যকর দেখাতে।', '<strong>Salmon PDRN (Sodium DNA):</strong> healthy-looking, revitalised skin.'],
        ['<strong>৫% নায়াসিনামাইড:</strong> উজ্জ্বল ও সমান দেখাতে।', '<strong>5% Niacinamide:</strong> brighter, more even-looking tone.'],
        ['<strong>হাইড্রোলাইজড কোলাজেন:</strong> ভরাট দেখাতে আর্দ্রতা।', '<strong>Hydrolysed collagen:</strong> moisture for plumper-looking skin.'],
        ['<strong>হায়ালুরোনিক অ্যাসিড:</strong> আর্দ্রতা ধরে রাখে।', '<strong>Hyaluronic acid:</strong> helps retain moisture.'],
        ['<strong>পেপটাইড:</strong> মসৃণ ও টানটান দেখাতে।', '<strong>Peptides:</strong> smoother, firmer-looking skin.'],
        ['<strong>সেরামাইড NP:</strong> ত্বকের প্রাকৃতিক আর্দ্রতার স্তর রক্ষায়।', '<strong>Ceramide NP:</strong> supports the natural moisture barrier.'],
      ],
      howTo: [
        ['মুখ পরিষ্কার করে টোনার ও সিরাম লাগান।', 'Cleanse, then apply toner and serum.'],
        ['পরিমাণমতো গোলাপি ক্যাপসুল ও স্বচ্ছ জেল নিন।', 'Take some pink capsules and clear gel.'],
        ['ভালোভাবে মিশিয়ে নিন।', 'Mix until blended.'],
        ['মুখ ও গলায় আলতো করে লাগান।', 'Apply gently to face and neck.'],
        ['সকাল ও রাতে ব্যবহার করুন, দিনে সানস্ক্রিন। টিপ: হালকা ফিনিশের জন্য জেল বেশি, বেশি আর্দ্রতার জন্য ক্যাপসুল বেশি নিন।', 'Use morning and night with sunscreen by day. Tip: more gel for a light finish, more capsules for richer moisture.'],
      ],
      details: ['ব্র্যান্ড: Medicube · সাইজ: 55g · উৎপত্তি: দক্ষিণ কোরিয়া · সব ধরনের ত্বকের জন্য · যাদের জন্য: শুষ্কতা, নিস্তেজ ভাব, অসমান টোন, সূক্ষ্ম রেখা', 'Brand: Medicube · Size: 55g · Origin: South Korea · All skin types · For: dryness, dullness, uneven tone, fine lines'],
    },
    {
      id: 'medicube-gel-mask', brand: 'Medicube', size: '28g',
      name: 'Medicube PDRN পিংক কোলাজেন জেল মাস্ক', name_en: 'Medicube PDRN Pink Collagen Gel Mask',
      blurb: '১টি হাইড্রোজেল শিট মাস্ক', blurb_en: '1 hydrogel sheet mask',
      price: 799, image: 'img/p-medicube-gel-mask.jpg',
      images: ['img/p-medicube-gel-mask.jpg', 'img/p-medicube-gel-mask-2.jpg', 'img/p-medicube-gel-mask-3.jpg', 'img/p-medicube-gel-mask-4.jpg', 'img/p-medicube-gel-mask-5.jpg'],
      intro: 'Salmon PDRN, কোলাজেন, নায়াসিনামাইড ও পেপটাইড সমৃদ্ধ কোরিয়ান হাইড্রোজেল মাস্ক (১টি শিট)। ত্বককে গভীরভাবে আর্দ্র করে এবং টানটান ও উজ্জ্বল দেখাতে সাহায্য করে। ব্যবহারের সময় ধীরে ধীরে স্বচ্ছ হয়ে যায়।',
      intro_en: 'A Korean hydrogel mask (1 sheet) with salmon PDRN, collagen, niacinamide and peptides that deeply hydrates and helps skin look firmer and radiant. It turns clear as it works.',
      benefits: [
        ['<strong>গভীর হাইড্রেশন:</strong> আর্দ্রতা ফিরিয়ে শুষ্কতা কমায়।', '<strong>Deep hydration:</strong> replenishes moisture and relieves dryness.'],
        ['<strong>ইলাস্টিসিটি:</strong> আরও টানটান ও ভরাট দেখায়।', '<strong>Elasticity:</strong> firmer, plumper-looking skin.'],
        ['<strong>গ্লাস স্কিন গ্লো:</strong> উজ্জ্বল ও সতেজ দেখায়।', '<strong>Glass-skin glow:</strong> radiant and refreshed-looking.'],
        ['<strong>অ্যান্টি-এজিং কেয়ার:</strong> সূক্ষ্ম রেখা কম দেখাতে সাহায্য করে।', '<strong>Anti-ageing care:</strong> helps reduce the look of fine lines.'],
        ['<strong>রং বদলানো জেল:</strong> ব্যবহারের সময় ধীরে ধীরে স্বচ্ছ হয়।', '<strong>Colour-changing gel:</strong> turns clear during use.'],
      ],
      ingredients: [
        ['<strong>Salmon PDRN (Sodium DNA):</strong> আর্দ্র ও স্বাস্থ্যকর দেখাতে।', '<strong>Salmon PDRN (Sodium DNA):</strong> hydrated, healthier-looking skin.'],
        ['<strong>হাইড্রোলাইজড কোলাজেন:</strong> কোমলতা ও ইলাস্টিসিটি।', '<strong>Hydrolysed collagen:</strong> softness and elasticity.'],
        ['<strong>নায়াসিনামাইড:</strong> উজ্জ্বল, সমান দেখতে ত্বক।', '<strong>Niacinamide:</strong> brighter, even-looking skin.'],
        ['<strong>পেপটাইড:</strong> টানটান ও মসৃণ দেখাতে।', '<strong>Peptides:</strong> firmer, smoother-looking skin.'],
        ['<strong>প্যানথেনল ও অ্যালানটোইন:</strong> প্রশান্তি ও আর্দ্রতা দেয়।', '<strong>Panthenol & allantoin:</strong> soothe and moisturise.'],
      ],
      howTo: [
        ['মুখ পরিষ্কার করে টোনার লাগান।', 'Cleanse and apply toner.'],
        ['মাস্কের দুই অংশ থেকে প্রোটেকটিভ ফিল্ম খুলে নিন।', 'Peel the protective films off both mask pieces.'],
        ['চোখ ও ঠোঁট বাদ দিয়ে মুখে সমানভাবে লাগান।', 'Apply evenly, avoiding eyes and lips.'],
        ['৩–৪ ঘণ্টা বা মাস্ক স্বচ্ছ হওয়া পর্যন্ত রাখুন, চাইলে সারা রাত।', 'Leave 3–4 hours or until clear, or overnight.'],
        ['খুলে নিয়ে বাকি এসেন্স আলতো চাপে মিশিয়ে নিন।', 'Remove and pat in the remaining essence.'],
      ],
      details: ['ব্র্যান্ড: Medicube · সাইজ: 28g (১টি শিট) · উৎপত্তি: দক্ষিণ কোরিয়া · সব ধরনের ত্বকের জন্য · যাদের জন্য: শুষ্কতা, নিস্তেজ ভাব, সূক্ষ্ম রেখা', 'Brand: Medicube · Size: 28g (1 sheet) · Origin: South Korea · All skin types · For: dryness, dullness, fine lines'],
    },
  ],

  // Price framing (both honest: worked out from the price / true for an online-only shop)
  showPerMonth: true,               // "used for a year, just ৳166 a month"
  showWhyPrice: true,               // "why this price? online only, no shop rent"
  oldPrice: 1690,                   // the real price the site sold at before; only a price you REALLY sold at turns on the sale badge, tag and crossed-out price
  // Sale badge is calculated from price + oldPrice (e.g. ৩৫% ছাড়) — no fixed number to keep in sync

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
  appsScriptUrl: 'https://script.google.com/macros/s/AKfycbzE2BSASzT0BJ11xYvWOZPx04jM9WO4nopnW213HCL7ssIkY_OZy04m56XskJHETrKd/exec',                // Web App URL from Code.gs deployment (…/exec)
  pixelId: '1460286499445516',                      // Meta Pixel ID
  siteUrl: 'https://bakaina.com',
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
    { value: '৫২°C', value_en: '52°C', label: 'সর্বোচ্চ তাপ, ৩টি লেভেল', label_en: 'max heat, 3 levels' },
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
        name: (lang === 'en' ? 'WarmLune™ Heating Belt — ' + (c.name_en || c.name) : 'WarmLune™ Heating Belt — ' + c.name),
        price: Number(W.price) || 0, oldPrice: W.oldPrice || null,
        image: [(W.gallery && W.gallery[0] && W.gallery[0].src) || 'img/swatch-' + (ids[i] || i) + '.svg'],
        short: '', features: [], color: c.hex,
      };
    }).concat((W.shopProducts || []).map(function (p) {
      return {
        id: p.id,
        name: lang === 'en' && p.name_en ? p.name_en : p.name,
        price: Number(p.price) || 0, oldPrice: p.oldPrice || null,
        image: [p.image], short: '', features: [],
      };
    })),
  };
})(window.WL);
