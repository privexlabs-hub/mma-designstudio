/** Product category architecture — accent appears as dot, label colour, tint or ring only. */
export const CAT = {
  cakes: { label: 'Cakes', c: 'var(--cat-cakes)', bg: 'var(--cat-cakes-bg)', fg: 'var(--cat-cakes-fg)', icon: 'cake' },
  bakes: { label: 'Pastries & Banana Bread', c: 'var(--cat-bakes)', bg: 'var(--cat-bakes-bg)', fg: 'var(--cat-bakes-fg)', icon: 'croissant' },
  chops: { label: 'Small Chops & Snacks', c: 'var(--cat-chops)', bg: 'var(--cat-chops-bg)', fg: 'var(--cat-chops-fg)', icon: 'sandwich' },
  yogurt: { label: 'Yogurt & Fura', c: 'var(--cat-yogurt)', bg: 'var(--cat-yogurt-bg)', fg: 'var(--cat-yogurt-fg)', icon: 'cup-soda' },
  celebration: { label: 'Celebration Boxes', c: 'var(--cat-celebration)', bg: 'var(--cat-celebration-bg)', fg: 'var(--cat-celebration-fg)', icon: 'gift' },
} as const;
export type CategoryId = keyof typeof CAT;
