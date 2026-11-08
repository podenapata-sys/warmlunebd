# Bakaina — product page

A working build of the Bakaina product-page mockup: plain HTML, CSS and JS, no build step and no libraries. Open `index.html` or upload the folder to any static host (GitHub Pages, Netlify drop).

## Edit `config.js` (the only file you need to touch)
- **Price:** `currency`, `price`, `oldPrice`. For Bangladesh use `currency: '৳'`; whole taka shows without decimals.
- **Contact:** `whatsapp` and `phone` (already set to 01632932249).
- **Photos:** add paths in `gallery`, `lifestyleImage` and `featureImages`. Any left empty shows the design's pink placeholder box.
- **Stats band:** replace `[ব্যাটারি mAh]`, `[XX] মিনিট` and `[XX] সেকেন্ড` with your real specs.
- **Reviews:** add **real, verified** reviews to `reviews`. Until then the page shows the mockup's placeholder cards, marked in brackets. Fill them before running ads.
- **Rating line:** set `rating` and `reviewCount` only from real reviews.
- **Email:** your contact email for the footer.

Also fill the bracketed accordion and FAQ answers in `index.html` (box contents, specs, delivery, refund terms, battery, heat levels, skin use) from the manufacturer's information.

## Checkout & orders (Bangladesh)
"এখনই কিনুন" opens `checkout.html` with the chosen colour and quantity: COD inside Dhaka, ৳200 advance outside Dhaka (bKash, Nagad, Upay or Rocket — the customer picks which one and enters the transaction ID), and every order saved to a Google Sheet with Telegram/email alerts. Manage orders and approve verified reviews at `admin.html`. It's the same tested system as the Jaynamaz shop.

**Setup (once):**
1. Set `price` (and optionally `oldPrice`) in `config.js` **and** `PRICE` in `Code.gs`. Checkout stays closed while there's no price.
2. Deploy `Code.gs` as a Google Apps Script Web App: create a Sheet, paste in the script, set the Script Properties `ADMIN_PASSWORD` (plus optionally `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `ADMIN_EMAIL` = fssolutionsss@gmail.com, `BRAND`), run `setup`, then Deploy → Web app (Execute as: Me, Access: Anyone).
3. Paste the `/exec` URL into `appsScriptUrl` in `config.js`. Set `bkashNumber` (the default number for all wallets; give a wallet its own `number` in `payMethods` if it differs, as Rocket does; edit `payMethods` to add or remove wallets, and `PAY_METHODS` in `Code.gs` to match) and `pixelId`.

## Abandoned Cart
Once a customer types a valid mobile number at checkout, what they've entered (never the transaction ID) is saved to the **Abandoned** sheet. Unfinished checkouts appear under **🛒 Abandoned Cart** in `admin.html`, with call and WhatsApp buttons and a follow-up status. If the checkout becomes an order, or the same phone orders later, it is marked ordered automatically. Rows older than 30 days are deleted, as `privacy.html` promises. After updating `Code.gs`, redeploy it (Deploy → Manage deployments → ✏ → New version) or the tab stays empty.

## Policies
`delivery.html`, `refund.html` and `privacy.html` hold the full text in Bangla and English (both versions are in each file). Delivery 1–2 days in Dhaka, 2–4 outside; check-at-delivery plus a 7-day replacement for defects, no change-of-mind returns; the ৳200 advance is kept if a parcel is refused with nothing wrong with it. If you change a term, edit it in the page, the FAQ text in `i18n.js` (`acc.deliveryBody`, `acc.refundBody`) and `returnPolicy` in `config.js`.

## Quantity discount
`qtyDiscount: { minQty: 2, percent: 10 }` in `config.js` shows an offer banner, a live total with "you save ৳…" and a nudge ("add 1 more for 10% off") on the product page, and a discount row at checkout and on the thank-you page. **Set the same values in `QTY_DISCOUNT` in `Code.gs`.** The server recalculates every total, so the browser can't fake it. Set `percent: 0` to turn it off.

## Scroll-expansion showcase
Below the product block, a card grows to full screen as visitors scroll, while the title words slide apart. It never locks or redirects scrolling, so the "Buy now" path is never blocked. Add a short, silent, looping product video (MP4, ideally under 5 MB) in `config.js → showcase`. It only downloads when the section is near the screen. Visitors who prefer reduced motion see it already expanded.

## English / বাংলা
The EN / বাংলা toggle (product page, checkout and thank-you) switches every label, message and number, and remembers the choice. Link straight to a language with `?lang=en` or `?lang=bn` (handy for ads).
- Page wording lives in `i18n.js` as `[bangla, english]` pairs.
- Values in `config.js` take an `_en` twin, e.g. `name` / `name_en`, `label` / `label_en`, `text` / `text_en` for reviews.
- Orders are always saved in Bangla on the server (district names, product names), so your Sheet and admin stay consistent whichever language the customer used.
- `review.html` and `admin.html` are Bangla only.

## Not wired yet
- **Newsletter:** saves emails in the visitor's browser only. Connect Mailchimp/Brevo or a Google Sheet to actually collect them.
