# Bakaina — image prompts for every section

## Read first: real product vs AI
- **Product shots (gallery 1–4) must show the exact product you ship**: a pink wireless belt with an LCD display. AI tools invent wrong buttons, screens and shapes, and a buyer who gets something different returns it and leaves a bad review. Use your **supplier's real photos** for these. If you use AI, use **image-to-image / reference mode** with the real product photo uploaded, and check every detail before publishing.
- **Mood and lifestyle shots** (lifestyle, feature cards, showcase) are where AI is safest, again ideally with the real belt as a reference image.
- **Review photos: never AI.** Only real customer photos, with permission.
- Facebook ads: AI images of people are allowed, but Meta may label them as "AI info". Keep claims in the image honest: no "cures pain" text.

## Shared style (add to the end of every prompt)
> soft blush-pink and warm ivory palette (#FBE4EC, #FDF1F5, accents #C8305F), gentle diffused window light, clean minimal composition, premium skincare-brand aesthetic, shallow depth of field, photorealistic, high detail, no text, no logos, no watermark

**Negative prompt** (where the tool supports it):
> text, letters, watermark, logo, extra fingers, distorted hands, distorted product, wires, cables plugged in, medical setting, hospital, revealing clothing, cartoon, oversaturated

**People:** a South Asian / Bangladeshi woman in her 20s–30s, modest everyday clothing (kurti, salwar kameez or a soft loungewear set), natural makeup, relaxed and calm. The belt is worn **over a thin top or at the waistline**.

---

## 1. Product gallery (4 images, square 1:1, 1200 × 1200 px)
Files: `img/gallery-1.jpg` … `img/gallery-4.jpg` → `config.js → gallery[n].src`

**1 · Product (hero packshot)**
> Studio packshot of a slim pink wireless heating belt with a small rectangular LCD display on the front panel, belt laid in a soft curve on a seamless blush-pink background, centered, soft shadow underneath, three-quarter top-down angle, e-commerce hero product photo, 1:1

**2 · In use**
> A calm young Bangladeshi woman sitting cross-legged on a cream sofa, wearing a soft pastel kurti, a slim pink heating belt fastened around her waist over her top, one hand resting on the belt, eyes closed and a gentle smile, cozy home interior with cushions, morning window light, 1:1

**3 · Display**
> Extreme close-up of a small LCD display on a pink fabric heating belt, display glowing softly and showing a heat-level indicator, a woman's finger with natural nails pressing the button beside it, macro product photography, blurred blush background, 1:1

**4 · In the box**
> Flat lay from directly above on a warm ivory surface: a pink wireless heating belt neatly coiled, a short white USB charging cable and a small folded instruction card, arranged with even spacing, soft shadows, minimal premium unboxing photo, 1:1

> ⚠ Check the real box contents with your supplier. Only show what actually ships (the listing confirms the belt + charging cable).

---

## 2. Scroll-expansion showcase (under the product block)
Best as a **video**: 8–12 s, silent, looping, MP4 under 5 MB → `config.js → showcase.src`. Add a poster image (`showcase.poster`) from the first frame.
The card is portrait on phones and landscape on desktop, so **keep the subject in the center 50%**. Export 1920 × 1080; the centre must still work when cropped to 4:5.

**Video shot list** (film it yourself with the real belt, which beats AI here):
1. Close-up: fingers press the button and the LCD lights up (2 s)
2. Medium: she fastens the belt at her waist over her top (3 s)
3. Wide: she leans back on the sofa with a cup of tea and exhales, relaxed (4 s)
4. Slow push-in on her calm face (2–3 s)

**AI video / still prompt:**
> Cinematic slow push-in on a young Bangladeshi woman relaxing on a cream sofa at golden hour, a slim pink wireless heating belt around her waist over a soft pastel top, holding a cup of tea, peaceful expression, warm sunlight through sheer curtains, dreamy blush-pink grade, subject centered, 16:9

---

## 3. Lifestyle section, "পিরিয়ডের ব্যথাকে বিদায় বলুন" (≈ 6:5, 1440 × 1200 px)
File: `img/lifestyle.jpg` → `config.js → lifestyleImage`
> A young Bangladeshi woman curled up comfortably on a bed with soft cream and blush bedding, wearing modest pastel loungewear, a slim pink heating belt around her lower waist over her top, reading a book and smiling softly, warm afternoon window light, calm and cozy self-care moment, editorial lifestyle photography, 6:5

---

## 4. "Bakaina কেন সবার পছন্দ" (3 cards, square 1:1, 1000 × 1000 px)
Files: `img/feature-1.jpg`, `feature-2.jpg`, `feature-3.jpg` → `config.js → featureImages`

**Card 1 · 3 heat levels on an LCD display**
> Close-up of a pink wireless heating belt's LCD control panel, a soft warm orange-pink glow radiating gently from the pad surface to suggest warmth, blurred blush background, clean product macro shot, 1:1

**Card 2 · Peace of mind with auto shut-off**
> A young Bangladeshi woman at a bright home desk with a laptop, a slim pink heating belt at her waist over a cream kurti, focused and comfortable, a small analogue clock on the desk, soft daylight, calm productive mood, 1:1

**Card 3 · Light, portable, adjustable**
> An open pastel handbag on a café table with a neatly folded pink wireless heating belt peeking out next to sunglasses, a phone and a lipstick, a woman's hand reaching in, bright natural light, lifestyle flat-angle shot, 1:1

---

## 5. Facebook link preview / ad image (1200 × 630 px)
File: `img/og.jpg`, then set `<meta property="og:image">` in `index.html` to its full URL
> Split composition: on the left, a slim pink wireless heating belt with an LCD display floating at a slight angle on a blush-pink background; on the right, empty soft-pink negative space for text overlay; soft studio lighting, premium minimal ad layout, 1200×630

Add the text yourself in Canva or DaVinci (e.g. "পিরিয়ডের ব্যথায় আরামের উষ্ণতা · ৳৮৯৯ · ২টিতে ১০% ছাড়"). AI tools garble Bangla text.

---

## 6. Customer review photos
**No prompts, on purpose.** Use real photos sent by customers with their permission, via the review system or Facebook messages.

---

## After generating
1. Export JPG at 80% quality; keep each file **under 200 KB** (use squoosh.app). Phone speed matters.
2. Put them in `img/` with the file names above.
3. Fill the paths in `config.js` (`gallery[n].src`, `lifestyleImage`, `featureImages`, `showcase`).
4. Push. The pink placeholder boxes are replaced automatically.
