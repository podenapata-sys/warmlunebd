/* ==========================================================================
   Bangla / English switch for the product, checkout and thank-you pages.
   - Text in HTML: data-i18n="key" (text), data-i18n-html="key" (trusted markup
     from this file only), data-i18n-ph / -aria / -title for attributes.
   - Text in JS: I18N.t('key', { var: value }).  Numbers: I18N.num('123').
   - The choice is saved in localStorage and applies on every page.
   To change wording, edit the [bangla, english] pairs below.
   ========================================================================== */
(function () {
  'use strict';
  var KEY = 'wl-lang';
  var lang = 'bn';
  try { lang = localStorage.getItem(KEY) === 'en' ? 'en' : 'bn'; } catch (e) {}
  var qs = new URLSearchParams(location.search).get('lang');
  if (qs === 'en' || qs === 'bn') { lang = qs; try { localStorage.setItem(KEY, lang); } catch (e) {} }

  var D = {
    /* ---------- page titles ---------- */
    'doc.product': ['Bakaina Cordless Heating & Massage Belt — তারবিহীন ও USB রিচার্জেবল হিটিং ম্যাসাজ বেল্ট', 'Bakaina Cordless Heating & Massage Belt — USB rechargeable'],
    'doc.checkout': ['অর্ডার করুন | Bakaina', 'Checkout | Bakaina'],
    'doc.thanks': ['ধন্যবাদ! অর্ডার সম্পন্ন | Bakaina', 'Thank you! Order received | Bakaina'],
    'doc.delivery': ['ডেলিভারি পলিসি | Bakaina', 'Delivery policy | Bakaina'],
    'doc.refund': ['রিফান্ড ও রিপ্লেসমেন্ট পলিসি | Bakaina', 'Refund & replacement policy | Bakaina'],
    'doc.privacy': ['প্রাইভেসি পলিসি | Bakaina', 'Privacy policy | Bakaina'],
    'pol.home': ['← হোমপেজ', '← Home'],

    /* ---------- header / footer ---------- */
    'nav.home': ['হোম', 'Home'],
    'nav.buy': ['বেল্টটি কিনুন', 'Shop the belt'],
    'nav.faq': ['প্রশ্নোত্তর', 'FAQ'],
    'nav.contact': ['যোগাযোগ', 'Contact'],
    'nav.track': ['অর্ডার ট্র্যাক করুন', 'Track order'],
    'aria.cart': ['কার্ট', 'Cart'],
    'aria.home': ['Bakaina হোম', 'Bakaina home'],
    'aria.nav': ['মেনু', 'Menu'],
    'aria.colors': ['রং', 'Colour'],
    'aria.products': ['পণ্য', 'Product'],
    'aria.wa': ['WhatsApp-এ মেসেজ করুন', 'Message us on WhatsApp'],
    'aria.menu': ['মেনু খুলুন', 'Open menu'],
    'aria.lang': ['ভাষা', 'Language'],
    'foot.rights': ['সর্বস্বত্ব সংরক্ষিত।', 'All rights reserved.'],
    'foot.contact': ['যোগাযোগ:', 'Contact:'],
    'foot.email': ['[আপনার ইমেইল]', '[your email]'],
    'foot.delivery': ['ডেলিভারি পলিসি', 'Delivery policy'],
    'foot.refund': ['রিফান্ড পলিসি', 'Refund policy'],
    'foot.privacy': ['প্রাইভেসি পলিসি', 'Privacy policy'],

    /* ---------- product block ---------- */
    'p.title': ['<span class="title-main">Bakaina Cordless Heating &amp; Massage Belt</span><span class="title-sub">তারবিহীন ও USB রিচার্জেবল হিটিং ম্যাসাজ বেল্ট</span>', '<span class="title-main">Bakaina Cordless Heating &amp; Massage Belt</span><span class="title-sub">USB rechargeable · 3 heat levels · 4 massage modes</span>'],
    'p.lead': ["পিরিয়ডের দিনগুলোতে পেট ও কোমরের ব্যথায় দ্রুত আরাম পেতে Bakaina Cordless Heating & Massage Belt তৈরি করা হয়েছে আধুনিক ফাস্ট-হিটিং প্রযুক্তিতে।", "Bakaina Cordless Heating & Massage Belt is built with modern fast-heating technology to bring quick, soothing comfort to your belly and lower back on period days."],
    'p.c1': ["<strong>দ্রুত হিটিং:</strong> অন করার মাত্র ৩–৬ সেকেন্ডের মধ্যে আরামদায়ক উষ্ণতা ছড়িয়ে দেয়, সর্বোচ্চ ৫২°C পর্যন্ত — তাপমাত্রা ডিসপ্লেতে দেখা যায়।", "<strong>Fast heating:</strong> soothing warmth within 3–6 seconds of switching on, up to 52°C, with the temperature shown on the display."],
    'p.c2': ["<strong>কাস্টমাইজড কন্ট্রোল:</strong> আপনার প্রয়োজন অনুযায়ী ৩টি হিট লেভেল এবং ৪টি ভাইব্রেশন ম্যাসাজ মোড।", "<strong>Custom control:</strong> 3 heat levels and 4 vibration massage modes to suit you."],
    'p.c3': ["<strong>তারবিহীন ও পোর্টেবল:</strong> সম্পূর্ণ তারবিহীন ও USB রিচার্জেবল — বাসায়, অফিসে বা ভ্রমণে যেকোনো সময় ব্যবহার করুন।", "<strong>Cordless &amp; portable:</strong> fully cordless and USB rechargeable — use it at home, at the office or while travelling."],
    'p.c4': ["<strong>আরামদায়ক ফিট:</strong> নরম ফেব্রিক ও অ্যাডজাস্টেবল ইলাস্টিক স্ট্র্যাপ, ৫০ ইঞ্চি পর্যন্ত কোমরে সহজেই ফিট হয়।", "<strong>Comfortable fit:</strong> soft fabric and an adjustable elastic strap that fits waists up to 50 inches."],
    'p.sale': ['সেল', 'Sale'],
    'p.badge': ['{pct}% ছাড়', '{pct}% off'],
    'p.offer': ['{n}টি বা বেশি কিনলে পুরো অর্ডারে {pct}% ছাড়!', 'Buy {n} or more and get {pct}% off your whole order!'],
    'p.total': ['মোট', 'Total'],
    'p.save': ['আপনি সাশ্রয় করছেন {amt}!', 'You save {amt}!'],
    'p.nudge': ['আর {k}টি যোগ করলে {pct}% ছাড় — মা বা বোনের জন্য একটি নিন', 'Add {k} more for {pct}% off — get one for your mum or sister'],
    'co.discount': ['{n}+ পিসে {pct}% ছাড়', '{pct}% off for {n}+'],
    'p.perMonth': ['এক বছর ব্যবহার করলে মাসে মাত্র {amt}', 'Used for a year, that\u2019s just {amt} a month'],
    'p.whyQ': ['কেন এই দাম?', 'Why this price?'],
    'p.whyA': ['আমরা শুধু অনলাইনে বিক্রি করি — দোকান ভাড়া বা শোরুমের খরচ নেই, সেই সাশ্রয় আপনার।', 'We sell online only — no shop rent or showroom costs, and that saving goes to you.'],
    'p.ship': ["সারাদেশে <a href=\"#ship\">ফ্রি ডেলিভারি</a> — কোনো ডেলিভারি চার্জ নেই।", "<a href=\"#ship\">Free delivery</a> across Bangladesh \u2014 no delivery charge."],
    'p.color': ['রং:', 'Colour:'],
    'p.qty': ['পরিমাণ', 'Quantity'],
    'p.add': ['কার্টে যোগ করুন', 'Add to cart'],
    'p.buy': ['এখনই কিনুন', 'Buy now'],
    'p.buyArrow': ['এখনই কিনুন →', 'Buy now →'],
    'p.perk1': ['ফ্রি ডেলিভারি', 'Free delivery'],
    'p.perk2': ['৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি', '7-day replacement guarantee'],
    'p.perk3': ['পণ্য হাতে পেয়ে টাকা', 'Pay on delivery'],
    'aria.perks': ['কেনার সুবিধা', 'Why buy with confidence'],
    'b.head': ['সীমিত সময়ের অফার', 'Limited time offer'],
    'b.qty1': ['১টি', '1 piece'],
    'b.qtyN': ['{n}টি', '{n} pieces'],
    'b.std': ['রেগুলার দাম', 'Standard price'],
    'b.each': ['প্রতিটি {amt} · আরও {pct}% ছাড়', '{amt} each · extra {pct}% off'],
    'b.free': ['ফ্রি ডেলিভারি', 'Free delivery'],
    'b.total': ['মোট', 'Total'],
    'aria.bundle': ['পরিমাণ বেছে নিন', 'Choose quantity'],
    'sb.buy': ['এখনই অর্ডার করুন', 'Order now'],
    'sb.items': ['{n}টি · ফ্রি ডেলিভারি', '{n} pc · free delivery'],
    'b.combo': ['বেল্ট + জেল মাস্ক কম্বো', 'Belt + Gel Mask combo'],
    'b.comboSub': ['আলাদা কেনার চেয়ে {amt} কম', '{amt} less than buying separately'],
    'sb.combo': ['কম্বো · ফ্রি ডেলিভারি', 'Combo · free delivery'],

    /* ---------- skincare product page (product.html) ---------- */
    'pp.benefits': ['মূল সুবিধা', 'Key benefits'],
    'pp.ingredients': ['মূল উপাদান', 'Key ingredients'],
    'pp.how': ['ব্যবহারের নিয়ম', 'How to use'],
    'pp.details': ['পণ্যের বিবরণ', 'Product details'],
    'pp.patchT': ['প্যাচ টেস্ট', 'Patch test'],
    'pp.patch': ['প্রথমবার ব্যবহারের আগে হাতের ভেতরের দিকে অল্প লাগিয়ে ২৪ ঘণ্টা দেখে নিন। জ্বালা, চুলকানি বা লালচে ভাব হলে ব্যবহার বন্ধ করুন।', 'Before first use, try a little on your inner arm and wait 24 hours. Stop if you notice stinging, itching or redness.'],
    'pp.qty': ['পরিমাণ', 'Quantity'],
    'pp.total': ['মোট', 'Total'],
    'pp.buy': ['এখনই অর্ডার করুন', 'Order now'],
    'pp.returnsT': ['রিটার্ন', 'Returns'],
    'pp.returns': ['স্কিনকেয়ার পণ্য সিল না খোলা অবস্থায় ৭ দিনের মধ্যে ফেরত দেওয়া যায়। খোলা বা ব্যবহার করা পণ্য স্বাস্থ্যবিধির কারণে ফেরত নেওয়া হয় না (ভুল বা ক্ষতিগ্রস্ত পণ্য ছাড়া)। <a href="refund.html">বিস্তারিত →</a>', 'Skincare can be returned unopened within 7 days. Opened or used items cannot be taken back for hygiene reasons (unless wrong or damaged). <a href="refund.html">Details →</a>'],
    'pp.deliveryT': ['ডেলিভারি', 'Delivery'],
    'pp.delivery': ['সারাদেশে ফ্রি ডেলিভারি। ঢাকায় পুরো টাকা পণ্য হাতে পেয়ে; ঢাকার বাইরে ৳২০০ অগ্রিম, বাকিটা হাতে পেয়ে। <a href="delivery.html">বিস্তারিত →</a>', 'Free delivery across Bangladesh. Dhaka pays in full on delivery; outside Dhaka pays a ৳200 advance, the rest on delivery. <a href="delivery.html">Details →</a>'],
    'pp.comboT': ['বেল্টের সাথে কম্বোতে নিন', 'Get it with the belt'],
    'pp.notFound': ['পণ্যটি পাওয়া যায়নি।', 'Product not found.'],
    'pp.all': ['সব পণ্য দেখুন', 'See all products'],

    /* ---------- home page (home.html) ---------- */
    'doc.home': ['Bakaina — প্রয়োজনীয় জিনিস, ঘরে বসেই', 'Bakaina — everyday essentials, delivered'],
    'nav.shop': ['সব পণ্য', 'All products'],
    'nav.how': ['কীভাবে অর্ডার করবেন', 'How to order'],
    'h.kicker': ['Bakaina অনলাইন শপ', 'Bakaina online shop'],
    'h.title': ['প্রয়োজনীয় জিনিস,<br><span>ঘরে বসেই</span>', 'Everyday essentials,<br><span>at your door</span>'],
    'h.sub': ['বেছে নেওয়া মানসম্মত পণ্য। সারাদেশে ফ্রি ডেলিভারি, খুলে দেখে তারপর টাকা।', 'Carefully chosen quality products. Free delivery across Bangladesh; check it, then pay.'],
    'h.cta': ['পণ্য দেখুন', 'Shop now'],
    'h.cta2': ['WhatsApp-এ জিজ্ঞেস করুন', 'Ask on WhatsApp'],
    'h.featured': ['ফিচার্ড পণ্য', 'Featured'],
    'h.t1': ['সারাদেশে ফ্রি ডেলিভারি', 'Free delivery nationwide'],
    'h.t2': ['ক্যাশ অন ডেলিভারি', 'Cash on delivery'],
    'h.t3': ['৭ দিনের রিপ্লেসমেন্ট', '7-day replacement'],
    'h.t4': ['খুলে দেখে নিন', 'Check before you pay'],
    'h.products': ['আমাদের পণ্য', 'Our products'],
    'h.productsSub': ['সব পণ্যে ফ্রি ডেলিভারি ও ক্যাশ অন ডেলিভারি।', 'Free delivery and cash on delivery on everything.'],
    'h.order': ['অর্ডার করুন', 'Order now'],
    'h.soon': ['আরও পণ্য শীঘ্রই আসছে', 'More products coming soon'],
    'h.soonSub': ['নতুন পণ্যের খবর পেতে WhatsApp-এ মেসেজ দিন।', 'Message us on WhatsApp to hear about new products.'],
    'h.how': ['কীভাবে অর্ডার করবেন', 'How to order'],
    'h.s1t': ['পণ্য বাছুন', 'Pick a product'],
    'h.s1': ['পছন্দের পণ্যে "অর্ডার করুন" চাপুন।', 'Tap "Order now" on the product you want.'],
    'h.s2t': ['ফর্ম পূরণ করুন', 'Fill in the form'],
    'h.s2': ['নাম, মোবাইল নম্বর ও ঠিকানা দিন। আমরা কল করে অর্ডার কনফার্ম করব।', 'Give your name, number and address. We call to confirm.'],
    'h.s3t': ['হাতে পেয়ে টাকা দিন', 'Pay when it arrives'],
    'h.s3': ['ঢাকায় ১–২ দিনে, ঢাকার বাইরে ২–৪ দিনে পৌঁছায়। ঢাকার বাইরে ৳২০০ অগ্রিম, বাকিটা হাতে পেয়ে।', 'Dhaka in 1–2 days, elsewhere in 2–4 days. Outside Dhaka: ৳200 advance, the rest on delivery.'],
    'h.reviews': ['গ্রাহকরা যা বলছেন', 'What customers say'],
    'h.reviewOf': ['হিটিং ম্যাসাজ বেল্ট', 'Heating & massage belt'],
    'h.helpT': ['কিছু জানার আছে?', 'Have a question?'],
    'h.help': ['WhatsApp বা ফোনে যোগাযোগ করুন, আমরা সাহায্য করব।', 'Message us on WhatsApp or call, we are happy to help.'],
    'h.call': ['কল করুন', 'Call us'],
    'aria.products': ['পণ্যের তালিকা', 'Product list'],
    'p.price': ['[দাম]', '[price]'],
    'aria.prev': ['আগের ছবি', 'Previous photo'],
    'aria.next': ['পরের ছবি', 'Next photo'],
    'aria.photos': ['প্রোডাক্টের ছবি', 'Product photos'],
    'aria.thumbs': ['ছবি বাছুন', 'Choose a photo'],
    'aria.dec': ['কমান', 'Decrease'],
    'aria.inc': ['বাড়ান', 'Increase'],
    'g.photo': ['ছবি {n}', 'Photo {n}'],
    'g.boxPhoto': ['বক্সে যা আছে ছবি', 'What’s in the box photo'],
    'g.photoOf': ['{label} ছবি', '{label} photo'],
    'rating.placeholder': ['[রেটিং] — [সংখ্যা]টি যাচাইকৃত রিভিউ', '[rating] — [number] verified reviews'],
    'rating.text': ['{r} — {n}টি রিভিউ', '{r} — {n} reviews'],

    'acc.how': ['কীভাবে কাজ করে?', 'How does it work?'],
    'acc.howBody': ["বেল্টটি তলপেটে পরে নিন। পাওয়ার বাটন ৩ সেকেন্ড চেপে ধরে চালু করুন — ৩–৬ সেকেন্ডে গরম হয়ে যায়। হিট বাটন দিয়ে ৩টি হিট লেভেলের একটি বেছে নিন (সর্বোচ্চ ৫২°C), ভাইব্রেশন বাটন দিয়ে ম্যাসাজ চালু করে M1–M4 চারটি মোড বদলান। LCD ডিসপ্লেতে তাপ, মোড ও ব্যাটারির চার্জ দেখা যায়। বন্ধ করতে আবার ৩ সেকেন্ড চেপে ধরুন।", "Wear the belt over your lower belly. Hold the power button for 3 seconds to switch on — it warms up in 3–6 seconds. Use the heat button to choose one of 3 heat levels (up to 52°C), and the vibration button to start the massage and switch between 4 modes (M1–M4). The LCD shows the heat, the mode and the battery charge. Hold for 3 seconds again to switch off."],
    'acc.box': ['বক্সে কী কী থাকছে?', 'What’s in the box?'],
    'acc.boxBody': ["হিটিং বেল্ট, USB চার্জিং কেবল ও ব্যবহারের নির্দেশিকা — একটি গিফট বক্সে।", "Heating belt, USB charging cable and instruction leaflet — in a gift box."],
    'acc.specs': ['স্পেসিফিকেশন', 'Specifications'],
    'acc.specsBody': ["হিট লেভেল: ৩টি, সর্বোচ্চ ৫২°C · গরম হয়: ৩–৬ সেকেন্ডে, সেফটি চিপসহ · ভাইব্রেশন ম্যাসাজ: ৪ মোড (M1–M4) · LCD ডিসপ্লে: তাপ, মোড ও ব্যাটারি · ব্যাটারি: পুরো চার্জে ২–৩ ঘণ্টা, USB রিচার্জেবল · চালু/বন্ধ: ৩ সেকেন্ড চেপে ধরুন · প্যাডের মাপ: ২২ × ১২ × ৬ সেমি · বেল্ট: নরম ফেব্রিক, অ্যাডজাস্টেবল ইলাস্টিক স্ট্র্যাপ, কোমর ৫০ ইঞ্চি পর্যন্ত · রং: পিংক · প্যাকেজিং: গিফট বক্স · তৈরি: চীন · [পুরো চার্জ হতে কত সময় লাগে]", "Heat levels: 3, up to 52°C · Warms up: in 3–6 seconds, with safety chip · Vibration massage: 4 modes (M1–M4) · LCD display: heat, mode and battery · Battery: 2–3 hours per full charge, USB rechargeable · On/off: hold 3 seconds · Pad size: 22 × 12 × 6 cm · Belt: soft fabric, adjustable elastic strap, waists up to 50 inches · Colour: pink · Packaging: gift box · Made in: China · [full charging time]"],
    'acc.delivery': ['ডেলিভারি', 'Delivery'],
    'acc.deliveryBody': ['সারাদেশে ফ্রি ডেলিভারি। ঢাকার ভেতরে ১–২ কার্যদিবস, ঢাকার বাইরে ২–৪ কার্যদিবস (ফোনে অর্ডার কনফার্ম হওয়ার পর থেকে)। ঢাকায় পুরো টাকা পণ্য হাতে পেয়ে; ঢাকার বাইরে ৳২০০ অগ্রিম, বাকিটা হাতে পেয়ে। <a href="delivery.html">বিস্তারিত ডেলিভারি পলিসি →</a>', 'Free delivery across Bangladesh. Inside Dhaka 1–2 working days, outside Dhaka 2–4 working days (from phone confirmation). Dhaka pays in full on delivery; outside Dhaka pays a ৳200 advance and the rest on delivery. <a href="delivery.html">Full delivery policy →</a>'],
    'acc.refund': ['রিটার্ন ও রিফান্ড পলিসি', 'Returns & refund policy'],
    'acc.refundBody': ['ডেলিভারিম্যানের সামনে খুলে দেখে নিন: ভাঙা, ভুল বা কিছু কম থাকলে তখনই ফেরত দিন, কোনো টাকা লাগবে না। হাতে পাওয়ার ৭ দিনের মধ্যে উৎপাদনগত ত্রুটি (গরম না হওয়া, চার্জ না হওয়া) হলে বিনামূল্যে নতুন বেল্ট। শরীরে পরার পণ্য বলে স্বাস্থ্যবিধির কারণে মত পরিবর্তনে ফেরত নেওয়া হয় না। <a href="refund.html">বিস্তারিত রিফান্ড পলিসি →</a>', 'Open and check it in front of the delivery person: if it is broken, wrong or incomplete, refuse it and pay nothing. A manufacturing defect (not heating, not charging) within 7 days of delivery gets a free new belt. As it is worn against the body, change-of-mind returns are not accepted for hygiene reasons. <a href="refund.html">Full refund policy →</a>'],

    /* ---------- scroll-expansion showcase ---------- */
    'exp.aria': ['Bakaina ভিডিও', 'Bakaina video'],
    'exp.left': ['আরামের', 'Warmth'],
    'exp.right': ['উষ্ণতা', 'on the go'],
    'exp.hint': ['স্ক্রল করুন ↓', 'Scroll ↓'],
    'exp.ph': ['এখানে প্রোডাক্ট ভিডিও দিন', 'Add your product video here'],
    'exp.phSub': ['config.js → showcase', 'config.js → showcase'],

    /* ---------- lifestyle / why / stats ---------- */
    'life.ph': ['লাইফস্টাইল ছবি: প্যাড পরে আরাম করছেন এমন একজন নারী', 'Lifestyle photo: a woman relaxing while wearing the pad'],
    'life.kicker': ['পরিচিত হোন BAKAINA হিটিং ম্যাসাজ বেল্টের সাথে', 'MEET THE BAKAINA HEATING & MASSAGE BELT'],
    'life.title': ['পিরিয়ডের ব্যথাকে বিদায় বলুন', 'Say goodbye to period pain'],
    'life.body': ['ব্যথা যেখানে, ঠিক সেখানেই পান শান্ত, স্থির উষ্ণতা। Bakaina মৃদু তাপের সাথে আরামদায়ক ম্যাসাজ মিলিয়ে দেয়, যাতে মাসের সবচেয়ে কঠিন দিনগুলোও পার করতে পারেন — বিছানায় পড়ে না থেকে, বারবার পেইনকিলার না খেয়ে।',
                  'Get calm, steady warmth exactly where it hurts. Bakaina pairs gentle heat with a soothing massage, so you can get through the hardest days of the month — without staying in bed or reaching for painkillers again and again.'],
    'why.title': ['Bakaina কেন সবার পছন্দ', 'Why everyone loves Bakaina'],
    'why.ph1': ["ছবি: LCD ডিসপ্লে ও হিট লেভেল", "Photo: LCD display and heat levels"],
    'why.ph2': ["ছবি: বেল্ট পরা অবস্থায়", "Photo: the belt being worn"],
    'why.ph3': ["ছবি: হ্যান্ডব্যাগে বেল্ট", "Photo: the belt in a handbag"],
    'why.h1': ["কয়েক সেকেন্ডে গরম, ৩ লেভেলের তাপ", "Warm in seconds, 3 heat levels"],
    'why.p1': ["সেফটি চিপসহ হিটিং প্যাড চালু করার ৩–৬ সেকেন্ডেই গরম হয়। ডিসপ্লে দেখে ৩টি হিট লেভেলের মধ্যে পছন্দেরটি বেছে নিন (সর্বোচ্চ ৫২°C), সাথে চাইলে ৪ মোডের ভাইব্রেশন ম্যাসাজ।", "The heating pad, with a safety chip, warms up 3–6 seconds after you switch it on. Check the display and pick one of 3 heat levels (up to 52°C), with 4-mode vibration massage if you like."],
    'why.h2': ["অটো শাট-অফে নিশ্চিন্ত", "Peace of mind with auto shut-off"],
    'why.p2': ["অটো শাট-অফ টাইমার নির্দিষ্ট সময় পর বেল্ট বন্ধ করে দেয়, তাই অতিরিক্ত গরম হওয়ার ভয় কম আর চার্জও বাঁচে।", "The auto shut-off timer turns the belt off after a set time, helping prevent overheating and saving battery."],
    'why.h3': ["হালকা, পোর্টেবল, অ্যাডজাস্টেবল", "Light, portable, adjustable"],
    'why.p3': ["নরম কাপড়ের বেল্ট ৫০ ইঞ্চি পর্যন্ত কোমরে অ্যাডজাস্ট করা যায়। হালকা ও ছোট (প্যাড ২২ × ১২ সেমি), তাই হ্যান্ডব্যাগে রেখে অফিস, ভ্রমণ বা বাসা — সবখানে ব্যবহার করুন।", "The soft fabric belt adjusts to fit waists up to 50 inches. Light and compact (the pad is 22 × 12 cm), so it fits in your handbag for the office, travel or home."],
    'aria.stats': ['এক নজরে', 'At a glance'],

    /* ---------- reviews ---------- */
    'rev.title': ['সত্যিকারের ক্রেতা, সত্যিকারের আরাম', 'Real customers, real comfort'],
    'rev.subPh': ['আপনার স্টোরের যাচাইকৃত রিভিউ ও ক্রেতাদের ছবি এখানে যোগ করুন।', 'Add your store’s verified reviews and customer photos here.'],
    'rev.subReal': ['আমাদের ক্রেতাদের অভিজ্ঞতা।', 'What our customers say.'],
    'rev.chip': ['ক্রেতা', 'Customer'],          // "verified" is only for reviews checked against a delivered order
    'rev.photo': ['ক্রেতার ছবি', 'Customer photo'],
    'rev.photoOf': ['{name}-এর ছবি', 'Photo from {name}'],
    'rev.phName': ['[ক্রেতার নাম]', '[customer name]'],
    'rev.phText': ['[এখানে আসল ক্রেতার রিভিউ দিন — ভালো হয় যদি তাতে সমস্যা আর ফলাফল দুটোই উল্লেখ থাকে।]', '[Add a real customer review here — ideally one that mentions both the problem and the result.]'],
    'rev.stars': ['{n} স্টার', '{n} stars'],

    /* ---------- FAQ / newsletter ---------- */
    'faq.title': ['প্রশ্ন আছে? উত্তর আমাদের কাছে!', 'Got questions? We’ve got answers!'],
    'faq.q1': ['পিরিয়ডের ব্যথায় Bakaina কীভাবে কাজ করে?', 'How does Bakaina help with period pain?'],
    'faq.a1': ['তাপ জরায়ুর পেশি শিথিল করে ও রক্তপ্রবাহ বাড়ায়, ফলে ক্র্যাম্প কমে। Bakaina চলাফেরার মধ্যেও সেই তাপ দেয়, সাথে বাড়তি আরামের জন্য ম্যাসাজ।', 'Heat relaxes the uterine muscles and boosts blood flow, which eases cramps. Bakaina gives you that heat on the move, plus massage for extra comfort.'],
    'faq.q2': ['ব্যাটারি কতক্ষণ চলে?', 'How long does the battery last?'],
    'faq.a2': ["একবার পুরো চার্জে ২–৩ ঘণ্টা চলে — তাপ ও ম্যাসাজের লেভেল যত বেশি, তত তাড়াতাড়ি চার্জ শেষ হয়। [পুরো চার্জ হতে কত সময় লাগে, লিখুন]", "About 2–3 hours on a full charge — higher heat and massage levels use the battery faster. [Add how long a full charge takes]"],
    'faq.q3': ["প্যাড কতটা গরম হয়?", "How hot does it get?"],
    'faq.a3': ["৩টি হিট লেভেল আছে, সর্বোচ্চ ৫২°C পর্যন্ত। প্রথমবার সবচেয়ে কম লেভেল দিয়ে শুরু করুন, আরাম অনুযায়ী বাড়ান।", "There are 3 heat levels, up to 52°C. Start on the lowest level the first time and go up as feels comfortable."],
    'faq.q5': ["অনেকক্ষণ চালু থাকলে কি বেশি গরম হয়ে যাবে?", "Will it overheat if I leave it on?"],
    'faq.a5': ["না — এতে অটো শাট-অফ টাইমার আছে, নির্দিষ্ট সময় পর নিজে থেকেই বন্ধ হয়ে যায়। [টাইমার কত মিনিটের, সাপ্লায়ার থেকে জেনে লিখুন]", "It has an auto shut-off timer that switches it off by itself after a set time. [Add how many minutes the timer lasts, from your supplier]"],
    'faq.q6': ["কীভাবে চার্জ দেব?", "How do I charge it?"],
    'faq.a6': ["বক্সে থাকা USB চার্জিং কেবল দিয়ে চার্জ দিন। ডিসপ্লের ব্যাটারি আইকনে চার্জ কতটা আছে দেখা যায়। [পুরো চার্জ হতে কত সময় লাগে, লিখুন]", "Use the USB charging cable in the box. The battery icon on the display shows how much charge is left. [Add how long a full charge takes]"],
    'faq.q4': ['সরাসরি ত্বকের উপর ব্যবহার করা যাবে?', 'Can I use it directly on my skin?'],
    'faq.a4': ["বেল্টটি নরম কাপড়ের তৈরি, তবে পাতলা জামার উপর ব্যবহার করাই সবচেয়ে নিরাপদ — বিশেষ করে সর্বোচ্চ লেভেলে। ত্বক লাল হলে বা অস্বস্তি লাগলে সাথে সাথে বন্ধ করুন।", "The belt is soft fabric, but it’s safest to wear it over a thin layer of clothing — especially on the highest level. If your skin turns red or feels uncomfortable, switch it off straight away."],
    'news.title': ['আমাদের ইমেইল সাবস্ক্রাইব করুন', 'Subscribe to our emails'],
    'news.sub': ['নতুন কালেকশন আর এক্সক্লুসিভ অফারের খবর সবার আগে পান।', 'Be the first to hear about new collections and exclusive offers.'],
    'news.email': ['ইমেইল', 'Email'],
    'news.btn': ['সাবস্ক্রাইব', 'Subscribe'],
    'news.bad': ['সঠিক ইমেইল দিন।', 'Please enter a valid email.'],
    'news.ok': ['ধন্যবাদ! সাবস্ক্রাইব সম্পন্ন হয়েছে।', 'Thanks! You’re subscribed.'],

    /* ---------- toasts ---------- */
    'toast.added': ['কার্টে যোগ হয়েছে', 'Added to cart'],
    'toast.empty': ['কার্ট খালি', 'Your cart is empty'],
    'toast.oneColor': ['একবারে একটি রং — বাকিগুলো পরের অর্ডারে বা WhatsApp-এ', 'One colour per order — order the others separately or on WhatsApp'],

    /* ---------- checkout ---------- */
    'co.title': ['অর্ডার করুন', 'Place your order'],
    'co.intro': ['ফর্মটি পূরণ করুন, আমাদের প্রতিনিধি কল করে অর্ডার কনফার্ম করবেন।', 'Fill in the form and our team will call you to confirm your order.'],
    'co.step1': ['১. পণ্য নির্বাচন', '1. Choose your product'],
    'co.qty': ['পরিমাণ', 'Quantity'],
    'co.step2': ['২. আপনার তথ্য', '2. Your details'],
    'co.name': ['নাম', 'Name'],
    'co.namePh': ['আপনার পুরো নাম', 'Your full name'],
    'co.nameErr': ['অনুগ্রহ করে আপনার নাম লিখুন।', 'Please enter your name.'],
    'co.phone': ['মোবাইল নম্বর', 'Mobile number'],
    'co.phoneErr': ['সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন 017XXXXXXXX)।', 'Enter a valid 11-digit mobile number (e.g. 017XXXXXXXX).'],
    'co.area': ['ডেলিভারি এলাকা', 'Delivery area'],
    'co.inside': ['ঢাকার ভেতরে', 'Inside Dhaka'],
    'co.outside': ['ঢাকার বাইরে', 'Outside Dhaka'],
    'co.areaErr': ['ডেলিভারি এলাকা নির্বাচন করুন।', 'Please choose a delivery area.'],
    'co.district': ['জেলা', 'District'],
    'co.districtSel': ['জেলা নির্বাচন করুন', 'Select your district'],
    'co.districtErr': ['আপনার জেলা নির্বাচন করুন।', 'Please choose your district.'],
    'co.address': ['সম্পূর্ণ ঠিকানা', 'Full address'],
    'co.addressPh': ['বাসা/হোল্ডিং, রোড, এলাকা, থানা', 'House, road, area, thana'],
    'co.addressErr': ['বাসা নম্বর, রোড, এলাকা ও থানাসহ ঠিকানা লিখুন।', 'Enter your address with house no., road, area and thana.'],
    'co.note': ['নোট', 'Note'],
    'co.optional': ['(ঐচ্ছিক)', '(optional)'],
    'co.notePh': ['যেমন: ডেলিভারির আগে কল দিবেন', 'e.g. Please call before delivery'],
    'co.step3': ['৩. পেমেন্ট', '3. Payment'],
    'co.payHint': ['ডেলিভারি এলাকা নির্বাচন করলে পেমেন্টের নিয়ম দেখাবে।', 'Choose a delivery area to see how payment works.'],
    'co.cod': ['✅ ক্যাশ অন ডেলিভারি — পণ্য হাতে পেয়ে পুরো মূল্য পরিশোধ করবেন।', '✅ Cash on delivery — pay the full amount when your order arrives.'],
    'co.bkash': ["অর্ডার কনফার্ম করতে <strong data-advance></strong> অগ্রিম পাঠান (Send Money) — বিকাশ, নগদ, উপায় বা রকেট:", "To confirm your order, send a <strong data-advance></strong> advance (Send Money) by bKash, Nagad, Upay or Rocket:"],
    'co.bkashNote': ['এই টাকা মোট মূল্য থেকে বাদ যাবে। বাকি টাকা পণ্য হাতে পেয়ে দিবেন।', 'This is deducted from the total. Pay the rest when your order arrives.'],
    'co.copy': ['কপি', 'Copy'],
    'co.copied': ['কপি হয়েছে ✓', 'Copied ✓'],
    'co.payMethod': ["কোন মাধ্যমে পাঠিয়েছেন?", "Which wallet did you use?"],
    'co.payMethodErr': ["বিকাশ, নগদ, উপায় বা রকেট — একটি বেছে নিন।", "Choose bKash, Nagad, Upay or Rocket."],
    'co.trx': ["ট্রানজেকশন আইডি", "Transaction ID"],
    'co.trxPh': ['যেমন 9A7B6C5D4E', 'e.g. 9A7B6C5D4E'],
    'co.trxErr': ["পেমেন্টের মেসেজে পাওয়া ট্রানজেকশন আইডি দিন (৮-১২ অক্ষর)।", "Enter the transaction ID from your payment message (8–12 characters)."],
    'co.summary': ['অর্ডার সারাংশ', 'Order summary'],
    'co.submit': ['অর্ডার কনফার্ম করুন', 'Confirm order'],
    'co.secure': ['🔒 আপনার তথ্য শুধু অর্ডার ও ডেলিভারির জন্য ব্যবহার করা হবে। অর্ডার শেষ না করলে সাহায্যের জন্য আমরা একবার কল করতে পারি। <a href="privacy.html">প্রাইভেসি পলিসি</a>', '🔒 Your details are only used for your order and delivery. If you don\'t finish, we may call once to help. <a href="privacy.html">Privacy policy</a>'],
    'co.due': ['পণ্য হাতে পেয়ে দিবেন', 'Pay on delivery'],
    'co.orderNow': ['এখনই অর্ডার করুন', 'Order now'],
    'co.subtotal': ['সাবটোটাল', 'Subtotal'],
    'co.delivery': ['ডেলিভারি চার্জ', 'Delivery'],
    'co.free': ['ফ্রি', 'Free'],
    'co.advance': ["অগ্রিম পেমেন্ট", "Advance payment"],
    'co.priceSoon': ['দাম শীঘ্রই', 'Price coming soon'],
    'co.unpricedBox': ['দাম শীঘ্রই যোগ করা হবে। এখনই অর্ডার করতে কল বা WhatsApp করুন:', 'Price coming soon. To order now, call or WhatsApp:'],
    'co.unpricedErr': ['দাম এখনও সেট করা হয়নি। কল বা WhatsApp-এ অর্ডার করুন: {phone}', 'The price isn’t set yet. Please order by phone or WhatsApp: {phone}'],
    'co.noServer': ['অর্ডার সার্ভার এখনও সেট করা হয়নি (config.js → appsScriptUrl)।', 'The order server isn’t set up yet (config.js → appsScriptUrl).'],
    'co.failed': ['অর্ডার নেওয়া যায়নি', 'Could not place the order'],
    'co.serverErr': ['অর্ডার নেওয়া যায়নি। তথ্যগুলো আবার দেখে চেষ্টা করুন, অথবা WhatsApp-এ অর্ডার করুন।', 'We couldn’t place your order. Please check your details and try again, or order on WhatsApp.'],
    'co.network': ['নেটওয়ার্ক সমস্যা হয়েছে। আবার চেষ্টা করুন, অথবা WhatsApp-এ অর্ডার করুন।', 'Network problem. Please try again, or order on WhatsApp.'],
    'co.sending': ['অর্ডার পাঠানো হচ্ছে…', 'Placing your order…'],
    'co.dhakaCity': ['ঢাকা (সিটি)', 'ঢাকা (সিটি)'],

    /* ---------- thank you ---------- */
    'ty.title': ['জাযাকাল্লাহু খাইরান!', 'Thank you!'],
    'ty.received': ['আপনার অর্ডারটি আমরা পেয়েছি।', 'We’ve received your order.'],
    'ty.orderId': ['অর্ডার আইডি', 'Order ID'],
    'ty.call': ['আমাদের প্রতিনিধি শীঘ্রই কল করে অর্ডার কনফার্ম করবেন।', 'Our team will call you shortly to confirm your order.'],
    'ty.hint': ['অনুগ্রহ করে ফোনটি কাছে রাখুন। দ্রুত কনফার্ম করতে চাইলে WhatsApp-এ মেসেজ দিন।', 'Please keep your phone nearby. To confirm faster, message us on WhatsApp.'],
    'ty.wa': ['WhatsApp-এ অর্ডার কনফার্ম করুন', 'Confirm on WhatsApp'],
    'ty.home': ['হোমপেজে ফিরে যান', 'Back to home'],
    'ty.product': ['পণ্য', 'Product'],
    'ty.total': ['মোট মূল্য', 'Total'],
    'ty.delivery': ['ডেলিভারি', 'Delivery'],
    'ty.waText': ['আসসালামু আলাইকুম, আমার অর্ডার আইডি {id}। অর্ডারটি কনফার্ম করতে চাই।', 'Hi, my order ID is {id}. I’d like to confirm my order.'],
    'wa.hello': ['আসসালামু আলাইকুম, আমি Bakaina-এর পণ্য সম্পর্কে জানতে চাই।', 'Hi, I’d like to know more about Bakaina.'],
  };

  // English district names, same order as the Bangla list in shop.js
  var DISTRICTS_EN = {
    'বাগেরহাট':'Bagerhat','বান্দরবান':'Bandarban','বরগুনা':'Barguna','বরিশাল':'Barishal','ভোলা':'Bhola','বগুড়া':'Bogura','ব্রাহ্মণবাড়িয়া':'Brahmanbaria','চাঁদপুর':'Chandpur','চাঁপাইনবাবগঞ্জ':'Chapainawabganj','চট্টগ্রাম':'Chattogram','চুয়াডাঙ্গা':'Chuadanga','কুমিল্লা':'Cumilla','কক্সবাজার':'Cox’s Bazar','ঢাকা':'Dhaka','দিনাজপুর':'Dinajpur','ফরিদপুর':'Faridpur','ফেনী':'Feni','গাইবান্ধা':'Gaibandha','গাজীপুর':'Gazipur','গোপালগঞ্জ':'Gopalganj','হবিগঞ্জ':'Habiganj','জামালপুর':'Jamalpur','যশোর':'Jashore','ঝালকাঠি':'Jhalokati','ঝিনাইদহ':'Jhenaidah','জয়পুরহাট':'Joypurhat','খাগড়াছড়ি':'Khagrachhari','খুলনা':'Khulna','কিশোরগঞ্জ':'Kishoreganj','কুড়িগ্রাম':'Kurigram','কুষ্টিয়া':'Kushtia','লক্ষ্মীপুর':'Lakshmipur','লালমনিরহাট':'Lalmonirhat','মাদারীপুর':'Madaripur','মাগুরা':'Magura','মানিকগঞ্জ':'Manikganj','মেহেরপুর':'Meherpur','মৌলভীবাজার':'Moulvibazar','মুন্সিগঞ্জ':'Munshiganj','ময়মনসিংহ':'Mymensingh','নওগাঁ':'Naogaon','নড়াইল':'Narail','নারায়ণগঞ্জ':'Narayanganj','নরসিংদী':'Narsingdi','নাটোর':'Natore','নেত্রকোনা':'Netrokona','নীলফামারী':'Nilphamari','নোয়াখালী':'Noakhali','পাবনা':'Pabna','পঞ্চগড়':'Panchagarh','পটুয়াখালী':'Patuakhali','পিরোজপুর':'Pirojpur','রাজবাড়ী':'Rajbari','রাজশাহী':'Rajshahi','রাঙ্গামাটি':'Rangamati','রংপুর':'Rangpur','সাতক্ষীরা':'Satkhira','শরীয়তপুর':'Shariatpur','শেরপুর':'Sherpur','সিরাজগঞ্জ':'Sirajganj','সুনামগঞ্জ':'Sunamganj','সিলেট':'Sylhet','টাঙ্গাইল':'Tangail','ঠাকুরগাঁও':'Thakurgaon'
  };

  var BN = '০১২৩৪৫৬৭৮৯';
  function t(key, vars) {
    var pair = D[key];
    var s = pair ? pair[lang === 'en' ? 1 : 0] : key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }
  function num(s) {
    s = String(s);
    return lang === 'bn' ? s.replace(/\d/g, function (d) { return BN[d]; }) : s.replace(/[০-৯]/g, function (d) { return BN.indexOf(d); });
  }
  // Pick the English variant of a config value when present: pick(obj, 'name') → obj.name_en in EN
  function pick(obj, field) {
    if (!obj) return '';
    return lang === 'en' && obj[field + '_en'] ? obj[field + '_en'] : obj[field];
  }

  function apply(root) {
    root = root || document;
    var all = function (sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); };
    all('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    all('[data-i18n-html]').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    all('[data-i18n-ph]').forEach(function (el) { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); });
    all('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    all('[data-i18n-title]').forEach(function (el) { el.setAttribute('title', t(el.getAttribute('data-i18n-title'))); });
    document.documentElement.lang = lang;
    var docKey = document.documentElement.getAttribute('data-doc-title');
    if (docKey) document.title = t(docKey);
    all('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function set(next) {
    if (next === lang) return;
    try { localStorage.setItem(KEY, next); } catch (e) {}
    // Reload so every part of the page (including JS-rendered parts) re-renders in the new language.
    // Drop a ?lang= override so the saved choice wins.
    var u = new URL(location.href); u.searchParams.delete('lang');
    if (u.href === location.href) location.reload(); else location.replace(u.href);
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-lang]');
    if (b) { e.preventDefault(); set(b.getAttribute('data-lang')); }
  });

  window.I18N = { lang: lang, t: t, num: num, pick: pick, apply: apply, set: set, district: function (bn) { return lang === 'en' ? (DISTRICTS_EN[bn] || bn) : bn; } };
  apply();
})();
