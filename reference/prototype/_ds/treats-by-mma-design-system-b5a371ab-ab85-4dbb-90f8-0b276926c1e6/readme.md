# Treats by MMA — Design System

Brand identity + design system for **Treats by MMA**, a Nigerian baking and confectionery business (Suleja, Abuja) making celebration cakes, pastries, banana bread, snacks, small chops, yogurt and yogurt fura.

**Positioning:** A warm, contemporary, quality-focused baking and treats brand that makes everyday cravings and special celebrations more delightful.

## Sources
- `uploads/mma.jpg` — **official logo** (raster JPG, 1254², cream background). Copied unaltered to `assets/logo/treats-by-mma-logo.png`.
- `uploads/mma-design.jpg` — existing signage/flyer (logo on wood wall, product list, contact details). Copied to `assets/reference/original-signage-flyer.png`; its six product thumbnails were cropped to `assets/photos/concept-*.png`.
- Written design brief (in chat). No codebase, Figma, website, font files or real product photography were supplied.

Facts taken from the flyer (confirm before publishing): WhatsApp 0813 107 7321 / 0815 585 6020 · Facebook "Eze Chinwendu" · Instagram @treats_by_mma · TikTok @.mmacakeandpastry · Festmed Primary School, Gwuzunu, Kaduna Road, Suleja, Abuja. Descriptor on logo: "Cakes and Pastries".

---

## 1. Brand audit
**Logo anatomy:** a two-tier cocoa cake with glossy pink drip, gold heart crown and pink pearls, sitting on a gold cake stand; gold "MMA" monogram with pink ribbon swash on the cake; "Treats by MMA" wordmark in a bevelled gold display serif with a script "by"; "Cakes and Pastries" in white geometric sans inside a cocoa pill flanked by gold rules and a pink heart.

**Colours extracted:** cocoa `#3D1D10`, gold `#E8B323` (gradient `#F7DC85 → #B98A14`), icing pink `#E8358F`, logo-ground cream (≈`#FBF1E4`, re-tuned in the system to butter vanilla `#FFF4DC` to avoid a beige/ivory look), white.

**Strengths:** reads instantly as "celebration cake"; rich, appetising, high-contrast palette; generous, friendly lettering; heart motif adds warmth.

**Limitations (documented, not altered):**
- Raster only, cream background baked in — no transparent or vector version. **Request the original vector/PNG files.**
- Glossy 3D bevels and fine detail break down below ~120px and in 1-colour print.
- Descriptor "Cakes and Pastries" undersells snacks, small chops, yogurt and fura.
- Spelling: flyer uses "Yoghurt Fura"; brief uses "Yogurt Fura". This system uses **"Yogurt"** — confirm.

**Proposed (provisional) secondary mark:** `assets/logo/proposed-cake-monogram.png` — an unaltered crop of the cake + MMA symbol, for avatars, seals and stickers. A clean vector redraw is recommended but must be commissioned and approved separately; it is **not** the official logo.

**Creative direction:** *contemporary artisan bakery × joyful modern Nigerian treats brand.* The logo's cocoa-and-gold richness carries the premium; icing pink is the celebratory spark; butter vanilla keeps everything clean and appetising. The system is recognisable without the logo through: Caprasimo headlines, the cocoa/gold/pink ratio, arch-framed photography, the ribbon rule and the icing-drip edge.

---

## 2. CONTENT FUNDAMENTALS (brand voice)
**Voice:** warm and welcoming · deliciously descriptive · friendly but professional · cheerful, not childish · confident, not boastful · crystal-clear about ordering.

- **Person:** "we" (Treats by MMA) and "you" (the customer). Always write the name "Treats by MMA" — never "TBM", "MMA Treats" or "Treats By MMA".
- **Case:** sentence case for headlines and buttons ("Plan a celebration cake"); Title Case for product names ("Classic Banana Bread"); UPPERCASE only for small tracked labels/badges.
- **Emoji:** not in brand graphics or UI. Allowed sparingly in social captions/WhatsApp replies (max 1–2, food or heart: 🎂 🤍), never as icons.
- **Describe food with senses**, not superlatives: "soft crumb, golden crust" beats "the best ever".
- **Ordering copy is plain and specific:** lead times, pickup/delivery and confirmation steps always stated. Unknown facts appear as `[to confirm]` placeholders — never invent prices, delivery areas, ingredients, health claims, reviews or awards.
- **Currency:** ₦ followed directly by the amount with thousands commas: ₦12,000.

**Brand essence:** Sweet moments, made with care.
**Positioning statement:** For families and friends in and around Abuja, Treats by MMA is the warm, dependable treats kitchen that makes both milestone celebrations and everyday cravings more delightful — through quality products, beautiful presentation and service you can count on.
**Brand story:** Treats by MMA began with a simple belief: good food brings people together. From a birthday cake that makes someone feel celebrated to a warm loaf of banana bread on an ordinary afternoon, every treat is made with the same care. Cakes, pastries, small chops, yogurt and yogurt fura — familiar favourites, done beautifully. *(Owner to add real founding details.)*
**Mission:** To make delicious, carefully made treats that bring joy to every occasion, served with warmth and reliability.
**Brand promise:** Made with care, presented beautifully, delivered as promised.
**Values:** Quality in every batch · Warm, honest service · Beautiful presentation · Shared joy · Consistency you can trust.
**Tagline (recommendation — not official):** "Treats that make the moment." Alternatives: "Every day sweeter." · "Baked with heart, made for sharing."
**Bio (social, 150 chars):** Cakes, pastries, banana bread, small chops & yogurt fura 🎂 Celebration orders & everyday treats · Suleja, Abuja · Order on WhatsApp ↓

**Sample copy**
- Caption (cake): "Pink, gold and a whole lot of love — this drip cake was made for a very special birthday. Planning one? Send us your date and we'll take it from there."
- Caption (everyday): "Banana bread o'clock. Soft, golden and still warm — message us to reserve a loaf."
- Caption (fura): "Chilled yogurt fura for this heat. Creamy, fresh and ready when you are."
- Product description: "Classic Banana Bread — A soft, moist loaf with a golden crust, sliced or whole. [Size and ingredients to confirm.]"
- Product description: "Small Chops Platter — Party-ready and packed to share: [contents to confirm]."
- Headlines: "Your day, your cake, done beautifully." · "Fresh out of the oven." · "Party platters, sorted." · "Something sweet for every craving."
- CTAs: Order now · Order on WhatsApp · Plan a celebration cake · Browse the menu · Reserve yours · Send cake request
- Customer service: "Hi [Name]! Thank you for reaching out to Treats by MMA. 😊 Your [item] for [date] is noted — we'll confirm the price and pickup time shortly." · "So sorry, we're fully booked for [date]. Could [alternative date] work? We'd love to bake for you." · "Your order is ready for pickup! See you soon."

---

## 3. VISUAL FOUNDATIONS
**Colour** (`tokens/colors.css`) — four brand colours from the logo plus proposed fresh accents.
- Cocoa `#3D1D10` (primary brand, all text, dark grounds) · Gold `#E8B323` (signature highlight — *only* on cocoa; fails on cream) · Icing pink `#E8358F` (accent/celebration) and `#C81F75` (primary action, AA with white) · Butter vanilla `#FFF4DC` (page). Proposed: Milk blue `#4A8FD0` (yogurt/fura), Leaf green `#2E9A4E` (small chops), Sky (info only).
- **Deliberate exclusions:** no orange, terracotta, coral or clay tones anywhere, and no grey-beige/ivory neutrals — that combination is strongly associated with generic AI-product branding. The neutral is a custard-yellow *butter vanilla* (`#FFF4DC`) that ties to the gold, not a parchment beige.
- **Proportion:** 60 butter vanilla · 25 cocoa · 10 gold · 5 pink. One category accent per layout, replacing part of the pink share.
- **Text:** cocoa on cream (14:1) or cream on cocoa. Secondary text cocoa-600. Gold text only on cocoa (8:1). White on icing-500 for large text only.
- **Gradients:** only the gold-foil gradient (on cocoa, for ribbons/foil accents). No background gradients; photo scrims only (cocoa, bottom-up, for text on photos).

**Type** (`tokens/typography.css`) — **Caprasimo** (display, 400 only — chunky soft serif echoing "Treats") + **Figtree** (UI/body 400–800, echoing the descriptor sans). Display 72/46 · H1 52/36 · H2 38/29 · H3 28/23 · H4 Figtree 700 22/19 · body 16/1.55 · small 14 · labels 12 uppercase +0.12em. Prices Figtree 800 tabular. One pink word per headline max. No script fonts outside the logo.

**Spacing & layout** (`tokens/spacing.css`) — 4px unit; sections 96px (64 mobile); container 1200; 12-col / 24 gutter desktop, 4-col / 16 mobile; page margin 32 / 20. Dense layouts (menus, price lists) 8–12px gaps; editorial/hero 32–64px.

**Shape:** radii 4/8/14/20/28/pill; the **arch** (999px top, 20px bottom = cake dome) is the signature crop for hero/category photos. Buttons and badges are pills; cards 20px; inputs 14px.

**Cards:** cream-0 surface, 1px `--border-subtle`, `--shadow-1` at rest; hover lifts 3px to `--shadow-3` and photo scales 1.04. No coloured left-border accents.

**Shadows:** warm cocoa-tinted (`rgba(61,29,16,…)`), never grey. Three levels + pink focus ring.

**Backgrounds:** flat cream or cocoa; full-bleed photography for heroes/posts; no repeating patterns behind text. The cake-layer band and icing drip are trims, not wallpapers.

**Motifs** (max two per layout): icing drip edge · ribbon rule (pink line + heart, from logo underline) · arch frame (+ gold ring for celebration) · cake-layer band (packaging).

**Imagery vibe:** warm white balance, soft window light, lifted shadows, true pinks, real texture; cream/wood/linen surfaces. Avoid heavy filters and stock props.

**Motion:** gentle and short. 120–360ms, `cubic-bezier(.2,.7,.2,1)`; fades + small lifts; drawers slide. No bounces/confetti.

**States:** hover = one step darker (pink 600→700, cocoa 800→900) or cream-200 wash for ghost/outline; press = darker again + scale .97; focus = 2px cream gap + 2px pink ring; disabled = cream-200 fill, cocoa-500 text.

**Transparency/blur:** only cocoa scrims on photos and the drawer overlay (40%). No glassmorphism.

**Print note:** gold is a CMYK approximation (C0 M25 Y90 K5) — use Pantone 7409 C or metallic 871 C for premium; small text always cocoa rich-black, never pink or gold under 8pt; pink `#E8358F` shifts duller in CMYK — proof before runs.

---

## 4. ICONOGRAPHY
- **System:** [Lucide](https://lucide.dev) loaded from CDN (`lucide-static@0.460.0`) via the `Icon` component (CSS mask, tinted with `currentColor`). **Substitution flag:** the brand had no icon set; Lucide was chosen for its 2px rounded stroke, matching the soft brand shapes.
- **Style:** 24px grid, 2px stroke, round caps/joins, outline only. Colour cocoa or icing-700; gold only on cocoa. Icon wells: cream-200 or icing-100 rounded squares (14–16px radius).
- **Core set:** cake, cake-slice, croissant, sandwich (small chops), cup-soda / milk (yogurt & fura), gift, party-popper, shopping-bag, truck, store, message-circle, phone, clock, package, info, map-pin, heart.
- **Not used:** emoji as icons, chef hats, cupcake clip-art, sprinkles, mixed icon sets. Unicode ♥︎ appears only as the ribbon-rule ornament (from the logo).
- **Roles:** photography = sells the product; icons = navigation and information; motifs = brand framing; badges = status/promo. Illustration is not part of the system.

---

## 5. Product category architecture
| Family | Accent | Icon |
|---|---|---|
| Cakes (celebration, custom, slices) | Icing pink | cake |
| Pastries & Banana Bread | Gold | croissant |
| Small Chops & Snacks | Leaf | sandwich |
| Yogurt & Fura | Milk blue | cup-soda |
| Celebration Boxes (assorted, gifts) | Cocoa | gift |

Accent appears as a dot, label colour, placeholder tint or ring — never as a different logo, font or full background (except one-off category stickers).

## 6. Packaging rules
Two tiers: **Everyday** (kraft/white stock + 1-colour cocoa stamp, stickers, sleeves) and **Celebration** (cream box, cocoa lid band, pink drip edge, gold ribbon, monogram seal). Logo or monogram on top/front; product name in Caprasimo is the largest label element; required info (ingredients, allergens, weight, dates, storage, contact) in a separate plain zone, Figtree ≥7pt, no decoration behind it. No regulatory marks unless officially granted.

## 7. Social rules
Formats 4:5 feed (1080×1350), 1:1, 9:16 stories. 6% margins; monogram or handle ≥4% width, bottom or top corner; max 2 type sizes + 1 label. Four families: **Product** (photo ≥70%), **Promo** (cocoa/gold, offer largest), **Info** (cream, lists, carousel), **Celebration** (arch + gold ring + ribbon rule). Reviews only from genuine customers.

## 8. Quality checklist
Logo unaltered and on cream (or cream tile) · ≤ one pink headline word · gold never on cream for text · one category accent · ≤2 motifs · real photo or "Conceptual image" label · prices/details as placeholders until confirmed · AA contrast · ≥44px touch targets.

---

## Index
- `styles.css` — entry; imports `tokens/fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `base.css`
- `tokens/tokens.json` — JSON token export for design tools
- `assets/logo/` — official logo, proposed monogram crop · `assets/photos/` — conceptual crops · `assets/reference/` — original flyer
- `guidelines/` — foundation + brand cards (colours, type, spacing, logo, motifs, icons, mood board, photography, voice, categories)
- `applications/` — social templates, packaging, stationery mockups
- `templates/social-post/` — editable social post template (Design Component)
- `ui_kits/storefront/` — interactive ordering website concept
- `SKILL.md` — agent skill entry

## Components
`components/core`: **Icon**, **Button**, **IconButton**, **Badge** · `components/commerce`: **Price**, **ProductCard**, **CategoryCard**, **QuantityStepper** · `components/forms`: **TextField**, **SelectField**, **OptionCard**, **Checkbox** · `components/feedback`: **AnnouncementBanner**, **Alert**, **EmptyState** · `components/navigation`: **NavBar**, **CategoryTabs** · `components/brand`: **RibbonRule**, **IcingEdge**, **PhotoFrame**, **SectionHeading**.

No source component library existed — this is an authored standard set sized to an ordering site. Brand-specific additions (RibbonRule, IcingEdge, PhotoFrame, OptionCard, Price) exist to encode the brand's motifs and ordering needs.

## Finalised vs provisional
**Final (from logo):** cocoa, gold, icing pink, cream; logo usage rules. **Provisional (need owner approval):** fonts (Google substitutes), milk/leaf accents, tagline, monogram crop, category names, all copy samples, packaging concepts. All imagery is **conceptual** (cropped from the supplied flyer; may not be genuine Treats by MMA products).
