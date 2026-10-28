/** Top-level areas of the site (header nav, menu drawer, home hub). */
export const SECTIONS = [
  { href: '/studio', label: 'Studio', sub: 'Templates, editor & exports', icon: 'pen-line' },
  { href: '/design-system', label: 'Design System', sub: '12 sections · tokens & components', icon: 'swatch-book' },
  { href: '/playbook', label: 'Brand Playbook', sub: 'Positioning, rules & checklist', icon: 'book-open' },
  { href: '/voice', label: 'Voice & Knowledge', sub: 'How we write · brand facts', icon: 'message-square-quote' },
  { href: '/assets', label: 'Asset Library', sub: 'Logo, photos & token files', icon: 'images' },
] as const;
