/* ==========================================================================
   Bakaina — full-store design preview (preview.html), for client review.
   Real products, prices and reviews come from config.js. Where the client's
   catalogue is not in yet, grey "Sample" cards fill the slot so the layout can
   be judged; they cannot be added to the cart.
   ========================================================================== */
(function () {
  'use strict';
  var W = window.WL || {}, S = W.store || {};
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var money = function (n) { return '৳' + Number(n).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ls = { get: function (k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };

  /* ---------- Icons ---------- */
  var P = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    heart: '<path d="M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5C19 15.6 12 20 12 20Z"/>', cart: '<path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2"/><circle cx="9" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/>',
    wa: '<path d="M4 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.1z"/><path d="M9.2 8.6c.2-.4.5-.5.8-.5h.5c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .4-.1.6l-.5.6c.6 1.2 1.5 2.1 2.7 2.7l.6-.5c.2-.1.4-.2.6-.1l1.5.6c.3.1.4.3.4.5v.5c0 .3-.1.6-.5.8-.6.4-1.5.5-2.3.2a9 9 0 0 1-5-5c-.3-.8-.2-1.7.2-2.3z"/>', star: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
    facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V8z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>', trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v5M14 11v5"/>', close: '<path d="M6 6l12 12M18 6 6 18"/>', grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    left: '<path d="m15 5-7 7 7 7"/>', right: '<path d="m9 5 7 7-7 7"/>', up: '<path d="m5 15 7-7 7 7"/>', down: '<path d="m5 9 7 7 7-7"/>', arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    phone: '<path d="M5 4h3l1.5 4-2 1.3a11 11 0 0 0 5.2 5.2L14 12.5l4 1.5v3a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2Z"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    chat: '<path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/>', truck: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    cash: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v5M18 9.5v5"/>', box: '<path d="M3 8 12 3l9 5v8l-9 5-9-5V8Z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
    headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>', send: '<path d="M4 12 20 4l-6 16-3-7-7-1z"/>',
    skincare: '<path d="M10 3h4v3h-4z"/><path d="M9 6h6l1 3v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V9z"/><path d="M8 12h8"/>', bodycare: '<path d="M8 8h8l1 2v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9z"/><path d="M10 8V5h4v3"/><path d="M14 5h3"/><path d="M10 14h4"/>',
    haircare: '<path d="M5 4v16"/><path d="M5 6h6M5 9h6M5 12h6M5 15h6M5 18h6"/><path d="M15 4c2 3 4 4.5 4 8a4 4 0 0 1-8 0c0-3.5 2-5 4-8z"/>', appliance: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><circle cx="12" cy="13" r="4"/><path d="M9 6.5h.01M12 6.5h3"/>',
    household: '<path d="M4 11 12 4l8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-5h4v5"/>', makeup: '<path d="M9 21V11h6v10z"/><path d="M10 11V7l4-4v8"/>',
    fragrance: '<rect x="6" y="9" width="12" height="12" rx="3"/><path d="M10 9V6h4v3M12 6V3h3"/>',
    electronics: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>', gadgets: '<rect x="7" y="7" width="10" height="10" rx="3"/><path d="M9 7V3h6v4M9 17v4h6v-4M12 10v2.5l1.5 1"/>',
    lighting: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.3 1 2.1h5c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3Z"/>', furniture: '<path d="M6 11V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5"/><path d="M4 11h16v5H4zM6 16v4M18 16v4"/>',
    cleaning: '<path d="M9 9h6l1 3v8a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-8z"/><path d="M10 9V6h3l3-2M16 7h3"/>', fashion: '<path d="M8 3 4 6l2 4 2-1v12h8V9l2 1 2-4-4-3c-.5 1.5-2 2.5-4 2.5S8.5 4.5 8 3Z"/>',
    fan: '<circle cx="12" cy="12" r="1.8"/><path d="M12 10.2C11 6 13 3 15.5 4.5S15 10 13.6 11M13.8 12.6c4 1.3 5.7 4.4 3.3 5.6s-4.8-3.2-4.6-4.9M10.3 12.9C7.4 16 4 16.2 4 13.5s5.5-2.4 6.3-1.4"/>',
    baby: '<path d="M10 3h4M9 6h6M10 6V3M14 6V3"/><path d="M8 9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"/><path d="M8 12h3M8 15h3"/>', pen: '<path d="m15 4 5 5L9 20H4v-5z"/><path d="m13 6 5 5"/>',
    toy: '<rect x="4" y="12" width="7" height="8" rx="1"/><rect x="13" y="12" width="7" height="8" rx="1"/><rect x="8.5" y="4" width="7" height="8" rx="1"/>', fitness: '<path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12"/>',
    tool: '<path d="M14.5 6.5a4 4 0 0 0 5 5l-9 9a2.1 2.1 0 0 1-3-3l9-9a4 4 0 0 0-2-2z"/><path d="m14.5 6.5 2-3 4 4-3 2"/>', bag: '<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    outdoor: '<path d="M3 20 12 4l9 16z"/><path d="M12 4v16M9 20l3-5 3 5"/>', book: '<path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2z"/><path d="M4 20a2 2 0 0 0 2 1h13v-3"/>',
    gift: '<rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13"/><path d="M12 8c-1.5-4-6-4-5-1.5S12 8 12 8Zm0 0c1.5-4 6-4 5-1.5S12 8 12 8Z"/>', kitchen: '<path d="M6 3v8a3 3 0 0 0 6 0V3M9 3v18"/><path d="M17 21V3c-2 1.5-3 4-3 7h3"/>',
  };
  function icon(n) { return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (P[n] || P.box) + '</svg>'; }

  /* ---------- Real products (same model as the live store) ---------- */
  var meta = S.products || {}, reviews = (W.reviews || []).filter(function (r) { return r && r.rating; });
  var real = [];
  if (W.price > 0) real.push({ id: 'belt', checkoutId: 'pad-pink', name: 'WarmLune™ Heating Belt', brand: 'WarmLune', image: (W.gallery && W.gallery[0] && W.gallery[0].src) || '', image2: (W.gallery && W.gallery[1] && W.gallery[1].src) || '', price: W.price, oldPrice: W.oldPrice, url: 'heating-belt.html', reviewCount: reviews.length, rating: reviews.length ? reviews.reduce(function (s, r) { return s + r.rating; }, 0) / reviews.length : 0 });
  (W.shopProducts || []).forEach(function (p) {
    if (!(p.price > 0)) return;
    real.push({ id: p.id, checkoutId: p.id, name: p.name_en || p.name, brand: p.brand || (p.combo ? 'Bakaina' : ''), image: p.image || '', image2: (p.images || [])[1] || '', price: p.price, oldPrice: p.oldPrice, url: p.url || ('product.html?id=' + encodeURIComponent(p.id)), reviewCount: 0, rating: 0 });
  });
  real.forEach(function (p) { var m = meta[p.id] || {}; p.category = m.category || ''; p.tags = m.tags || []; p.off = p.oldPrice > p.price ? Math.round((p.oldPrice - p.price) / p.oldPrice * 100) : 0; });
  var byId = function (id) { return real.filter(function (p) { return p.id === id; })[0]; };

  /* ---------- Departments: the store's categories + example ones for the review ---------- */
  // 20 departments x 20 product ideas (client's sourcing list). Names only: they show as grey "Sample" cards, no price, until real stock is added.
  var depts = [{"id": "electronics", "name": "Electronics", "icon": "electronics", "items": ["Smartphones", "Wireless Earbuds", "Bluetooth Speakers", "Power Banks", "USB-C Fast Chargers", "Charging Cables", "Smart TVs", "Wi-Fi Routers", "Laptops", "Computer Monitors", "Wireless Keyboards", "Wireless Mice", "USB Flash Drives", "Memory Cards", "External SSDs", "CCTV Cameras", "Mini UPS for Routers", "Surge Protectors", "Webcams", "Computer Headsets"]}, {"id": "beauty", "name": "Beauty", "icon": "skincare", "items": ["Facial Cleansers", "Sunscreen", "Face Moisturizers", "Niacinamide Serums", "Vitamin C Serums", "Micellar Water", "Lip Balms", "Lipsticks", "Foundation", "Compact Powder", "Mascara", "Eyeliner", "Makeup Brushes", "Makeup Sponges", "Sheet Masks", "Hair Serum", "Shampoo", "Hair Conditioner", "Body Lotion", "Makeup Remover Pads"]}, {"id": "gadgets", "name": "Gadgets", "icon": "gadgets", "items": ["Smartwatches", "Fitness Trackers", "Phone Tripods", "Selfie Sticks", "Wireless Lavalier Microphones", "Phone Gimbals", "Digital Luggage Scales", "Bluetooth Trackers", "Portable Mini Printers", "USB Hubs", "Laptop Cooling Pads", "Phone Screen Magnifiers", "Digital Alarm Clocks", "Electronic Writing Tablets", "Wireless Charging Pads", "Car Phone Mounts", "Digital Tire Pressure Gauges", "Plug-in Power Meters", "Presentation Clickers", "Portable Projectors"]}, {"id": "kitchen", "name": "Kitchen & Household", "icon": "kitchen", "items": ["Manual Vegetable Choppers", "Spice Racks", "Airtight Food Containers", "Lunch Boxes", "Insulated Water Bottles", "Nonstick Frying Pans", "Pressure Cookers", "Kitchen Knife Sets", "Cutting Boards", "Silicone Cooking Utensils", "Oil Dispensers", "Rice Storage Containers", "Dish Drying Racks", "Kitchen Sink Strainers", "Egg Storage Boxes", "Measuring Cup Sets", "Food Thermos Flasks", "Laundry Baskets", "Wardrobe Organizers", "Mosquito Nets"]}, {"id": "lighting", "name": "Lighting", "icon": "lighting", "items": ["LED Bulbs", "Rechargeable Emergency Lights", "LED Tube Lights", "Solar Garden Lights", "LED Strip Lights", "Motion Sensor Night Lights", "Desk Lamps", "Bedside Lamps", "Ring Lights", "Rechargeable Lanterns", "Fairy Lights", "LED Ceiling Panels", "Outdoor Floodlights", "Solar Wall Lights", "Cabinet Lights", "Clip-on Reading Lights", "Pendant Lights", "LED Spotlights", "Smart LED Bulbs", "Decorative Wall Sconces"]}, {"id": "furniture", "name": "Furniture", "icon": "furniture", "items": ["Computer Desks", "Office Chairs", "Study Tables", "Plastic Chairs", "Folding Tables", "Shoe Racks", "Bookshelves", "Storage Cabinets", "Bedside Tables", "Coffee Tables", "TV Stands", "Dining Chairs", "Dining Tables", "Bed Frames", "Mattresses", "Sofa Sets", "Clothes Racks", "Wall Shelves", "Ottomans", "Dressing Tables"]}, {"id": "appliances", "name": "Appliances", "icon": "appliance", "items": ["Rice Cookers", "Electric Kettles", "Blenders", "Electric Irons", "Induction Cookers", "Air Fryers", "Microwave Ovens", "Toaster Ovens", "Sandwich Makers", "Electric Pressure Cookers", "Electric Hand Mixers", "Water Purifiers", "Refrigerators", "Washing Machines", "Vacuum Cleaners", "Hair Dryers", "Hair Straighteners", "Garment Steamers", "Electric Meat Grinders", "Air Conditioners"]}, {"id": "cleaning", "name": "Cleaning", "icon": "cleaning", "items": ["Microfiber Cleaning Cloths", "Spin Mops", "Spray Mops", "Floor Wipers", "Window Squeegees", "Toilet Brushes", "Dishwashing Brushes", "Scrub Sponges", "Drain Cleaning Brushes", "Lint Rollers", "Reusable Pet Hair Removers", "Dustpans and Brooms", "Telescopic Dusters", "Cleaning Gloves", "Garbage Bags", "Laundry Detergent", "Dishwashing Liquid", "Floor Cleaners", "Bathroom Cleaners", "Laundry Stain Removers"]}, {"id": "fashion", "name": "Fashion", "icon": "fashion", "items": ["Women's Three-Piece Sets", "Sarees", "Kurtis", "Abayas", "Hijabs", "Women's Palazzo Pants", "Women's Tops", "Women's Sandals", "Men's Panjabis", "Men's T-Shirts", "Polo Shirts", "Casual Shirts", "Jeans", "Chinos", "Men's Sandals", "Sneakers", "Children's Eid Outfits", "Kids' Casual Wear", "Hoodies", "Sweaters"]}, {"id": "fans", "name": "Fans", "icon": "fan", "items": ["Ceiling Fans", "Rechargeable Table Fans", "Pedestal Fans", "Wall-Mounted Fans", "USB Desk Fans", "Handheld Mini Fans", "Neck Fans", "Clip-on Fans", "BLDC Ceiling Fans", "Exhaust Fans", "Tower Fans", "Box Fans", "Floor Fans", "Oscillating Table Fans", "Solar Rechargeable Fans", "Camping Fans", "Stroller Fans", "Remote-Controlled Ceiling Fans", "Industrial Pedestal Fans", "Ceiling Fan Regulators"]}, {"id": "baby", "name": "Baby", "icon": "baby", "items": ["Baby Diapers", "Baby Wipes", "Baby Cotton Clothing Sets", "Baby Bibs", "Baby Bath Towels", "Baby Blankets", "Baby Bathtubs", "Baby Nail Care Sets", "Baby Feeding Bottles", "Baby Bottle Brushes", "Baby Sippy Cups", "Baby Feeding Spoons", "Baby High Chairs", "Baby Strollers", "Baby Carriers", "Baby Changing Mats", "Baby Mosquito Nets", "Baby Potty Seats", "Baby Play Mats", "Baby Teething Rings"]}, {"id": "stationery", "name": "Stationery", "icon": "pen", "items": ["Ballpoint Pens", "Gel Pens", "Pencils", "Erasers", "Sharpeners", "Notebooks", "Spiral Notebooks", "Daily Planners", "Highlighters", "Permanent Markers", "Whiteboard Markers", "Sticky Notes", "File Folders", "Document Envelopes", "Geometry Sets", "Calculators", "Staplers", "Correction Tapes", "Art Sketchbooks", "Colored Pencil Sets"]}, {"id": "toys", "name": "Toys", "icon": "toy", "items": ["Building Block Sets", "Remote-Controlled Cars", "Toy Train Sets", "Dolls", "Dollhouses", "Stuffed Animals", "Jigsaw Puzzles", "Magnetic Construction Tiles", "Toy Kitchen Sets", "Toy Doctor Sets", "Alphabet Learning Toys", "Shape Sorters", "Stacking Rings", "Board Games", "Rubik's Cubes", "Play Dough Sets", "Toy Musical Keyboards", "Bubble Makers", "Toy Animals", "Kids' Ride-on Cars"]}, {"id": "fitness", "name": "Fitness", "icon": "fitness", "items": ["Yoga Mats", "Resistance Bands", "Adjustable Dumbbells", "Skipping Ropes", "Hand Grippers", "Push-up Bars", "Ab Rollers", "Pull-up Bars", "Kettlebells", "Foam Rollers", "Exercise Balls", "Ankle Weights", "Wrist Wraps", "Weightlifting Belts", "Exercise Bikes", "Treadmills", "Aerobic Step Platforms", "Gym Gloves", "Agility Ladders", "Shaker Bottles"]}, {"id": "tools", "name": "Tools", "icon": "tool", "items": ["Screwdriver Sets", "Precision Screwdriver Kits", "Combination Pliers", "Adjustable Wrenches", "Socket Wrench Sets", "Measuring Tapes", "Claw Hammers", "Allen Key Sets", "Cordless Drills", "Electric Screwdrivers", "Drill Bit Sets", "Digital Multimeters", "Spirit Levels", "Hand Riveters", "Clamps", "Soldering Irons", "Hot Glue Guns", "Toolboxes", "Wire Strippers", "Safety Goggles"]}, {"id": "accessories", "name": "Accessories", "icon": "bag", "items": ["Wristwatches", "Sunglasses", "Wallets", "Belts", "Women's Handbags", "Crossbody Bags", "Backpacks", "Tote Bags", "Card Holders", "Hair Clips", "Scrunchies", "Headbands", "Earrings", "Bracelets", "Necklaces", "Rings", "Brooches", "Phone Cases", "Tempered Glass Screen Protectors", "Keychains"]}, {"id": "outdoor", "name": "Outdoor", "icon": "outdoor", "items": ["Raincoats", "Umbrellas", "Camping Tents", "Sleeping Bags", "Camping Chairs", "Picnic Mats", "Insulated Cooler Bags", "Trekking Backpacks", "Hiking Poles", "Waterproof Dry Bags", "Travel Hammocks", "Camping Cookware Sets", "Binoculars", "Fishing Rod Sets", "Bicycle Helmets", "Bicycle Pumps", "Bicycle Locks", "Gardening Gloves", "Watering Cans", "Garden Hose Sprayers"]}, {"id": "books", "name": "Books", "icon": "book", "items": ["Bangla Fiction Books", "Bangla Short Story Collections", "English Fiction Books", "Children's Storybooks", "Picture Books", "Early Learning Books", "SSC Exam Guides", "HSC Exam Guides", "University Admission Guides", "BCS Preparation Books", "IELTS Preparation Books", "English Grammar Books", "Spoken English Books", "Islamic History Books", "Quran Translations", "Self-Help Books", "Business and Entrepreneurship Books", "Personal Finance Books", "Cookbooks", "Biographies"]}, {"id": "perfume", "name": "Perfume", "icon": "fragrance", "items": ["Men's Eau de Parfum", "Women's Eau de Parfum", "Unisex Eau de Parfum", "Men's Eau de Toilette", "Women's Eau de Toilette", "Oud Attar", "White Musk Attar", "Rose Attar", "Amber Attar", "Jasmine Attar", "Sandalwood Attar", "Citrus Perfume", "Fresh Aquatic Perfume", "Vanilla Perfume", "Woody Perfume", "Floral Perfume", "Body Mist", "Pocket Perfume", "Perfume Discovery Sets", "Perfume Gift Sets"]}, {"id": "others", "name": "Others++", "icon": "gift", "items": ["Premium Dates", "Packaged Honey", "Pure Ghee", "Mixed Nuts", "Black Tea", "Green Tea", "Ground Coffee", "Prayer Mats", "Prayer Beads", "Gift Boxes", "Greeting Cards", "Photo Frames", "Artificial Flowers", "Decorative Cushions", "Pet Food Bowls", "Cat Litter", "Pet Grooming Brushes", "Travel Neck Pillows", "Passport Holders", "Packing Cubes"]}];
  var subs = {}, tones = {}, TONES = ["t-blue", "t-peach", "t-mint", "t-yellow", "t-lav", "t-pink", "t-grey"];
  depts.forEach(function (d, i) { subs[d.id] = d.items; tones[d.id] = TONES[i % TONES.length]; });
  var groups = [
    { id: 'tech', label: 'Electronics & Gadgets', cats: ['electronics', 'gadgets', 'appliances', 'lighting', 'fans'] },
    { id: 'style', label: 'Fashion & Beauty', cats: ['beauty', 'fashion', 'accessories', 'perfume', 'fitness'] },
    { id: 'home', label: 'Home & Living', cats: ['kitchen', 'furniture', 'cleaning', 'tools', 'outdoor'] },
    { id: 'family', label: 'Kids, Books & More', cats: ['baby', 'toys', 'stationery', 'books', 'others'] },
  ];
  // Our real products, placed in the new departments
  var CMAP = { belt: 'gadgets', skincare: 'beauty', bodycare: 'beauty', haircare: 'beauty', appliance: 'appliances', household: 'kitchen' };
  real.forEach(function (p) { p.category = CMAP[p.id] || CMAP[p.category] || p.category || 'others'; });
  var dname = function (id) { var d = depts.filter(function (x) { return x.id === id; })[0]; return d ? d.name : 'Products'; };
  var catUrl = function (id) { return 'preview.html?view=cat&c=' + encodeURIComponent(id); };
  function count(id) { return catList(id).length; }

  // Grey placeholder cards, named after the department's product ideas
  var sn = 0, used = {};
  function sample(cat) {
    sn++; var d = depts.filter(function (x) { return x.id === cat; })[0], k = used[cat] || 0; used[cat] = k + 1;
    return { id: 's' + sn, sample: true, name: d ? d.items[k % d.items.length] : 'Sample product', brand: 'Sample', category: cat, url: catUrl(cat), price: 0 };
  }
  // Everything in one department: real products first, then the remaining ideas (20 in all)
  function catList(id) {
    var d = depts.filter(function (x) { return x.id === id; })[0]; if (!d) return [];
    var r = real.filter(function (p) { return p.category === id; }), out = r.slice(), sid = 0;
    d.items.forEach(function (name, i) { if (out.length < Math.max(20, r.length)) out.push({ id: 'c-' + id + '-' + i, sample: true, name: name, brand: 'Sample', category: id, url: catUrl(id), price: 0 }); });
    return out;
  }
  function fill(list, n, cat) { list = list.slice(0, n); var cs = depts.map(function (d) { return d.id; }); var i = 0; while (list.length < n) list.push(sample(cat || cs[i++ % cs.length])); return list; }

  var wa = function (t) { return 'https://wa.me/' + (W.whatsapp || '') + (t ? '?text=' + encodeURIComponent(t) : ''); };
  var TRACK = wa('আসসালামু আলাইকুম, আমার অর্ডারের আপডেট জানতে চাই। অর্ডার নম্বর: ');
  var HELP = wa('আসসালামু আলাইকুম, আমি Bakaina-এর পণ্য সম্পর্কে জানতে চাই।');

  /* ---------- Cart & wishlist (shared with the live store) ---------- */
  var cart = ls.get('bk-cart', []).filter(function (x) { return byId(x.id); });
  var wish = ls.get('bk-wish', []).filter(function (id) { return byId(id); });
  function total() { return cart.reduce(function (s, x) { return s + byId(x.id).price * x.qty; }, 0); }
  function counts() {
    var n = cart.reduce(function (s, x) { return s + x.qty; }, 0);
    $$('[data-cart-n]').forEach(function (b) { var was = b.textContent; b.textContent = n; b.hidden = !n; if (n && was !== String(n) && was !== '') { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); } });
    $$('[data-cart-sum]').forEach(function (b) { b.innerHTML = '<b class="cs-n">' + n + '</b> item' + (n === 1 ? '' : 's') + ' – <b class="cs-t">' + money(total()) + '</b>'; });
    $$('[data-wish-n]').forEach(function (b) { b.textContent = wish.length; b.hidden = !wish.length; });
    if ($('[data-mini]')) renderMini();
    if ($('[data-cart-page]')) renderCartPage();
  }
  var VIEW = new URLSearchParams(location.search).get('view');
  function checkoutHref() { var only = cart.length === 1 ? byId(cart[0].id) : null; return only ? 'checkout.html?product=' + encodeURIComponent(only.checkoutId) + '&qty=' + cart[0].qty : 'preview.html?view=cart'; }
  function cartWa() {
    var lines = cart.map(function (x) { var p = byId(x.id); return '• ' + p.name + ' × ' + x.qty + ' = ' + money(p.price * x.qty); });
    return wa('আসসালামু আলাইকুম, আমি এগুলো অর্ডার করতে চাই:\n' + lines.join('\n') + '\nমোট: ' + money(total()) + '\nনাম:\nমোবাইল:\nঠিকানা:');
  }
  function thumb(p) { return p.image ? '<img src="' + esc(p.image) + '" alt="" width="64" height="64">' : '<span class="ph t-grey">' + icon('box') + '</span>'; }
  // Header dropdown (desktop): opens on hover, and by itself after Add to Cart
  function renderMini() {
    var m = $('[data-mini]');
    if (!cart.length) { m.innerHTML = '<p class="mc-empty">' + icon('cart') + 'Your cart is empty.</p>'; return; }
    m.innerHTML = '<ul class="mc-list">' + cart.map(function (x) {
      var p = byId(x.id);
      return '<li>' + thumb(p) + '<a class="mc-name" href="' + esc(p.url) + '">' + esc(p.name) + '</a><span class="mc-q">× ' + x.qty + '</span><strong>' + money(p.price * x.qty) + '</strong>' +
        '<button class="mc-del" type="button" data-remove="' + esc(p.id) + '" aria-label="Remove ' + esc(p.name) + '">' + icon('trash') + '</button></li>';
    }).join('') + '</ul>' +
      '<div class="mc-tot"><span>Total</span><strong>' + money(total()) + '</strong></div><p class="mc-note">Cash on delivery. Delivery charge, if any, is shown at checkout.</p>' +
      '<div class="mc-btns"><a class="btn btn-outline" href="preview.html?view=cart">View Cart</a><a class="btn btn-brand" href="' + esc(checkoutHref()) + '">Checkout</a></div>';
  }
  // Full cart page: preview.html?view=cart
  function renderCartPage() {
    var el = $('[data-cart-page]');
    if (!cart.length) { el.innerHTML = '<div class="cp-empty">' + icon('cart') + '<p>Your cart is empty.</p><a class="btn btn-brand" href="preview.html">Continue shopping</a></div>'; return; }
    var multi = cart.length > 1;
    el.innerHTML = '<div class="cp-grid"><div class="cp-items"><div class="cp-row cp-head" aria-hidden="true"><span>Product</span><span>Price</span><span>Quantity</span><span>Total</span><span></span></div>' +
      cart.map(function (x) {
        var p = byId(x.id);
        return '<div class="cp-row"><div class="cp-prod">' + thumb(p) + '<div><a href="' + esc(p.url) + '">' + esc(p.name) + '</a>' +
          (multi ? '<a class="link-u" href="checkout.html?product=' + encodeURIComponent(p.checkoutId) + '&amp;qty=' + x.qty + '">Order this item</a>' : '') + '</div></div>' +
          '<span class="cp-price"><span class="cp-lbl">Price</span>' + money(p.price) + '</span>' +
          '<div class="qty" role="group" aria-label="Quantity of ' + esc(p.name) + '"><button type="button" data-qty="' + esc(p.id) + '" data-d="-1" aria-label="One less"' + (x.qty <= 1 ? ' disabled' : '') + '>−</button><span aria-live="polite">' + x.qty + '</span><button type="button" data-qty="' + esc(p.id) + '" data-d="1" aria-label="One more"' + (x.qty >= 10 ? ' disabled' : '') + '>+</button></div>' +
          '<strong class="cp-sub"><span class="cp-lbl">Total</span>' + money(p.price * x.qty) + '</strong>' +
          '<button class="round-hit" type="button" data-remove="' + esc(p.id) + '" aria-label="Remove ' + esc(p.name) + '">' + icon('trash') + '</button></div>';
      }).join('') + '</div>' +
      '<aside class="cp-sum"><h2>Order summary</h2><div class="mc-tot"><span>Total</span><strong>' + money(total()) + '</strong></div><p class="mc-note">Cash on delivery. Delivery charge, if any, is shown at checkout.</p>' +
      (multi ? '<p class="mc-note">Checkout takes one product at a time. Order each item with “Order this item”, or send the whole cart on WhatsApp.</p>' : '<a class="btn btn-brand" href="' + esc(checkoutHref()) + '">Checkout</a>') +
      '<a class="btn ' + (multi ? 'btn-brand' : 'btn-outline') + '" href="' + cartWa() + '" target="_blank" rel="noopener">' + icon('chat') + 'Order on WhatsApp</a>' +
      '<a class="link-u" href="preview.html">← Continue shopping</a></aside></div>';
  }

  /* ---------- Cards ---------- */
  function pimg(p) {
    if (p.image) return '<img class="pc-main" src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async" width="500" height="500">' +
      (p.image2 ? '<img class="pc-alt" src="' + esc(p.image2) + '" alt="" loading="lazy" decoding="async" width="500" height="500">' : '');
    var d = depts.filter(function (x) { return x.id === p.category; })[0];
    return '<span class="ph ' + (tones[p.category] || 't-grey') + '">' + icon(d ? d.icon : 'box') + (p.sample ? 'Sample' : '') + '</span>';
  }
  function badge(p) {
    if (p.sample) return '<span class="pbadge sample">Sample</span>';
    return (p.off ? '<span class="pbadge sale">-' + p.off + '%</span>' : '') + (p.tags.indexOf('new') > -1 ? '<span class="pbadge">New</span>' : '');
  }
  function card(p) {
    var saved = wish.indexOf(p.id) > -1;
    var rate = p.reviewCount ? '<div class="pc-rate"><span class="st" aria-hidden="true">' + '★'.repeat(Math.round(p.rating)) + '</span> ' + p.rating.toFixed(1) + ' (' + p.reviewCount + ')<span class="sr-only"> reviews</span></div>' : '';
    var pid = p.sample ? '' : ' data-pid="' + esc(p.id) + '"';
    return '<article class="pc"><a class="pc-img" href="' + esc(p.url) + '"' + pid + ' tabindex="-1" aria-hidden="true">' + pimg(p) + badge(p) + '</a>' +
      '<div class="pc-body">' + '<span class="pc-brand">' + (p.brand ? esc(p.brand) : '&nbsp;') + '</span>' +
        '<h3 class="pc-name"><a href="' + esc(p.url) + '"' + pid + '>' + esc(p.name) + '</a></h3>' + rate +
        '<div class="pc-price">' + (p.sample ? '<span class="na">Your price</span>' : '<strong>' + money(p.price) + '</strong>' + (p.off ? '<s><span class="sr-only">was </span>' + money(p.oldPrice) + '</s>' : '')) + '</div></div>' +
      (p.sample
        ? '<div class="pc-foot"><button class="pc-add" type="button" disabled aria-label="Sample product, not for sale">' + icon('cart') + 'Sample</button></div>'
        : '<div class="pc-foot pc-foot-2"><button class="pc-add" type="button" data-add="' + esc(p.id) + '" aria-label="Add ' + esc(p.name) + ' to cart">' + icon('cart') + '<span class="l-long">Add to Cart</span><span class="l-short">Add</span></button>' +
          '<a class="pc-buy" href="checkout.html?product=' + encodeURIComponent(p.checkoutId) + '&amp;qty=1" data-pid="' + esc(p.id) + '" aria-label="Buy ' + esc(p.name) + ' now">Buy Now</a></div>' +
          '<button class="pc-heart" type="button" data-heart="' + esc(p.id) + '" aria-pressed="' + saved + '" aria-label="Save ' + esc(p.name) + ' to wishlist">' + icon('heart') + '</button>') + '</article>';
  }
  function carousel(id, items, cls) {
    return '<div class="car"><div class="car-track ' + (cls || '') + '" id="' + id + '" tabindex="0" aria-label="Scrollable list">' + items + '</div>' +
      '<span class="car-prev"><button class="round" type="button" data-car="' + id + '" data-dir="-1" aria-label="Scroll left">' + icon('left') + '</button></span>' +
      '<span class="car-next"><button class="round" type="button" data-car="' + id + '" data-dir="1" aria-label="Scroll right">' + icon('right') + '</button></span></div>';
  }

  /* ---------- Header ---------- */
  function promo(d, big) {
    var p = real.filter(function (x) { return x.category === d.id && x.image; })[0];
    return '<a class="dm-promo' + (big ? ' big' : '') + '" href="' + esc(p ? p.url : catUrl(d.id)) + '"' + (p ? ' data-pid="' + esc(p.id) + '"' : '') + '>' +
      (p ? '<img src="' + esc(p.image) + '" alt="" loading="lazy">' : '<span class="dm-ph ' + (tones[d.id] || 't-grey') + '">' + icon(d.icon) + '</span>') +
      '<span class="dm-pt"><small>' + (p ? (p.off ? 'Save ' + p.off + '%' : 'Featured') : esc(d.name)) + '</small><strong>' + esc(p ? p.name : 'Shop all ' + d.name) + '</strong>' + (p ? '<em>' + money(p.price) + '</em>' : '<em>20 products</em>') + '</span></a>';
  }
  function searchForm(id) {
    return '<form class="search" role="search" data-search><div class="scat" data-scat>' +
      '<button class="scat-btn" type="button" id="' + id + '-c" aria-haspopup="true" aria-expanded="false" aria-controls="' + id + '-cl"><span class="sr-only">Search in: </span><span data-scat-label>All</span>' + icon('down') + '</button>' +
      '<input type="hidden" name="cat" value="">' +
      '<div class="scat-pop" id="' + id + '-cl" role="group" aria-label="Search in a category"><button type="button" class="scat-all" data-scat-v="" aria-pressed="true">' + icon('grid') + 'All categories</button>' +
      depts.map(function (d) { return '<button type="button" data-scat-v="' + esc(d.id) + '" aria-pressed="false">' + icon(d.icon) + esc(d.name) + '</button>'; }).join('') + '</div></div>' +
      '<label class="sr-only" for="' + id + '">Search products</label><input id="' + id + '" name="q" type="search" placeholder="Search here…" autocomplete="off">' +
      '<button type="submit" aria-label="Search">' + icon('search') + '</button></form>';
  }
  var header =
    '<a class="skip" href="#main">Skip to content</a>' +
    '<p class="review-bar">Design preview for review — the 20 departments and grey <strong>“Sample”</strong> products come from the sourcing list; they are placeholders until real stock, photos and prices are added.</p>' +
    '<div class="topbar"><div class="wrap"><div>' +
      (W.phone ? '<a href="tel:' + esc(W.phone) + '">' + icon('phone') + esc(W.phone) + '</a>' : '') +
      '<a href="' + HELP + '" target="_blank" rel="noopener">' + icon('chat') + 'Contact</a><a href="delivery.html">' + icon('truck') + 'Delivery info</a><a href="' + TRACK + '" target="_blank" rel="noopener">' + icon('box') + 'Track order</a>' +
    '</div><div><a href="refund.html">Returns & refunds</a><a href="privacy.html">Privacy</a>' +
      ((S.social || {}).facebook ? '<a class="tb-fb" href="' + esc(S.social.facebook) + '" target="_blank" rel="noopener">' + icon('facebook') + 'Facebook</a>' : '') + '</div></div></div>' +
    '<header class="hdr"><div class="wrap">' +
      '<div class="hdr-main">' +
        '<button class="hbtn m-only" type="button" data-open="nav" aria-label="Menu" aria-controls="d-nav">' + icon('menu') + '</button>' +
        '<a class="logo" href="preview.html" aria-label="Bakaina home">' + '<img class="logo-full" src="img/logo-full.png" alt="' + esc(W.brand || 'Bakaina') + '" width="471" height="180">' + '</a>' +
        '<div class="d-only" style="flex:1;max-width:820px">' + searchForm('qd') + '</div>' +
        '<div class="tools">' +
          '<a class="hbtn d-only" href="preview.html?view=account">' + icon('user') + 'Account</a>' +
          '<a class="hbtn" href="products.html?view=wishlist" aria-label="Wishlist">' + icon('heart') + '<span class="d-only">Wishlist</span><span class="hbadge" data-wish-n hidden></span></a>' +
          '<div class="mc-wrap d-only" data-mc>' +
            '<a class="cart-sum" href="preview.html?view=cart" data-cart-sum>0 items – ৳0</a>' +
            '<a class="cart-sq" href="preview.html?view=cart" aria-label="View cart" aria-controls="mini-cart">' + icon('cart') + '<span class="hbadge" data-cart-n hidden></span></a>' +
            '<div class="mini-cart" id="mini-cart" data-mini></div></div>' +
          '<button class="hbtn m-only" type="button" data-open="cart" aria-label="Open cart">' + icon('cart') + '<span class="hbadge" data-cart-n hidden></span></button>' +
        '</div></div>' +
      '<div class="search-m">' + searchForm('qm') + '</div></div>' +
      '<nav class="navbar" aria-label="Main"><div class="wrap">' +
        // All Departments: list on the left, the hovered department's products on the right
        '<div class="dd" data-dd><button class="dept" type="button" data-mega aria-expanded="false" aria-controls="mega">' + icon('grid') + 'All Departments' + icon('down') + '</button>' +
        '<div class="mega" id="mega"><ul class="dm-list">' + depts.map(function (d, i) {
          return '<li><a class="dm-link' + (i ? '' : ' on') + '" href="' + catUrl(d.id) + '" data-dm="' + d.id + '">' + icon(d.icon) + '<span>' + esc(d.name) + '</span>' + icon('right') + '</a></li>';
        }).join('') + '</ul><div class="dm-panels">' + depts.map(function (d, i) {
          return '<div class="dm-panel' + (i ? '' : ' on') + '" data-dmp="' + d.id + '"><div class="dm-head"><h3>' + esc(d.name) + '</h3><a class="dm-all" href="' + catUrl(d.id) + '">See all 20 ' + icon('arrow') + '</a></div>' +
            '<div class="dm-body"><ul class="dm-cols">' + d.items.map(function (s) { return '<li><a href="' + catUrl(d.id) + '">' + esc(s) + '</a></li>'; }).join('') + '</ul>' + promo(d) + '</div></div>';
        }).join('') + '</div></div></div>' +
        // Department links: a mega panel drops down on hover
        ['electronics', 'beauty', 'fashion', 'kitchen'].map(function (id) {
          var d = depts.filter(function (x) { return x.id === id; })[0], g = groups.filter(function (x) { return x.cats.indexOf(id) > -1; })[0];
          return '<div class="navdd"><a class="navlink" href="' + catUrl(id) + '">' + esc(d.name) + icon('down') + '</a><div class="navpanel">' +
            '<div><h3>Popular in ' + esc(d.name) + '</h3><ul>' + d.items.slice(0, 7).map(function (s) { return '<li><a href="' + catUrl(id) + '">' + esc(s) + '</a></li>'; }).join('') + '</ul></div>' +
            '<div><h3>More ' + esc(d.name) + '</h3><ul>' + d.items.slice(7, 14).map(function (s) { return '<li><a href="' + catUrl(id) + '">' + esc(s) + '</a></li>'; }).join('') + '<li><a class="dm-all" href="' + catUrl(id) + '">View all 20 ' + icon('right') + '</a></li></ul></div>' +
            '<div><h3>' + esc(g ? g.label : 'Also browse') + '</h3><ul class="np-depts">' + (g ? g.cats : []).filter(function (c) { return c !== id; }).map(function (c) {
              var o = depts.filter(function (x) { return x.id === c; })[0]; return '<li><a href="' + catUrl(c) + '">' + icon(o.icon) + esc(o.name) + '</a></li>';
            }).join('') + '</ul></div>' + promo(d, true) + '</div></div>';
        }).join('') +
        // Offers: our real discounted products
        '<div class="navdd"><a class="navlink" href="products.html?sale=1">Offers <span class="tag">SALE</span>' + icon('down') + '</a><div class="navpanel np-offers"><h3>On sale now</h3><div class="np-deals">' +
          real.filter(function (p) { return p.off > 0; }).slice(0, 4).map(function (p) {
            return '<a class="np-deal" href="' + esc(p.url) + '" data-pid="' + esc(p.id) + '"><span class="np-img">' + (p.image ? '<img src="' + esc(p.image) + '" alt="" loading="lazy">' : '') + '<span class="pbadge sale">-' + p.off + '%</span></span><span class="np-name">' + esc(p.name) + '</span><span class="np-price">' + money(p.price) + ' <s>' + money(p.oldPrice) + '</s></span></a>';
          }).join('') + '</div></div></div>' +
        '<a class="navlink" href="products.html?tag=new">New arrivals</a>' +
        '<div class="navright"><a class="navlink" href="' + TRACK + '" target="_blank" rel="noopener">Track order</a><a class="navbtn" href="' + HELP + '" target="_blank" rel="noopener">' + icon('chat') + 'Contact</a></div>' +
        '</div></nav></header>';

  var drawers =
    '<div class="scrim" data-scrim hidden></div>' +
    '<aside class="drawer left" id="d-nav" data-drawer="nav" role="dialog" aria-modal="true" aria-labelledby="d-nav-t" hidden><div class="drawer-head"><h2 id="d-nav-t">Menu</h2><button class="round-hit" type="button" data-close aria-label="Close menu">' + icon('close') + '</button></div>' +
      '<div class="drawer-body"><p class="dtitle">All Departments</p><ul class="dlist">' + depts.map(function (d, i) {
        return '<li><button class="dl" type="button" aria-expanded="false" aria-controls="dsub' + i + '" data-acc>' + icon(d.icon) + esc(d.name) + '<span class="chev">' + icon('right') + '</span></button>' +
          '<ul class="dsub" id="dsub' + i + '" hidden><li><a href="' + catUrl(d.id) + '">All ' + esc(d.name) + '</a></li>' + (subs[d.id] || []).slice(0, 6).map(function (s) { return '<li><a href="' + catUrl(d.id) + '">' + esc(s) + '</a></li>'; }).join('') + '</ul></li>';
      }).join('') + '</ul><p class="dtitle">Shop</p><ul class="dlist"><li><a href="products.html?sale=1">' + icon('cash') + 'Offers</a></li><li><a href="products.html?tag=new">' + icon('box') + 'New arrivals</a></li></ul>' +
      '<p class="dtitle">Account</p><ul class="dlist"><li><a href="preview.html?view=account">' + icon('user') + 'My account</a></li><li><a href="products.html?view=wishlist">' + icon('heart') + 'Wishlist</a></li>' +
        '<li><a href="' + TRACK + '" target="_blank" rel="noopener">' + icon('truck') + 'Track order</a></li><li><a href="' + HELP + '" target="_blank" rel="noopener">' + icon('chat') + 'Contact us</a></li></ul></div></aside>' +
    '<aside class="drawer right" data-drawer="cart" role="dialog" aria-modal="true" aria-labelledby="d-cart-t" hidden><div class="drawer-head"><h2 id="d-cart-t">Shopping cart</h2><button class="round-hit" type="button" data-close aria-label="Close cart">' + icon('close') + '</button></div>' +
      '<div class="drawer-body" data-cart-body></div><div class="drawer-foot" data-cart-foot></div></aside>' +
    '<div class="toast" data-toast role="status" aria-live="polite"></div>';

  /* ---------- Sections ---------- */
  var slides = [
    { label: 'WarmLune™ Heating Belt', title: 'Cordless warmth & massage, anywhere', hl: 'warmth', hl: 'warmth', text: '3 heat levels · 4 massage modes · USB rechargeable', url: 'heating-belt.html', img: 'img/gallery-1.jpg', alt: 'WarmLune heating belt' },
    { label: 'K-Beauty', title: 'Anua & Medicube, delivered across Bangladesh', hl: 'delivered', hl: 'delivered', text: 'Serums, cream and hydrogel masks.', url: catUrl('skincare'), img: 'img/p-anua-serum.jpg', alt: 'Anua niacinamide serum' },
    { label: 'Cash on delivery', title: 'Order now, pay when it arrives', hl: 'pay when it arrives', hl: 'pay when it arrives', text: 'Free delivery all over Bangladesh. Check your product before you pay.', url: 'products.html', img: 'img/lifestyle.jpg', alt: 'A woman relaxing at home' },
  ];
  var sides = [
    { label: 'Combo offer', title: 'Belt + Gel Mask combo', url: (byId('combo-belt-mask') || {}).url || 'products.html', img: 'img/p-combo-belt-mask.jpg' },
    { label: 'Skincare', title: 'Medicube PDRN Capsule Cream', url: (byId('medicube-capsule-cream') || {}).url || catUrl('skincare'), img: 'img/p-medicube-capsule-cream.jpg' },
  ];
  function catTiles(ids) {
    return ids.map(function (id) {
      var d = depts.filter(function (x) { return x.id === id; })[0]; if (!d) return '';
      var first = real.filter(function (p) { return p.category === id && p.image; })[0], n = count(id);
      return '<a class="ctile" href="' + catUrl(id) + '"><span class="cimg ' + (tones[id] || 't-grey') + '">' + (first ? '<img src="' + esc(first.image) + '" alt="" loading="lazy">' : icon(d.icon)) + '</span>' + esc(d.name) +
        '<span class="count" aria-label="' + n + ' products">' + n + '</span></a>';
    }).join('');
  }
  var ftabs = [
    { id: 'featured', label: 'Featured Products', items: real.filter(function (p) { return p.tags.indexOf('special') > -1 || p.tags.indexOf('trending') > -1; }) },
    { id: 'new', label: 'New Arrivals', items: real.filter(function (p) { return p.tags.indexOf('new') > -1; }) },
    { id: 'sale', label: 'Sale', items: real.filter(function (p) { return p.off > 0; }) },
  ];
  var feat = 'beauty', featItems = fill(real.filter(function (p) { return p.category === feat; }), 6, feat);
  var brands = [['WarmLune', 'WarmLune', ''], ['Anua', 'Anua', 'light'], ['Medicube', 'medicube', '']]
    .map(function (b) { return '<a class="brand-tile" href="products.html?q=' + encodeURIComponent(b[0]) + '"><span class="mark ' + b[2] + '">' + esc(b[1]) + '</span><span class="bn">' + esc(b[0]) + '</span></a>'; })
    .concat([1, 2, 3, 4, 5].map(function (i) { return '<span class="brand-tile sample" aria-label="Sample brand slot"><span class="mark">BRAND</span><span class="bn">Your brand ' + i + '</span></span>'; })).join('');
  var avg = reviews.length ? (reviews.reduce(function (s, r) { return s + r.rating; }, 0) / reviews.length).toFixed(1) : '';
  var ticker = ['FREE DELIVERY ALL OVER BANGLADESH', 'CASH ON DELIVERY', 'CHECK BEFORE YOU PAY', 'ORDER ON WHATSAPP ' + (W.phone || '')];
  var picks = fill(real.filter(function (p) { return p.tags.indexOf('trending') > -1; }), 5);
  function mvCard(p, i) {
    return '<div class="mvc">' + (p.image ? '<img src="' + esc(p.image) + '" alt="" loading="lazy">' : '<span class="ph ' + (tones[p.category] || 't-grey') + '">' + icon('box') + '</span>') +
      '<div><h3><a href="' + esc(p.url) + '"' + (p.sample ? '' : ' data-pid="' + esc(p.id) + '"') + '>' + esc(p.name) + '</a></h3><p>' + (p.sample ? '<span style="color:#8E939B;font-weight:500">Sample</span>' : money(p.price)) + '</p></div>' +
      (i != null ? '<span class="num" aria-hidden="true">' + (i + 1) + '</span>' : '<span></span>') + '</div>';
  }
  // Recently viewed: real, from this browser (product pages and product clicks save it)
  function mvList(which) {
    if (which === 'picks') return carousel('car-mv', picks.map(function (p, i) { return mvCard(p, i); }).join(''), 'mv-track');
    var seen = ls.get('bk-recent', []).map(byId).filter(Boolean).slice(0, 10);
    if (!seen.length) return '<p class="mv-empty">Products you look at will appear here, so you can find them again quickly.</p>';
    return carousel('car-mv', seen.map(function (p) { return mvCard(p); }).join(''), 'mv-track');
  }
  // Blog: sample cards until real articles exist (no made-up dates, authors, comments or views)
  var posts = [
    { title: 'How to use a heating belt safely', text: 'Heat levels, how long to wear it and simple safety tips for everyday comfort.', img: 'img/gallery-2.jpg', tag: 'Guides' },
    { title: 'Adding a niacinamide serum to your routine', text: 'When to apply it, what to pair it with and what results to expect over time.', img: 'img/p-anua-serum-3.jpg', tag: 'Skincare' },
    { title: 'What is PDRN in skincare?', text: 'The ingredient behind the Medicube pink range, explained in plain words.', img: 'img/p-medicube-pdrn-serum-2.jpg', tag: 'Skincare' },
    { title: 'Hydrogel masks: how long to leave them on', text: 'Get the most from a sheet mask, from prep to the final pat-in.', img: 'img/p-medicube-gel-mask-3.jpg', tag: 'How-to' },
  ];
  function post(a) {
    return '<article class="post"><div class="post-img"><img src="' + esc(a.img) + '" alt="" loading="lazy" width="500" height="320"><span class="post-tag">' + esc(a.tag) + '</span><span class="pbadge sample">Sample</span></div>' +
      '<div class="post-body"><p class="post-meta">' + icon('user') + 'Bakaina team</p><h3>' + esc(a.title) + '</h3><p class="post-text">' + esc(a.text) + '</p>' +
      '<span class="post-more">Article coming soon</span></div></article>';
  }

  var main =
    // Hero
    '<section class="hero" aria-label="Featured"><div class="wrap hero-grid">' +
      '<div class="slider" data-slider aria-roledescription="carousel" aria-label="Highlights"><div class="slides" data-slides>' + slides.map(function (s, i) {
        return '<div class="slide" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' of ' + slides.length + '"><div class="copy"><p class="label">' + esc(s.label) + '</p><h2>' + (s.hl ? esc(s.title).replace(esc(s.hl), '<span class="hl">' + esc(s.hl) + '</span>') : esc(s.title)) + '</h2><p class="txt">' + esc(s.text) + '</p>' +
          '<div class="s-ctas"><a class="btn btn-accent" href="' + esc(s.url) + '">Shop Now</a><a class="btn btn-brand" href="#h-cat">Explore</a></div></div><div class="pic"><img src="' + esc(s.img) + '" alt="' + esc(s.alt) + '"' + (i ? ' loading="lazy"' : '') + ' width="400" height="400"></div></div>';
      }).join('') + '</div>' +
      '<div class="s-arrows"><button class="round" type="button" data-sl="-1" aria-label="Previous slide">' + icon('up') + '</button><button class="round" type="button" data-sl="1" aria-label="Next slide">' + icon('down') + '</button></div>' +
      '<div class="s-dots">' + slides.map(function (s, i) { return '<button class="s-dot" type="button" data-dot="' + i + '" aria-label="Go to slide ' + (i + 1) + '"></button>'; }).join('') + '</div></div>' +
      '<div class="sides">' + sides.map(function (s) {
        return '<div class="side"><div><p class="label">' + esc(s.label) + '</p><h3>' + esc(s.title) + '</h3><a class="link-u" href="' + esc(s.url) + '">Shop now</a></div><img src="' + esc(s.img) + '" alt="" loading="lazy" width="200" height="200"></div>';
      }).join('') + '</div></div></section>' +
    // Trust strip
    '<section class="trust" aria-label="Why shop with us"><div class="wrap"><ul>' +
      [['truck', 'Free Delivery', 'All over Bangladesh'], ['cash', 'Cash on Delivery', 'Pay when it arrives'], ['box', 'Check Before You Pay', 'Open the parcel at delivery'], ['headset', 'WhatsApp Support', 'Quick replies, real people']]
        .map(function (t) { return '<li>' + icon(t[0]) + '<div><strong>' + t[1] + '</strong><span>' + t[2] + '</span></div></li>'; }).join('') + '</ul></div></section>' +
    // Shop by category
    '<section class="sec" aria-labelledby="h-cat"><div class="wrap"><div class="shead"><h2 id="h-cat">Shop by Category</h2><p>Browse every department. The number shows how many products are in each.</p></div>' +
      '<div class="tabs"><div class="tabs-in" role="tablist" aria-label="Department groups">' + groups.map(function (g, i) {
        return '<button class="tab" type="button" role="tab" id="ct-' + g.id + '" aria-selected="' + (i === 0) + '" tabindex="' + (i ? -1 : 0) + '" aria-controls="cat-panel" data-ctab="' + g.id + '">' + esc(g.label) + '</button>';
      }).join('') + '</div></div><div id="cat-panel" role="tabpanel" aria-labelledby="ct-' + groups[0].id + '">' + carousel('car-cat', catTiles(groups[0].cats), 'cols-8') + '</div></div></section>' +
    // Featured products
    '<section class="sec" aria-labelledby="h-feat" style="padding-top:0"><div class="wrap"><div class="shead"><h2 id="h-feat">Featured Products</h2><p>Hand-picked favourites, new arrivals and everything on sale.</p></div>' +
      '<div class="tabs"><div class="tabs-in" role="tablist" aria-label="Product groups">' + ftabs.map(function (t, i) {
        return '<button class="tab" type="button" role="tab" id="ft-' + t.id + '" aria-selected="' + (i === 0) + '" tabindex="' + (i ? -1 : 0) + '" aria-controls="feat-panel" data-ftab="' + t.id + '">' + esc(t.label) + '</button>';
      }).join('') + '</div></div><div id="feat-panel" role="tabpanel" aria-labelledby="ft-featured">' + carousel('car-feat', fill(ftabs[0].items, 6).map(card).join('')) + '</div>' +
      '<div class="center"><a class="btn btn-outline" href="products.html">See all products ' + icon('arrow') + '</a></div></div></section>' +
    // Featured category (dark)
    '<section class="sec fcat" aria-labelledby="h-fcat"><div class="wrap"><div class="shead"><h2 id="h-fcat">Featured Category</h2><p>The latest from one department, with quick links to everything inside it.</p></div>' +
      '<div class="fcat-box"><div class="fcat-side"><h3>' + esc(dname(feat)) + '</h3><div class="pic"><img src="img/p-medicube-pdrn-serum.jpg" alt="" loading="lazy"></div><ul>' +
        (subs[feat] || []).slice(0, 8).map(function (s) { return '<li><a href="' + catUrl(feat) + '">' + esc(s) + '</a></li>'; }).join('') + '<li><a class="more" href="' + catUrl(feat) + '">View more ›</a></li></ul></div>' +
      '<div><div class="fcat-head"><h3>Latest in ' + esc(dname(feat)) + '</h3><a class="link-u" href="' + catUrl(feat) + '">See all</a></div>' + carousel('car-fcat', featItems.map(card).join(''), 'cols-4') + '</div></div></div></section>' +
    // Ticker
    '<div class="ticker" aria-label="' + esc(ticker.join(' · ')) + '"><div class="ticker-track" aria-hidden="true">' + ticker.concat(ticker, ticker, ticker).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div></div>' +
    // Brands
    '<section class="sec" aria-labelledby="h-brand"><div class="wrap"><div class="shead"><h2 id="h-brand">Shop by Brand</h2><p>Shop from the brands we carry.</p></div>' + carousel('car-brand', brands, 'cols-8') + '</div></section>' +
    // Testimonials (real reviews only)
    (reviews.length ? '<section class="sec sec-white" aria-labelledby="h-rev"><div class="wrap"><div class="shead"><h2 id="h-rev">What our customers say</h2><p>' + avg + ' out of 5 from ' + reviews.length + ' customer reviews of the WarmLune™ Heating Belt.</p></div>' +
      carousel('car-rev', reviews.map(function (r) { return '<figure class="quote" style="margin:0"><span class="qm" aria-hidden="true">“</span><p lang="bn">' + esc(r.text) + '</p><figcaption><span class="st" aria-label="' + r.rating + ' stars">' + '★'.repeat(r.rating) + '</span><br><span class="who">– ' + esc(r.name) + '</span></figcaption></figure>'; }).join(''), 'cols-4') + '</div></section>' : '') +
    // From the blog (sample articles until real posts are written)
    '<section class="sec" aria-labelledby="h-blog"><div class="wrap"><div class="shead"><h2 id="h-blog">From the Blog</h2><p>Guides on using our products, skincare routines and everyday tips.</p></div>' +
      '<div class="tabs"><div class="tabs-in" role="tablist" aria-label="Articles">' + [['latest', 'Latest Articles'], ['read', 'Most Read']].map(function (t, i) {
        return '<button class="tab" type="button" role="tab" id="bt-' + t[0] + '" aria-selected="' + (i === 0) + '" tabindex="' + (i ? -1 : 0) + '" aria-controls="blog-panel" data-btab="' + t[0] + '">' + t[1] + '</button>';
      }).join('') + '</div></div><div id="blog-panel" role="tabpanel" aria-labelledby="bt-latest">' + carousel('car-blog', posts.map(post).join(''), 'cols-4 blog-track') + '</div></div></section>' +
    // Recently viewed / our picks (dark strip)
    '<section class="mv" aria-label="Product shortcuts"><div class="wrap"><div class="mv-tabs" role="tablist" aria-label="Product lists">' +
      '<button type="button" role="tab" id="mt-recent" aria-selected="true" aria-controls="mv-panel" data-mtab="recent">Recently Viewed</button>' +
      '<button type="button" role="tab" id="mt-picks" aria-selected="false" tabindex="-1" aria-controls="mv-panel" data-mtab="picks">Our Picks</button></div>' +
      '<div id="mv-panel" role="tabpanel" aria-labelledby="mt-recent">' + mvList('recent') + '</div></div></section>';

  var soc = S.social || {}, socials = ['facebook', 'instagram', 'youtube', 'tiktok'].filter(function (k) { return soc[k]; });
  var footer =
    '<footer class="ftr"><div class="wrap ftr-top"><a class="logo" href="preview.html" aria-label="Bakaina home"><span class="logo-badge-wide">' + '<img class="logo-full" src="img/logo-full.png" alt="' + esc(W.brand || 'Bakaina') + '" width="471" height="180">' + '</span></a>' +
      '<p class="ftr-tag">Shop Smarter. <span>Live Better.</span></p>' +
      (W.whatsapp ? '<a class="ftr-wa" href="' + HELP + '" target="_blank" rel="noopener">' + icon('chat') + '<span><small>Customer support</small>WhatsApp ' + esc(W.phone || '') + '</span></a>' : '') +
      (socials.length ? '<div class="socials">' + socials.map(function (k) { return '<a href="' + esc(soc[k]) + '" target="_blank" rel="noopener" aria-label="' + esc(W.brand || 'Bakaina') + ' on ' + ({ facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube', tiktok: 'TikTok' })[k] + '">' + icon(k) + '</a>'; }).join('') + '</div>' : '') + '</div>' +
    '<div class="wrap ftr-cols">' +
      '<nav aria-label="About"><h3>About Us</h3><ul><li><a href="delivery.html">Delivery information</a></li><li><a href="refund.html">Returns & refunds</a></li><li><a href="privacy.html">Privacy policy</a></li><li><a href="refund.html">Terms & conditions</a></li></ul></nav>' +
      '<nav aria-label="My account"><h3>My Account</h3><ul><li><a href="preview.html?view=account">Account</a></li><li><a href="products.html?view=wishlist">Wishlist</a></li><li><a href="' + TRACK + '" target="_blank" rel="noopener">Track order</a></li><li><a href="#" data-open="cart">Shopping cart</a></li></ul></nav>' +
      '<nav aria-label="Customer service"><h3>Customer Service</h3><ul><li><a href="' + HELP + '" target="_blank" rel="noopener">Contact us</a></li>' +
        (W.phone ? '<li><a href="tel:' + esc(W.phone) + '">' + icon('phone') + esc(W.phone) + '</a></li>' : '') + (W.email ? '<li><a href="mailto:' + esc(W.email) + '">' + icon('mail') + 'Email us</a></li>' : '') + '<li><a href="products.html">Shop all</a></li></ul></nav>' +
      '<div class="news-col"><h3 id="nl-h">Newsletter</h3><p>Get new arrivals and offers by email.</p><form class="news" data-news novalidate aria-labelledby="nl-h"><label class="sr-only" for="nl">Email address</label>' +
        '<input id="nl" type="email" name="email" placeholder="Your email address" autocomplete="email" required><input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">' +
        '<button type="submit" aria-label="Subscribe">' + icon('send') + '</button></form><p class="news-msg" data-news-msg role="status"></p></div>' +
    '</div><div class="wrap ftr-bottom"><span>© ' + new Date().getFullYear() + ' ' + esc(W.brand || 'Bakaina') + '. All rights reserved.</span><div class="pills" aria-label="Payment options">' +
      (S.payments || []).map(function (x) { return '<span class="pill">' + esc(x) + '</span>'; }).join('') + '</div></div></footer>' +
    '<nav class="fab-rail" aria-label="Quick contact">' +
      (W.phone ? '<a class="fr-call" href="tel:' + esc(W.phone) + '"><span class="fr-ic">' + icon('phone') + '</span><span class="fr-t">Call Now</span></a>' : '') +
      '<a class="fr-wa" href="' + HELP + '" target="_blank" rel="noopener"><span class="fr-ic">' + icon('wa') + '</span><span class="fr-t">WhatsApp</span></a>' +
      '<a class="fr-rev" href="review.html"><span class="fr-ic">' + icon('star') + '</span><span class="fr-t">Review Us</span></a></nav>' +
    '<button class="fab-top" type="button" data-top aria-label="Back to top" hidden>' + icon('up') + '</button>' +
    '<a class="fab-wa" href="' + HELP + '" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">' + icon('wa') + '<span class="fab-tip">Chat with us</span></a>';

  /* ---------- Render ---------- */
  $('[data-header]').outerHTML = header + drawers;
  if (VIEW === 'cat') {
    var cid = new URLSearchParams(location.search).get('c'), cd = depts.filter(function (x) { return x.id === cid; })[0] || depts[0], items = catList(cd.id);
    main = '<section class="sec catpg"><div class="wrap"><p class="crumb"><a href="preview.html">Home</a> / ' + esc(cd.name) + '</p>' +
      '<div class="catpg-grid"><aside class="catpg-side" aria-label="Departments"><h2>All Departments</h2><ul>' + depts.map(function (d) {
        return '<li><a href="' + catUrl(d.id) + '"' + (d.id === cd.id ? ' aria-current="page"' : '') + '>' + icon(d.icon) + esc(d.name) + '</a></li>';
      }).join('') + '</ul></aside>' +
      '<div><div class="catpg-head"><h1>' + esc(cd.name) + '</h1><p>' + items.length + ' products · grey “Sample” cards are product ideas, not yet in stock</p></div>' +
      '<div class="catpg-chips">' + depts.map(function (d) { return '<a href="' + catUrl(d.id) + '"' + (d.id === cd.id ? ' aria-current="page"' : '') + '>' + esc(d.name) + '</a>'; }).join('') + '</div>' +
      '<div class="catpg-list">' + items.map(card).join('') + '</div></div></div></div></section>';
    document.title = cd.name + ' – ' + (W.brand || 'Bakaina');
  }
  if (VIEW === 'account') {
    main = '<section class="sec acc"><div class="wrap"><p class="crumb"><a href="preview.html">Home</a> / My account</p><h1>My account</h1><div data-acc-root></div></div></section>';
    document.title = 'My account – ' + (W.brand || 'Bakaina');
  }
  if (VIEW === 'cart') { main = '<section class="sec cp"><div class="wrap"><p class="crumb"><a href="preview.html">Home</a> / Shopping cart</p><h1>Shopping cart</h1><div data-cart-page></div></div></section>'; document.title = 'Shopping cart – ' + (W.brand || 'Bakaina'); }
  $('#main').innerHTML = main;
  (function () { var cc = document.querySelector('.catpg-chips [aria-current]'); if (cc) cc.parentNode.scrollLeft = cc.offsetLeft - 16; })();
  $('[data-footer]').outerHTML = footer;
  counts();

  /* ---------- Behaviour ---------- */
  var tt; function toast(m) { var t = $('[data-toast]'); t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('show'); }, 2000); }
  function renderCart() {
    var body = $('[data-cart-body]'), foot = $('[data-cart-foot]');
    if (!cart.length) { body.innerHTML = '<div class="empty-cart"><p>Your cart is empty.</p><a class="btn btn-accent" href="products.html">Start shopping</a></div>'; foot.innerHTML = ''; return; }
    body.innerHTML = cart.map(function (x) {
      var p = byId(x.id);
      return '<div class="mini-item">' + (p.image ? '<img src="' + esc(p.image) + '" alt="">' : '<span class="ph t-grey">' + icon('box') + '</span>') + '<div><h3>' + esc(p.name) + '</h3><p>' + x.qty + ' × ' + money(p.price) + '</p>' +
        (cart.length > 1 ? '<a class="link-u" href="checkout.html?product=' + encodeURIComponent(p.checkoutId) + '&qty=' + x.qty + '">Order this</a>' : '') + '</div>' +
        '<button class="round-hit" type="button" data-remove="' + esc(p.id) + '" aria-label="Remove ' + esc(p.name) + '">' + icon('close') + '</button></div>';
    }).join('');
    var lines = cart.map(function (x) { var p = byId(x.id); return '• ' + p.name + ' × ' + x.qty + ' = ' + money(p.price * x.qty); });
    var only = cart.length === 1 ? byId(cart[0].id) : null;
    foot.innerHTML = '<div class="tot"><span>Total</span><strong>' + money(total()) + '</strong></div>' +
      (only ? '<a class="btn btn-accent" href="checkout.html?product=' + encodeURIComponent(only.checkoutId) + '&qty=' + cart[0].qty + '">Checkout</a>' : '') +
      '<a class="btn ' + (only ? 'btn-outline' : 'btn-accent') + '" href="' + wa('আসসালামু আলাইকুম, আমি এগুলো অর্ডার করতে চাই:\n' + lines.join('\n') + '\nমোট: ' + money(total()) + '\nনাম:\nমোবাইল:\nঠিকানা:') + '" target="_blank" rel="noopener">' + icon('chat') + 'Order on WhatsApp</a>';
  }
  var lastFocus = null;
  function open(name) {
    if (name === 'cart') renderCart();
    lastFocus = document.activeElement;
    $('[data-drawer="' + name + '"]').hidden = false; $('[data-scrim]').hidden = false; document.body.style.overflow = 'hidden';
    $('[data-close]', $('[data-drawer="' + name + '"]')).focus();
  }
  function closeAll() {
    $$('[data-drawer]').forEach(function (d) { d.hidden = true; }); $('[data-scrim]').hidden = true; document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  function setMega(on) { var b = $('[data-mega]'); if (!b) return; b.setAttribute('aria-expanded', String(on)); $('[data-dd]').classList.toggle('open', on); }
  // Hovering (or focusing) a department on the left shows its products on the right
  (function () {
    var list = $('.dm-list'); if (!list) return;
    function pick(a) {
      if (!a) return; $$('.dm-link').forEach(function (x) { x.classList.toggle('on', x === a); });
      $$('.dm-panel').forEach(function (x) { x.classList.toggle('on', x.getAttribute('data-dmp') === a.getAttribute('data-dm')); });
    }
    list.addEventListener('mouseover', function (e) { pick(e.target.closest('.dm-link')); });
    list.addEventListener('focusin', function (e) { pick(e.target.closest('.dm-link')); });
  })();

  document.addEventListener('click', function (e) {
    var pl = e.target.closest('a[data-pid]'); if (pl) remember(pl.getAttribute('data-pid'));
    var t = e.target.closest('[data-add],[data-heart],[data-open],[data-close],[data-scrim],[data-remove],[data-qty],[data-car],[data-mega],[data-acc],[data-ctab],[data-ftab],[data-btab],[data-mtab],[data-sl],[data-dot]');
    if (!t) { if (!e.target.closest('[data-dd]')) setMega(false); return; }
    if (t.hasAttribute('data-add')) { var id = t.getAttribute('data-add'), h = cart.filter(function (x) { return x.id === id; })[0]; if (h) h.qty = Math.min(10, h.qty + 1); else cart.push({ id: id, qty: 1 }); ls.set('bk-cart', cart); counts(); if (desk.matches && $('[data-mc]')) showMini(); else toast('Added to cart ✓'); }
    else if (t.hasAttribute('data-heart')) { var hid = t.getAttribute('data-heart'), i = wish.indexOf(hid); if (i > -1) wish.splice(i, 1); else wish.push(hid); ls.set('bk-wish', wish); counts(); $$('[data-heart="' + hid + '"]').forEach(function (b) { b.setAttribute('aria-pressed', String(i === -1)); }); toast(i === -1 ? 'Saved to wishlist' : 'Removed from wishlist'); }
    else if (t.hasAttribute('data-open')) { e.preventDefault(); open(t.getAttribute('data-open')); }
    else if (t.hasAttribute('data-close') || t.hasAttribute('data-scrim')) closeAll();
    else if (t.hasAttribute('data-remove')) { var inDrawer = !!t.closest('[data-drawer]'); cart = cart.filter(function (x) { return x.id !== t.getAttribute('data-remove'); }); ls.set('bk-cart', cart); counts(); renderCart(); if (inDrawer) $('[data-close]', $('[data-drawer="cart"]')).focus(); }
    else if (t.hasAttribute('data-qty')) { var q = cart.filter(function (x) { return x.id === t.getAttribute('data-qty'); })[0]; if (q) { q.qty = Math.max(1, Math.min(10, q.qty + Number(t.getAttribute('data-d')))); ls.set('bk-cart', cart); counts(); var nb = $('[data-qty="' + q.id + '"][data-d="' + t.getAttribute('data-d') + '"]'); if (nb && !nb.disabled) nb.focus(); } }
    else if (t.hasAttribute('data-car')) { var tr = document.getElementById(t.getAttribute('data-car')); tr.scrollBy({ left: Number(t.getAttribute('data-dir')) * tr.clientWidth * .8, behavior: reduce ? 'auto' : 'smooth' }); }
    else if (t.hasAttribute('data-mega')) setMega(t.getAttribute('aria-expanded') !== 'true');
    else if (t.hasAttribute('data-acc')) { var on = t.getAttribute('aria-expanded') !== 'true'; t.setAttribute('aria-expanded', String(on)); document.getElementById(t.getAttribute('aria-controls')).hidden = !on; }
    else if (t.hasAttribute('data-ctab')) selectTab(t, '[data-ctab]', 'cat-panel', function () { var g = groups.filter(function (x) { return x.id === t.getAttribute('data-ctab'); })[0]; return carousel('car-cat', catTiles(g.cats), 'cols-8'); });
    else if (t.hasAttribute('data-ftab')) selectTab(t, '[data-ftab]', 'feat-panel', function () { var f = ftabs.filter(function (x) { return x.id === t.getAttribute('data-ftab'); })[0]; return carousel('car-feat', fill(f.items, 6).map(card).join('')); });
    else if (t.hasAttribute('data-btab')) selectTab(t, '[data-btab]', 'blog-panel', function () { var list = t.getAttribute('data-btab') === 'read' ? posts.slice().reverse() : posts; return carousel('car-blog', list.map(post).join(''), 'cols-4 blog-track'); });
    else if (t.hasAttribute('data-mtab')) selectTab(t, '[data-mtab]', 'mv-panel', function () { return mvList(t.getAttribute('data-mtab')); });
    else if (t.hasAttribute('data-sl')) { go(cur + Number(t.getAttribute('data-sl'))); play(); }
    else if (t.hasAttribute('data-dot')) { go(Number(t.getAttribute('data-dot'))); play(); }
  });
  var desk = window.matchMedia('(min-width: 1000px)'), mcT = null;
  function hideMini() { var w = $('[data-mc]'); if (w) w.classList.remove('open'); document.body.classList.remove('mc-dimmed'); }
  function showMini() {
    var w = $('[data-mc]'); w.classList.add('open'); document.body.classList.add('mc-dimmed');
    clearTimeout(mcT); mcT = setTimeout(function () { if (!w.matches(':hover')) hideMini(); }, 3500);
  }
  (function () {
    var w = $('[data-mc]'); if (!w) return;
    w.addEventListener('mouseleave', function () { if (w.classList.contains('open')) { clearTimeout(mcT); mcT = setTimeout(hideMini, 400); } });
    w.addEventListener('mouseenter', function () { clearTimeout(mcT); });
    document.addEventListener('click', function (e) { if (!e.target.closest('[data-mc]') && !e.target.closest('[data-add]')) hideMini(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hideMini(); });
  })();
  function remember(id) { var r = ls.get('bk-recent', []).filter(function (x) { return x !== id; }); r.unshift(id); ls.set('bk-recent', r.slice(0, 12)); }
  function selectTab(btn, sel, panelId, html) {
    $$(sel).forEach(function (b) { var on = b === btn; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    var panel = document.getElementById(panelId); panel.setAttribute('aria-labelledby', btn.id); panel.innerHTML = html();
  }
  // Carousel arrows: hide the one that has nowhere to go
  function arrows() {
    $$('.car').forEach(function (c) {
      var t = $('.car-track', c), p = $('.car-prev', c), n = $('.car-next', c); if (!t || !p) return;
      p.classList.toggle('at-start', t.scrollLeft < 4);
      n.classList.toggle('at-end', t.scrollLeft + t.clientWidth >= t.scrollWidth - 4);
    });
  }
  document.addEventListener('scroll', function (e) { if (e.target.classList && e.target.classList.contains('car-track')) arrows(); }, true);
  window.addEventListener('resize', arrows);
  new MutationObserver(arrows).observe($('#main'), { childList: true, subtree: true });
  arrows();
  // Scroll reveal: each section below the first screen fades up the first time it comes into view
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    $$('#main > section, .ftr').forEach(function (el) {
      if (el.classList.contains('hero') || el.getBoundingClientRect().top < innerHeight) return;
      el.classList.add('reveal'); io.observe(el);
    });
  }
  // Customer accounts (Firebase): loaded only on the account page
  if (VIEW === 'account') {
    import('./auth.js?v=20261124b').then(function (m) {
      m.mountPortal($('[data-acc-root]'), { icon: icon, helpUrl: HELP, trackUrl: TRACK, wishlistUrl: 'products.html?view=wishlist', cartUrl: 'preview.html?view=cart' });
    }).catch(function () { $('[data-acc-root]').innerHTML = '<p>Could not load your account. Please refresh the page.</p>'; });
  }
  // Back to top: appears after scrolling down
  (function () {
    var tb = $('[data-top]'); if (!tb) return;
    function upd() { tb.hidden = scrollY < 600; }
    window.addEventListener('scroll', upd, { passive: true }); upd();
    tb.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); var m = $('#main'); if (m) m.focus({ preventScroll: true }); });
  })();
  // Arrow keys move between tabs
  $$('[role=tablist]').forEach(function (list) {
    list.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
      var tabs = $$('[role=tab]', list), i = tabs.indexOf(document.activeElement), nb = tabs[(i + d + tabs.length) % tabs.length]; nb.focus(); nb.click();
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setMega(false); if ($$('[data-drawer]').some(function (d) { return !d.hidden; })) closeAll(); }
    if (e.key !== 'Tab') return;
    var d = $$('[data-drawer]').filter(function (x) { return !x.hidden; })[0]; if (!d) return;
    var f = $$('a[href],button:not([disabled]),input', d).filter(function (x) { return x.offsetParent !== null; }); if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });
  // Search category picker: hover (desktop) or click opens it; picking a department fills the box
  (function () {
    function close(w) { w.classList.remove('open'); $('.scat-btn', w).setAttribute('aria-expanded', 'false'); }
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.scat-btn'), opt = e.target.closest('[data-scat-v]');
      $$('[data-scat]').forEach(function (w) { if (!w.contains(e.target)) close(w); });
      if (btn) { var w = btn.closest('[data-scat]'), on = !w.classList.contains('open'); w.classList.toggle('open', on); btn.setAttribute('aria-expanded', String(on)); w.classList.remove('picked'); }
      if (opt) {
        var wr = opt.closest('[data-scat]'), v = opt.getAttribute('data-scat-v');
        $('input[name=cat]', wr).value = v; $('[data-scat-label]', wr).textContent = v ? dname(v) : 'All';
        $$('[data-scat-v]', wr).forEach(function (o) { o.setAttribute('aria-pressed', String(o === opt)); });
        close(wr); wr.classList.add('picked'); $('.scat-btn', wr).focus(); var qi = $('input[name=q]', wr.closest('form')); if (qi) qi.focus();
      }
    });
    $$('[data-scat]').forEach(function (w) { w.addEventListener('mouseleave', function () { w.classList.remove('picked'); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') $$('[data-scat].open').forEach(function (w) { close(w); $('.scat-btn', w).focus(); }); });
  })();
  // Search → listing page
  $$('[data-search]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault(); var q = f.q.value.trim(), c = f.cat.value;
      location.href = q ? 'products.html?q=' + encodeURIComponent(q) : c ? catUrl(c) : 'products.html';
    });
  });
  // Hero slider
  var track = $('[data-slides]') || document.createElement('div'), n = track.children.length, cur = 0, timer = null, paused = !n;
  function go(i) {
    cur = (i + n) % n; track.style.transform = 'translateX(' + (-100 * cur) + '%)';
    $$('[data-dot]').forEach(function (d, j) { if (j === cur) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
    $$('.slide').forEach(function (s, j) { s.setAttribute('aria-hidden', String(j !== cur)); $$('a', s).forEach(function (a) { a.tabIndex = j === cur ? 0 : -1; }); });
  }
  function play() { clearInterval(timer); if (!reduce && !paused) timer = setInterval(function () { go(cur + 1); }, 5000); }
  var slider = $('[data-slider]') || document.createElement('div');
  ['mouseenter', 'focusin'].forEach(function (ev) { slider.addEventListener(ev, function () { paused = true; clearInterval(timer); }); });
  ['mouseleave', 'focusout'].forEach(function (ev) { slider.addEventListener(ev, function () { paused = false; play(); }); });
  var x0 = null;
  track.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); x0 = null; play(); });
  go(0); play();
  // Newsletter → Code.gs (action: subscribe)
  var news = $('[data-news]');
  news.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = $('[data-news-msg]'), email = news.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.textContent = 'Please enter a valid email address.'; news.email.focus(); return; }
    msg.textContent = 'Subscribing…';
    fetch(W.appsScriptUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'subscribe', email: email, website: news.website.value }) })
      .then(function (r) { return r.json(); }).then(function (res) { if (!res.ok) throw new Error(); msg.textContent = 'Thanks! You are on the list.'; news.reset(); })
      .catch(function () { msg.textContent = 'Could not subscribe right now. Please try again later.'; });
  });
})();
