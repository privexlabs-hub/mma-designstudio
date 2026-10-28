/* Brand constants for the studio renderer (from studio-lib.js). Values match tokens/colors.css. */

export const C = {
  cocoa: '#3D1D10', cocoa9: '#2B140A', cocoa7: '#5A2F1C', cocoa6: '#7A4A33', cocoa3: '#C9A893', cocoa1: '#EEDFD3',
  gold: '#E8B323', gold4: '#F2C94C', gold3: '#F7DC85', gold7: '#8F6410', gold1: '#FCF1CC',
  pink: '#E8358F', pink6: '#C81F75', pink7: '#AD1660', pink3: '#F59AC6', pink1: '#FDE3F0',
  cream: '#FFF4DC', cream0: '#FFFDF6', cream50: '#FFF9EA', cream2: '#F8E8C4', cream3: '#EED7A8',
  milk: '#4A8FD0', milk1: '#E1EEFA', leaf: '#2E9A4E', leaf1: '#DDF3E2', white: '#FFFFFF',
} as const;

export const SWATCHES: string[] = [C.cocoa, C.cocoa9, C.cocoa7, C.gold, C.gold4, C.gold3, C.gold1, C.pink, C.pink6, C.pink7, C.pink3, C.pink1, C.cream, C.cream0, C.milk, C.leaf, C.white];

/** CSS font stacks used inside artboards. The families are self-hosted by next/font (see app/fonts.ts). */
export const FONTS = {
  display: "'Caprasimo', 'Cooper Black', Georgia, serif",
  body: "'Figtree', 'Segoe UI', system-ui, sans-serif",
} as const;

const P = '/assets/photos/concept-';
export const PH = {
  cake: P + 'cake.png', bread: P + 'banana-bread.png', donut: P + 'doughnuts.png',
  pastry: P + 'pastries.png', chops: P + 'small-chops.png', fura: P + 'yogurt-fura.png',
} as const;
export const LOGO = '/assets/logo/treats-by-mma-logo.png';
export const MARK = '/assets/logo/proposed-cake-monogram.png';
export const PHOTOS: [string, string][] = [
  ['Celebration cake', PH.cake], ['Banana bread', PH.bread], ['Doughnuts', PH.donut],
  ['Pastries', PH.pastry], ['Small chops', PH.chops], ['Yogurt fura', PH.fura],
];
export const HANDLE = '@treats_by_mma';
export const WA = 'WhatsApp 0813 107 7321';
