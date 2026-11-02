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
    'doc.product': ['WarmLune™ স্মার্ট পিরিয়ড হিটিং প্যাড', 'WarmLune™ Smart Period Heating Pad'],
    'doc.checkout': ['অর্ডার করুন | WarmLune', 'Checkout | WarmLune'],
    'doc.thanks': ['ধন্যবাদ! অর্ডার সম্পন্ন | WarmLune', 'Thank you! Order received | WarmLune'],

    /* ---------- header / footer ---------- */
    'nav.home': ['হোম', 'Home'],
    'nav.buy': ['হিটিং প্যাড কিনুন', 'Shop the pad'],
    'nav.faq': ['প্রশ্নোত্তর', 'FAQ'],
    'nav.contact': ['যোগাযোগ', 'Contact'],
    'nav.track': ['অর্ডার ট্র্যাক করুন', 'Track order'],
    'aria.cart': ['কার্ট', 'Cart'],
    'aria.home': ['WarmLune হোম', 'WarmLune home'],
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
    'p.title': ['WarmLune™ স্মার্ট পিরিয়ড হিটিং প্যাড', 'WarmLune™ Smart Period Heating Pad'],
    'p.lead': ["প্রতি মাসে পিরিয়ডের ব্যথায় পুরো দিন নষ্ট হয়? WarmLune একটি তারবিহীন হিটিং বেল্ট — চালু করার কয়েক সেকেন্ডেই গরম হয়, ৩ লেভেলের তাপ (৫০°C, ৫৫°C, ৬০°C) আর ৪ মোডের ভাইব্রেশন ম্যাসাজ, সব দেখা যায় LCD ডিসপ্লেতে। একবার চার্জে ২–৩ ঘণ্টা চলে, তাই বাসা, অফিস বা ভ্রমণে সাথে রাখুন।", "Do period cramps wreck a whole day every month? WarmLune is a wireless heating belt — it warms up within seconds of switching on, with 3 heat levels (50°C, 55°C, 60°C) and 4 vibration massage modes, all shown on the LCD display. 2–3 hours per charge, so take it to the office, on trips or keep it at home."],
    'p.c1': ["৩ লেভেলের তাপ — ৫০°C, ৫৫°C, ৬০°C", "3 heat levels — 50°C, 55°C, 60°C"],
    'p.c2': ["অটো শাট-অফ টাইমার — অতিরিক্ত গরম হওয়া রোধ করে", "Auto shut-off timer helps prevent overheating"],
    'p.c3': ["তারবিহীন ও রিচার্জেবল — হ্যান্ডব্যাগেই নিয়ে যান", "Wireless and rechargeable — fits in your handbag"],
    'p.c4': ["সুন্দর গিফট বক্সে — উপহার দেওয়ার জন্য আদর্শ", "Comes in a pretty gift box — perfect as a present"],
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
    'p.perk2': ['৩০ দিনের মানি-ব্যাক গ্যারান্টি', '30-day money-back guarantee'],
    'p.perk3': ['ঝামেলাহীন রিটার্ন', 'Hassle-free returns'],
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
    'acc.howBody': ["বেল্টটি তলপেটে পরে নিন। পাওয়ার বাটন ৩ সেকেন্ড চেপে ধরে চালু করুন — ৩–৬ সেকেন্ডে গরম হয়ে যায়। হিট বাটন দিয়ে ৫০°C, ৫৫°C বা ৬০°C বেছে নিন, ভাইব্রেশন বাটন দিয়ে ম্যাসাজ চালু করে M1–M4 চারটি মোড বদলান। LCD ডিসপ্লেতে তাপ, মোড ও ব্যাটারির চার্জ দেখা যায়। বন্ধ করতে আবার ৩ সেকেন্ড চেপে ধরুন।", "Wear the belt over your lower belly. Hold the power button for 3 seconds to switch on — it warms up in 3–6 seconds. Use the heat button to choose 50°C, 55°C or 60°C, and the vibration button to start the massage and switch between 4 modes (M1–M4). The LCD shows the heat, the mode and the battery charge. Hold for 3 seconds again to switch off."],
    'acc.box': ['বক্সে কী কী থাকছে?', 'What’s in the box?'],
    'acc.boxBody': ["হিটিং বেল্ট, USB চার্জিং কেবল ও ব্যবহারের নির্দেশিকা — একটি গিফট বক্সে।", "Heating belt, USB charging cable and instruction leaflet — in a gift box."],
    'acc.specs': ['স্পেসিফিকেশন', 'Specifications'],
    'acc.specsBody': ["হিট লেভেল: ৩টি — ৫০°C / ৫৫°C / ৬০°C · গরম হয়: ৩–৬ সেকেন্ডে, সেফটি চিপসহ · ভাইব্রেশন ম্যাসাজ: ৪ মোড (M1–M4) · LCD ডিসপ্লে: তাপ, মোড ও ব্যাটারি · ব্যাটারি: পুরো চার্জে ২–৩ ঘণ্টা, USB রিচার্জেবল · চালু/বন্ধ: ৩ সেকেন্ড চেপে ধরুন · প্যাডের মাপ: ২২ × ১২ × ৬ সেমি · বেল্ট: নরম কাপড়, কোমর ৫০ ইঞ্চি পর্যন্ত অ্যাডজাস্টেবল · রং: পিংক · প্যাকেজিং: গিফট বক্স · তৈরি: চীন · [পুরো চার্জ হতে কত সময় লাগে]", "Heat levels: 3 — 50°C / 55°C / 60°C · Warms up: in 3–6 seconds, with safety chip · Vibration massage: 4 modes (M1–M4) · LCD display: heat, mode and battery · Battery: 2–3 hours per full charge, USB rechargeable · On/off: hold 3 seconds · Pad size: 22 × 12 × 6 cm · Belt: soft fabric, adjustable up to a 50-inch waist · Colour: pink · Packaging: gift box · Made in: China · [full charging time]"],
    'acc.delivery': ['ডেলিভারি', 'Delivery'],
    'acc.deliveryBody': ['[ডেলিভারি সময় ও এলাকা লিখুন — যেমন ঢাকায় ১-২ দিন, ঢাকার বাইরে ৩-৫ দিন]', '[Delivery times and areas — e.g. Dhaka 1–2 days, outside Dhaka 3–5 days]'],
    'acc.refund': ['রিটার্ন ও রিফান্ড পলিসি', 'Returns & refund policy'],
    'acc.refundBody': ['[৩০ দিনের মানি-ব্যাক গ্যারান্টির শর্তগুলো এখানে লিখুন]', '[Write the terms of the 30-day money-back guarantee here]'],

    /* ---------- scroll-expansion showcase ---------- */
    'exp.aria': ['WarmLune ভিডিও', 'WarmLune video'],
    'exp.left': ['আরামের', 'Warmth'],
    'exp.right': ['উষ্ণতা', 'on the go'],
    'exp.hint': ['স্ক্রল করুন ↓', 'Scroll ↓'],
    'exp.ph': ['এখানে প্রোডাক্ট ভিডিও দিন', 'Add your product video here'],
    'exp.phSub': ['config.js → showcase', 'config.js → showcase'],

    /* ---------- lifestyle / why / stats ---------- */
    'life.ph': ['লাইফস্টাইল ছবি: প্যাড পরে আরাম করছেন এমন একজন নারী', 'Lifestyle photo: a woman relaxing while wearing the pad'],
    'life.kicker': ['পরিচিত হোন WARMLUNE™ হিটিং প্যাডের সাথে', 'MEET THE WARMLUNE™ HEATING PAD'],
    'life.title': ['পিরিয়ডের ব্যথাকে বিদায় বলুন', 'Say goodbye to period pain'],
    'life.body': ['ব্যথা যেখানে, ঠিক সেখানেই পান শান্ত, স্থির উষ্ণতা। WarmLune মৃদু তাপের সাথে আরামদায়ক ম্যাসাজ মিলিয়ে দেয়, যাতে মাসের সবচেয়ে কঠিন দিনগুলোও পার করতে পারেন — বিছানায় পড়ে না থেকে, বারবার পেইনকিলার না খেয়ে।',
                  'Get calm, steady warmth exactly where it hurts. WarmLune pairs gentle heat with a soothing massage, so you can get through the hardest days of the month — without staying in bed or reaching for painkillers again and again.'],
    'why.title': ['WarmLune কেন সবার পছন্দ', 'Why everyone loves WarmLune'],
    'why.ph1': ["ছবি: LCD ডিসপ্লে ও হিট লেভেল", "Photo: LCD display and heat levels"],
    'why.ph2': ["ছবি: বেল্ট পরা অবস্থায়", "Photo: the belt being worn"],
    'why.ph3': ["ছবি: হ্যান্ডব্যাগে বেল্ট", "Photo: the belt in a handbag"],
    'why.h1': ["কয়েক সেকেন্ডে গরম, ৩ লেভেলের তাপ", "Warm in seconds, 3 heat levels"],
    'why.p1': ["সেফটি চিপসহ হিটিং প্যাড চালু করার ৩–৬ সেকেন্ডেই গরম হয়। ডিসপ্লে দেখে ৫০°C, ৫৫°C বা ৬০°C বেছে নিন, সাথে চাইলে ৪ মোডের ভাইব্রেশন ম্যাসাজ।", "The heating pad, with a safety chip, warms up 3–6 seconds after you switch it on. Check the display and choose 50°C, 55°C or 60°C, with 4-mode vibration massage if you like."],
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
    'faq.q1': ['পিরিয়ডের ব্যথায় WarmLune কীভাবে কাজ করে?', 'How does WarmLune help with period pain?'],
    'faq.a1': ['তাপ জরায়ুর পেশি শিথিল করে ও রক্তপ্রবাহ বাড়ায়, ফলে ক্র্যাম্প কমে। WarmLune চলাফেরার মধ্যেও সেই তাপ দেয়, সাথে বাড়তি আরামের জন্য ম্যাসাজ।', 'Heat relaxes the uterine muscles and boosts blood flow, which eases cramps. WarmLune gives you that heat on the move, plus massage for extra comfort.'],
    'faq.q2': ['ব্যাটারি কতক্ষণ চলে?', 'How long does the battery last?'],
    'faq.a2': ["একবার পুরো চার্জে ২–৩ ঘণ্টা চলে — তাপ ও ম্যাসাজের লেভেল যত বেশি, তত তাড়াতাড়ি চার্জ শেষ হয়। [পুরো চার্জ হতে কত সময় লাগে, লিখুন]", "About 2–3 hours on a full charge — higher heat and massage levels use the battery faster. [Add how long a full charge takes]"],
    'faq.q3': ["প্যাড কতটা গরম হয়?", "How hot does it get?"],
    'faq.a3': ["তিনটি লেভেল আছে — ৫০°C, ৫৫°C ও ৬০°C। প্রথমবার ৫০°C দিয়ে শুরু করুন, আরাম অনুযায়ী বাড়ান।", "There are three levels — 50°C, 55°C and 60°C. Start on 50°C the first time and go up as feels comfortable."],
    'faq.q5': ["অনেকক্ষণ চালু থাকলে কি বেশি গরম হয়ে যাবে?", "Will it overheat if I leave it on?"],
    'faq.a5': ["না — এতে অটো শাট-অফ টাইমার আছে, নির্দিষ্ট সময় পর নিজে থেকেই বন্ধ হয়ে যায়। [টাইমার কত মিনিটের, সাপ্লায়ার থেকে জেনে লিখুন]", "It has an auto shut-off timer that switches it off by itself after a set time. [Add how many minutes the timer lasts, from your supplier]"],
    'faq.q6': ["কীভাবে চার্জ দেব?", "How do I charge it?"],
    'faq.a6': ["বক্সে থাকা USB চার্জিং কেবল দিয়ে চার্জ দিন। ডিসপ্লের ব্যাটারি আইকনে চার্জ কতটা আছে দেখা যায়। [পুরো চার্জ হতে কত সময় লাগে, লিখুন]", "Use the USB charging cable in the box. The battery icon on the display shows how much charge is left. [Add how long a full charge takes]"],
    'faq.q4': ['সরাসরি ত্বকের উপর ব্যবহার করা যাবে?', 'Can I use it directly on my skin?'],
    'faq.a4': ["বেল্টটি নরম কাপড়ের তৈরি, তবে পাতলা জামার উপর ব্যবহার করাই সবচেয়ে নিরাপদ — বিশেষ করে ৬০°C লেভেলে। ত্বক লাল হলে বা অস্বস্তি লাগলে সাথে সাথে বন্ধ করুন।", "The belt is soft fabric, but it’s safest to wear it over a thin layer of clothing — especially on the 60°C level. If your skin turns red or feels uncomfortable, switch it off straight away."],
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
    'co.bkash': ["অর্ডার কনফার্ম করতে <strong data-advance></strong> অগ্রিম পাঠান (Send Money) — বিকাশ, নগদ, উপায় বা রকেট:", "To confirm your order, send a <strong data-advance></strong> advance (Send Money) by bKash, Nagad, Upay or Rocket to:"],
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
    'co.secure': ['🔒 আপনার তথ্য শুধু ডেলিভারির জন্য ব্যবহার করা হবে।', '🔒 Your details are only used for delivery.'],
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
    'wa.hello': ['আসসালামু আলাইকুম, আমি WarmLune-এর পণ্য সম্পর্কে জানতে চাই।', 'Hi, I’d like to know more about WarmLune.'],
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
