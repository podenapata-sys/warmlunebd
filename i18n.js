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
    'p.lead': ['প্রতি মাসে পিরিয়ডের ব্যথায় পুরো দিন নষ্ট হয়? WarmLune আপনার তলপেটে দেয় আরামদায়ক, নিয়ন্ত্রণযোগ্য উষ্ণতা — তারবিহীন, শব্দহীন আর এতটাই পাতলা যে জামার নিচেও পরা যায়; বাসায়, অফিসে বা বাইরে, যেখানেই থাকুন।',
               'Do period cramps wreck a whole day every month? WarmLune gives your lower belly soothing, adjustable warmth — wireless, silent and so slim you can wear it under your clothes, at home, at work or out and about.'],
    'p.c1': ['ওষুধ ছাড়াই দ্রুত ব্যথা উপশম', 'Fast relief without medicine'],
    'p.c2': ['হিট ও ম্যাসাজ নিজের মতো সেট করুন', 'Set heat and massage your way'],
    'p.c3': ['তারবিহীন, রিচার্জেবল — যেকোনো জায়গায় ব্যবহার করুন', 'Wireless and rechargeable — use it anywhere'],
    'p.sale': ['সেল', 'Sale'],
    'p.ship': ['<a href="#ship">ডেলিভারি চার্জ</a> চেকআউটে হিসাব করা হবে।', '<a href="#ship">Delivery charges</a> are calculated at checkout.'],
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
    'rating.text': ['{r} — {n}টি যাচাইকৃত রিভিউ', '{r} — {n} verified reviews'],

    'acc.how': ['কীভাবে কাজ করে?', 'How does it work?'],
    'acc.howBody': ['গ্রাফিন হিটিং প্যাড তলপেটে সমানভাবে উষ্ণতা ছড়ায়, সাথে ভাইব্রেশন ম্যাসাজ। বোতাম চেপে হিট লেভেল ও ম্যাসাজ মোড বদলান।',
                    'The graphene heating pad spreads warmth evenly across your lower belly, with vibration massage on top. Press the button to change heat level and massage mode.'],
    'acc.box': ['বক্সে কী কী থাকছে?', 'What’s in the box?'],
    'acc.boxBody': ['[বক্সে থাকা জিনিসের তালিকা দিন — যেমন হিটিং প্যাড, অ্যাডজাস্টেবল বেল্ট, চার্জিং কেবল, নির্দেশিকা]', '[List what’s in the box — e.g. heating pad, adjustable belt, charging cable, user guide]'],
    'acc.specs': ['স্পেসিফিকেশন', 'Specifications'],
    'acc.specsBody': ['[ব্যাটারি mAh, চার্জিং সময়, হিট লেভেল, ম্যাসাজ মোড, ওজন, মাপ]', '[Battery mAh, charging time, heat levels, massage modes, weight, size]'],
    'acc.delivery': ['ডেলিভারি', 'Delivery'],
    'acc.deliveryBody': ['[ডেলিভারি সময় ও এলাকা লিখুন — যেমন ঢাকায় ১-২ দিন, ঢাকার বাইরে ৩-৫ দিন]', '[Delivery times and areas — e.g. Dhaka 1–2 days, outside Dhaka 3–5 days]'],
    'acc.refund': ['রিটার্ন ও রিফান্ড পলিসি', 'Returns & refund policy'],
    'acc.refundBody': ['[৩০ দিনের মানি-ব্যাক গ্যারান্টির শর্তগুলো এখানে লিখুন]', '[Write the terms of the 30-day money-back guarantee here]'],

    /* ---------- lifestyle / why / stats ---------- */
    'life.ph': ['লাইফস্টাইল ছবি: প্যাড পরে আরাম করছেন এমন একজন নারী', 'Lifestyle photo: a woman relaxing while wearing the pad'],
    'life.kicker': ['পরিচিত হোন WARMLUNE™ হিটিং প্যাডের সাথে', 'MEET THE WARMLUNE™ HEATING PAD'],
    'life.title': ['পিরিয়ডের ব্যথাকে বিদায় বলুন', 'Say goodbye to period pain'],
    'life.body': ['ব্যথা যেখানে, ঠিক সেখানেই পান শান্ত, স্থির উষ্ণতা। WarmLune মৃদু তাপের সাথে আরামদায়ক ম্যাসাজ মিলিয়ে দেয়, যাতে মাসের সবচেয়ে কঠিন দিনগুলোও পার করতে পারেন — বিছানায় পড়ে না থেকে, বারবার পেইনকিলার না খেয়ে।',
                  'Get calm, steady warmth exactly where it hurts. WarmLune pairs gentle heat with a soothing massage, so you can get through the hardest days of the month — without staying in bed or reaching for painkillers again and again.'],
    'why.title': ['WarmLune কেন সবার পছন্দ', 'Why everyone loves WarmLune'],
    'why.ph1': ['ছবি: হিটিং-এর ক্লোজ-আপ', 'Photo: heating close-up'],
    'why.ph2': ['ছবি: ডিসপ্লে ও কন্ট্রোল', 'Photo: display & controls'],
    'why.ph3': ['ছবি: জামার নিচে পরা অবস্থায়', 'Photo: worn under clothes'],
    'why.h1': ['টার্গেটেড হিট টেকনোলজি', 'Targeted heat technology'],
    'why.p1': ['গ্রাফিন হিটিং পুরো প্যাডে সমানভাবে উষ্ণতা ছড়ায়, তাই ব্যথার জায়গায় পান স্থির আরাম — কোথাও অতিরিক্ত গরম হয় না।', 'Graphene heating spreads warmth evenly across the whole pad, so you get steady comfort where it hurts — with no hot spots.'],
    'why.h2': ['নিজের মতো হিট ও ম্যাসাজ', 'Heat and massage your way'],
    'why.p2': ['হিট লেভেল আর ভাইব্রেশন ম্যাসাজ মোড মিলিয়ে খুঁজে নিন আপনার শরীরের জন্য সবচেয়ে আরামদায়ক কম্বিনেশন।', 'Mix heat levels and vibration massage modes to find the combination that feels best for your body.'],
    'why.h3': ['অ্যাডজাস্টেবল, অদৃশ্য বেল্ট', 'Adjustable, invisible belt'],
    'why.p3': ['স্ট্রেচি বেল্ট প্রায় সব কোমরের মাপে ফিট হয় এবং জায়গা থেকে সরে না, তাই কাজ, পড়াশোনা বা ভ্রমণের সময় জামার নিচেই পরে থাকতে পারেন।', 'The stretchy belt fits almost any waist and stays in place, so you can wear it under your clothes at work, while studying or travelling.'],
    'aria.stats': ['এক নজরে', 'At a glance'],

    /* ---------- reviews ---------- */
    'rev.title': ['সত্যিকারের ক্রেতা, সত্যিকারের আরাম', 'Real customers, real comfort'],
    'rev.subPh': ['আপনার স্টোরের যাচাইকৃত রিভিউ ও ক্রেতাদের ছবি এখানে যোগ করুন।', 'Add your store’s verified reviews and customer photos here.'],
    'rev.subReal': ['যাচাইকৃত ক্রেতাদের আসল অভিজ্ঞতা।', 'Real experiences from verified buyers.'],
    'rev.chip': ['যাচাইকৃত ক্রেতা', 'Verified buyer'],
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
    'faq.a2': ['[প্রতি চার্জে কত মিনিট চলে ও চার্জ হতে কত সময় লাগে, লিখুন]', '[Write how many minutes it runs per charge and how long it takes to charge]'],
    'faq.q3': ['প্যাড কতটা গরম হয়?', 'How hot does the pad get?'],
    'faq.a3': ['[হিট লেভেলগুলোর তাপমাত্রা (°C) লিখুন]', '[List the temperature (°C) of each heat level]'],
    'faq.q4': ['সরাসরি ত্বকের উপর ব্যবহার করা যাবে?', 'Can I use it directly on my skin?'],
    'faq.a4': ['[প্রস্তুতকারকের নির্দেশনা অনুযায়ী উত্তর দিন — সাধারণত পাতলা কাপড়ের উপর ব্যবহার করা নিরাপদ]', '[Answer from the manufacturer’s instructions — it’s usually safest over a thin layer of clothing]'],
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
    'co.bkash': ['অর্ডার কনফার্ম করতে <strong data-advance></strong> অগ্রিম বিকাশ করুন (Send Money):', 'To confirm your order, send a <strong data-advance></strong> advance by bKash (Send Money) to:'],
    'co.bkashNote': ['এই টাকা মোট মূল্য থেকে বাদ যাবে। বাকি টাকা পণ্য হাতে পেয়ে দিবেন।', 'This is deducted from the total. Pay the rest when your order arrives.'],
    'co.copy': ['কপি', 'Copy'],
    'co.copied': ['কপি হয়েছে ✓', 'Copied ✓'],
    'co.trx': ['বিকাশ ট্রানজেকশন আইডি', 'bKash transaction ID'],
    'co.trxPh': ['যেমন 9A7B6C5D4E', 'e.g. 9A7B6C5D4E'],
    'co.trxErr': ['বিকাশ মেসেজে পাওয়া ট্রানজেকশন আইডি দিন (৮-১২ অক্ষর)।', 'Enter the transaction ID from your bKash message (8–12 characters).'],
    'co.summary': ['অর্ডার সারাংশ', 'Order summary'],
    'co.submit': ['অর্ডার কনফার্ম করুন', 'Confirm order'],
    'co.secure': ['🔒 আপনার তথ্য শুধু ডেলিভারির জন্য ব্যবহার করা হবে।', '🔒 Your details are only used for delivery.'],
    'co.due': ['পণ্য হাতে পেয়ে দিবেন', 'Pay on delivery'],
    'co.orderNow': ['এখনই অর্ডার করুন', 'Order now'],
    'co.subtotal': ['সাবটোটাল', 'Subtotal'],
    'co.delivery': ['ডেলিভারি চার্জ', 'Delivery'],
    'co.free': ['ফ্রি', 'Free'],
    'co.advance': ['অগ্রিম (বিকাশ)', 'Advance (bKash)'],
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
