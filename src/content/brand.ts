/* Brand content for the Design System, Playbook, Voice & Knowledge and Asset Library pages.
   Every string is taken from the design system readme (_ds/.../readme.md), the project README or
   the manifest card descriptions. Nothing here is invented; unknowns stay as [to confirm]. */

export const BRAND = {
  name: 'Treats by MMA',
  summary: 'A Nigerian baking and confectionery business (Suleja, Abuja) making celebration cakes, pastries, banana bread, snacks, small chops, yogurt and yogurt fura.',
  positioning: 'A warm, contemporary, quality-focused baking and treats brand that makes everyday cravings and special celebrations more delightful.',
  essence: 'Sweet moments, made with care.',
  positioningStatement: 'For families and friends in and around Abuja, Treats by MMA is the warm, dependable treats kitchen that makes both milestone celebrations and everyday cravings more delightful — through quality products, beautiful presentation and service you can count on.',
  story: 'Treats by MMA began with a simple belief: good food brings people together. From a birthday cake that makes someone feel celebrated to a warm loaf of banana bread on an ordinary afternoon, every treat is made with the same care. Cakes, pastries, small chops, yogurt and yogurt fura — familiar favourites, done beautifully.',
  storyNote: 'Owner to add real founding details.',
  mission: 'To make delicious, carefully made treats that bring joy to every occasion, served with warmth and reliability.',
  promise: 'Made with care, presented beautifully, delivered as promised.',
  values: ['Quality in every batch', 'Warm, honest service', 'Beautiful presentation', 'Shared joy', 'Consistency you can trust'],
  tagline: 'Treats that make the moment.',
  taglineAlternatives: ['Every day sweeter.', 'Baked with heart, made for sharing.'],
  bio: 'Cakes, pastries, banana bread, small chops & yogurt fura 🎂 Celebration orders & everyday treats · Suleja, Abuja · Order on WhatsApp ↓',
  creativeDirection: 'Contemporary artisan bakery × joyful modern Nigerian treats brand. The logo’s cocoa-and-gold richness carries the premium; icing pink is the celebratory spark; butter vanilla keeps everything clean and appetising. The system is recognisable without the logo through: Caprasimo headlines, the cocoa/gold/pink ratio, arch-framed photography, the ribbon rule and the icing-drip edge.',
} as const;

/** Facts taken from the supplied flyer — the readme says to confirm them before publishing. */
export const FACTS: { label: string; value: string; icon: string; href?: string }[] = [
  { label: 'WhatsApp', value: '0813 107 7321', icon: 'message-circle', href: 'https://wa.me/2348131077321' },
  { label: 'WhatsApp', value: '0815 585 6020', icon: 'message-circle', href: 'https://wa.me/2348155856020' },
  { label: 'Facebook', value: 'Eze Chinwendu', icon: 'facebook' },
  { label: 'Instagram', value: '@treats_by_mma', icon: 'instagram', href: 'https://www.instagram.com/treats_by_mma' },
  { label: 'TikTok', value: '@.mmacakeandpastry', icon: 'music-2', href: 'https://www.tiktok.com/@.mmacakeandpastry' },
  { label: 'Location', value: 'Festmed Primary School, Gwuzunu, Kaduna Road, Suleja, Abuja', icon: 'map-pin' },
  { label: 'Descriptor on logo', value: 'Cakes and Pastries', icon: 'tag' },
];

export const AUDIT = {
  anatomy: 'A two-tier cocoa cake with glossy pink drip, gold heart crown and pink pearls, sitting on a gold cake stand; gold “MMA” monogram with pink ribbon swash on the cake; “Treats by MMA” wordmark in a bevelled gold display serif with a script “by”; “Cakes and Pastries” in white geometric sans inside a cocoa pill flanked by gold rules and a pink heart.',
  colours: 'Cocoa #3D1D10, gold #E8B323 (gradient #F7DC85 → #B98A14), icing pink #E8358F, logo-ground cream (≈#FBF1E4, re-tuned in the system to butter vanilla #FFF4DC to avoid a beige/ivory look), white.',
  strengths: ['Reads instantly as “celebration cake”', 'Rich, appetising, high-contrast palette', 'Generous, friendly lettering', 'Heart motif adds warmth'],
  limitations: [
    'Raster only, cream background baked in — no transparent or vector version. Request the original vector/PNG files.',
    'Glossy 3D bevels and fine detail break down below ~120px and in 1-colour print.',
    'Descriptor “Cakes and Pastries” undersells snacks, small chops, yogurt and fura.',
    'Spelling: flyer uses “Yoghurt Fura”; brief uses “Yogurt Fura”. This system uses “Yogurt” — confirm.',
  ],
  monogram: 'An unaltered crop of the cake + MMA symbol, for avatars, seals and stickers. A clean vector redraw is recommended but must be commissioned and approved separately; it is not the official logo.',
};

export const VOICE = {
  traits: ['Warm and welcoming', 'Deliciously descriptive', 'Friendly but professional', 'Cheerful, not childish', 'Confident, not boastful', 'Crystal-clear about ordering'],
  rules: [
    { title: 'Person', body: '“We” (Treats by MMA) and “you” (the customer). Always write the name “Treats by MMA” — never “TBM”, “MMA Treats” or “Treats By MMA”.' },
    { title: 'Case', body: 'Sentence case for headlines and buttons (“Plan a celebration cake”); Title Case for product names (“Classic Banana Bread”); UPPERCASE only for small tracked labels/badges.' },
    { title: 'Emoji', body: 'Not in brand graphics or UI. Allowed sparingly in social captions/WhatsApp replies (max 1–2, food or heart: 🎂 🤍), never as icons.' },
    { title: 'Describe food with senses', body: 'Not superlatives: “soft crumb, golden crust” beats “the best ever”.' },
    { title: 'Ordering copy is plain and specific', body: 'Lead times, pickup/delivery and confirmation steps always stated. Unknown facts appear as [to confirm] placeholders — never invent prices, delivery areas, ingredients, health claims, reviews or awards.' },
    { title: 'Currency', body: '₦ followed directly by the amount with thousands commas: ₦12,000.' },
  ],
  doDont: [
    { do: 'Soft crumb, golden crust.', dont: 'The best ever.' },
    { do: 'Treats by MMA', dont: 'TBM · MMA Treats · Treats By MMA' },
  ],
  samples: [
    { group: 'Captions', items: [
      { label: 'Caption (cake)', text: 'Pink, gold and a whole lot of love — this drip cake was made for a very special birthday. Planning one? Send us your date and we’ll take it from there.' },
      { label: 'Caption (everyday)', text: 'Banana bread o’clock. Soft, golden and still warm — message us to reserve a loaf.' },
      { label: 'Caption (fura)', text: 'Chilled yogurt fura for this heat. Creamy, fresh and ready when you are.' },
    ] },
    { group: 'Product descriptions', items: [
      { label: 'Classic Banana Bread', text: 'Classic Banana Bread — A soft, moist loaf with a golden crust, sliced or whole. [Size and ingredients to confirm.]' },
      { label: 'Small Chops Platter', text: 'Small Chops Platter — Party-ready and packed to share: [contents to confirm].' },
    ] },
    { group: 'Headlines', items: [
      { label: 'Headline', text: 'Your day, your cake, done beautifully.' },
      { label: 'Headline', text: 'Fresh out of the oven.' },
      { label: 'Headline', text: 'Party platters, sorted.' },
      { label: 'Headline', text: 'Something sweet for every craving.' },
    ] },
    { group: 'Customer service', items: [
      { label: 'Order noted', text: 'Hi [Name]! Thank you for reaching out to Treats by MMA. 😊 Your [item] for [date] is noted — we’ll confirm the price and pickup time shortly.' },
      { label: 'Fully booked', text: 'So sorry, we’re fully booked for [date]. Could [alternative date] work? We’d love to bake for you.' },
      { label: 'Ready for pickup', text: 'Your order is ready for pickup! See you soon.' },
    ] },
  ],
  ctas: ['Order now', 'Order on WhatsApp', 'Plan a celebration cake', 'Browse the menu', 'Reserve yours', 'Send cake request'],
};

export const COLOUR_RULES = {
  palette: 'Four brand colours from the logo plus proposed fresh accents.',
  roles: [
    'Cocoa #3D1D10 (primary brand, all text, dark grounds)',
    'Gold #E8B323 (signature highlight — only on cocoa; fails on cream)',
    'Icing pink #E8358F (accent/celebration) and #C81F75 (primary action, AA with white)',
    'Butter vanilla #FFF4DC (page)',
    'Proposed: Milk blue #4A8FD0 (yogurt/fura), Leaf green #2E9A4E (small chops), Sky (info only)',
  ],
  exclusions: 'No orange, terracotta, coral or clay tones anywhere, and no grey-beige/ivory neutrals — that combination is strongly associated with generic AI-product branding. The neutral is a custard-yellow butter vanilla (#FFF4DC) that ties to the gold, not a parchment beige.',
  proportion: [['Butter vanilla', 60, '#FFF4DC'], ['Cocoa', 25, '#3D1D10'], ['Gold', 10, '#E8B323'], ['Pink', 5, '#E8358F']] as [string, number, string][],
  proportionNote: 'One category accent per layout, replacing part of the pink share.',
  text: 'Cocoa on cream (14:1) or cream on cocoa. Secondary text cocoa-600. Gold text only on cocoa (8:1). White on icing-500 for large text only.',
  gradients: 'Only the gold-foil gradient (on cocoa, for ribbons/foil accents). No background gradients; photo scrims only (cocoa, bottom-up, for text on photos).',
  print: 'Gold is a CMYK approximation (C0 M25 Y90 K5) — use Pantone 7409 C or metallic 871 C for premium; small text always cocoa rich-black, never pink or gold under 8pt; pink #E8358F shifts duller in CMYK — proof before runs.',
};

export const TYPE_RULES = {
  summary: 'Caprasimo (display, 400 only — chunky soft serif echoing “Treats”) + Figtree (UI/body 400–800, echoing the descriptor sans).',
  rules: ['Prices Figtree 800 tabular.', 'One pink word per headline max.', 'No script fonts outside the logo.', 'Labels 12 uppercase +0.12em.'],
  substitution: 'Google Fonts substitutes chosen to echo the logo lettering (no font files were supplied).',
};

export const LAYOUT_RULES = [
  '4px unit; sections 96px (64 mobile); container 1200; 12-col / 24 gutter desktop, 4-col / 16 mobile; page margin 32 / 20.',
  'Dense layouts (menus, price lists) 8–12px gaps; editorial/hero 32–64px.',
];

export const SHAPE_RULES = [
  'Radii 4/8/14/20/28/pill; the arch (999px top, 20px bottom = cake dome) is the signature crop for hero/category photos.',
  'Buttons and badges are pills; cards 20px; inputs 14px.',
  'Cards: cream-0 surface, 1px --border-subtle, --shadow-1 at rest; hover lifts 3px to --shadow-3 and photo scales 1.04. No coloured left-border accents.',
  'Shadows: warm cocoa-tinted (rgba(61,29,16,…)), never grey. Three levels + pink focus ring.',
  'Backgrounds: flat cream or cocoa; full-bleed photography for heroes/posts; no repeating patterns behind text. The cake-layer band and icing drip are trims, not wallpapers.',
];

export const MOTIFS = [
  { name: 'Icing drip edge', body: 'A trim along a section edge — never a wallpaper.' },
  { name: 'Ribbon rule', body: 'Pink line + heart, from the logo underline.' },
  { name: 'Arch frame', body: 'The cake-dome crop for hero and category photos; add a gold ring for celebration.' },
  { name: 'Cake-layer band', body: 'Packaging trim (sleeves, lid bands).' },
];
export const MOTIF_RULE = 'Max two motifs per layout. Each motif is lifted from the logo.';

export const ICONS = {
  system: 'Lucide (lucide-static@0.460.0) via the Icon component (CSS mask, tinted with currentColor). Substitution flag: the brand had no icon set; Lucide was chosen for its 2px rounded stroke, matching the soft brand shapes.',
  style: '24px grid, 2px stroke, round caps/joins, outline only. Colour cocoa or icing-700; gold only on cocoa. Icon wells: cream-200 or icing-100 rounded squares (14–16px radius).',
  core: [['cake', 'Cakes'], ['cake-slice', 'Slices'], ['croissant', 'Pastries'], ['sandwich', 'Small chops'], ['cup-soda', 'Yogurt & fura'], ['milk', 'Milk'], ['gift', 'Gifts'], ['party-popper', 'Celebration'], ['shopping-bag', 'Order bag'], ['truck', 'Delivery'], ['store', 'Pickup'], ['message-circle', 'WhatsApp'], ['phone', 'Phone'], ['clock', 'Lead time'], ['package', 'Package'], ['info', 'Info'], ['map-pin', 'Location'], ['heart', 'Heart']] as [string, string][],
  notUsed: ['Emoji as icons', 'Chef hats', 'Cupcake clip-art', 'Sprinkles', 'Mixed icon sets'],
  ornament: 'Unicode ♥︎ appears only as the ribbon-rule ornament (from the logo).',
  roles: 'Photography = sells the product; icons = navigation and information; motifs = brand framing; badges = status/promo. Illustration is not part of the system.',
};

export const IMAGERY = {
  vibe: 'Warm white balance, soft window light, lifted shadows, true pinks, real texture; cream/wood/linen surfaces.',
  avoid: 'Heavy filters and stock props.',
  direction: 'Real product is the hero — soft window light, warm white balance, honest texture.',
  moodboard: 'Cocoa & gold warmth, pink celebration spark, honest close-up food. Images are conceptual (cropped from supplied flyer).',
  conceptual: 'All imagery is conceptual (cropped from the supplied flyer; may not be genuine Treats by MMA products). Real photo or “Conceptual image” label.',
};

export const MOTION = {
  rule: 'Gentle and short. 120–360ms, cubic-bezier(.2,.7,.2,1); fades + small lifts; drawers slide. No bounces/confetti.',
  states: [
    { name: 'Hover', body: 'One step darker (pink 600→700, cocoa 800→900) or cream-200 wash for ghost/outline.' },
    { name: 'Press', body: 'Darker again + scale .97.' },
    { name: 'Focus', body: '2px cream gap + 2px pink ring.' },
    { name: 'Disabled', body: 'Cream-200 fill, cocoa-500 text.' },
  ],
  transparency: 'Only cocoa scrims on photos and the drawer overlay (40%). No glassmorphism.',
};

export const CATEGORIES: { id: 'cakes' | 'bakes' | 'chops' | 'yogurt' | 'celebration'; family: string; accent: string; icon: string }[] = [
  { id: 'cakes', family: 'Cakes (celebration, custom, slices)', accent: 'Icing pink', icon: 'cake' },
  { id: 'bakes', family: 'Pastries & Banana Bread', accent: 'Gold', icon: 'croissant' },
  { id: 'chops', family: 'Small Chops & Snacks', accent: 'Leaf', icon: 'sandwich' },
  { id: 'yogurt', family: 'Yogurt & Fura', accent: 'Milk blue', icon: 'cup-soda' },
  { id: 'celebration', family: 'Celebration Boxes (assorted, gifts)', accent: 'Cocoa', icon: 'gift' },
];
export const CATEGORY_RULE = 'Accent appears as a dot, label colour, placeholder tint or ring — never as a different logo, font or full background (except one-off category stickers).';

export const PACKAGING = {
  tiers: [
    { name: 'Everyday', body: 'Kraft/white stock + 1-colour cocoa stamp, stickers, sleeves.' },
    { name: 'Celebration', body: 'Cream box, cocoa lid band, pink drip edge, gold ribbon, monogram seal.' },
  ],
  rules: [
    'Logo or monogram on top/front.',
    'Product name in Caprasimo is the largest label element.',
    'Required info (ingredients, allergens, weight, dates, storage, contact) in a separate plain zone, Figtree ≥7pt, no decoration behind it.',
    'No regulatory marks unless officially granted.',
  ],
  items: [
    ['Pastry box & banana bread band', 'Window pastry box + loaf sleeve using the cake-layer band motif'],
    ['Cake boxes', 'Everyday kraft + 1-colour stamp vs. celebration cream box with gold ribbon & seal'],
    ['Small chops packaging', 'Foil tray / takeaway lid label + party platter sticker — leaf category cue'],
    ['Product label hierarchy', 'Brand zone vs. required-information zone — never mix decoration into required info'],
    ['Stickers, seals & tags', 'Low-cost brand carriers — turn any plain box or bag into Treats by MMA'],
    ['Yogurt & fura containers', 'Cup lid + wrap label, bottle label, fura tub — milk category cue'],
    ['Stationery & carry bag', 'Business card, thank-you card, order insert, carry bag'],
  ] as [string, string][],
};

export const SOCIAL = {
  formats: 'Formats 4:5 feed (1080×1350), 1:1, 9:16 stories.',
  rules: ['6% margins.', 'Monogram or handle ≥4% width, bottom or top corner.', 'Max 2 type sizes + 1 label.', 'Reviews only from genuine customers.'],
  families: [
    { name: 'Product', rule: 'Photo ≥70%', detail: 'Photo is the hero (≥70% of frame) · 4:5 feed · monogram bottom-left', tpl: 'portrait:product' },
    { name: 'Promo', rule: 'Cocoa/gold, offer largest', detail: 'Cocoa ground + gold type · offer is the largest element · icing drip top-trim', tpl: 'portrait:promo' },
    { name: 'Info', rule: 'Cream, lists, carousel', detail: 'Cream ground · numbered/listed content · no photo needed · carousel-ready', tpl: 'portrait:educational' },
    { name: 'Celebration', rule: 'Arch + gold ring + ribbon rule', detail: 'Gold ring arch frame · ribbon rule · 9:16 stories for behind-the-scenes', tpl: 'portrait:celebration' },
  ],
};

export const CHECKLIST = [
  'Logo unaltered and on cream (or cream tile)',
  '≤ one pink headline word',
  'Gold never on cream for text',
  'One category accent',
  '≤2 motifs',
  'Real photo or “Conceptual image” label',
  'Prices/details as placeholders until confirmed',
  'AA contrast',
  '≥44px touch targets',
];

export const STATUS = {
  final: 'Cocoa, gold, icing pink, cream; logo usage rules.',
  provisional: ['Fonts (Google substitutes)', 'Milk/leaf accents', 'Tagline', 'Monogram crop', 'Category names', 'All copy samples', 'Packaging concepts'],
  imagery: 'All imagery is conceptual (cropped from the supplied flyer; may not be genuine Treats by MMA products).',
};

export const LOGO_RULES = {
  official: 'Supplied raster mark — preserved as-is; do not redraw or recolour.',
  clearspace: 'Clear space = X (heart-crown height) on all sides.',
  backgrounds: 'The mark carries its own cream ground — place on cream, or in a cream tile on dark/photo.',
  misuse: 'Never alter the supplied mark.',
  minimum: 'Glossy 3D bevels and fine detail break down below ~120px and in 1-colour print.',
};
