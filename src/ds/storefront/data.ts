/* Storefront UI kit data (from ui_kits/storefront/data.jsx). Prices are unknown, so they stay null. */
import type { BadgeTone, CategoryId } from '@/ds';

const P = '/assets/photos/';
export interface Product { id: string; name: string; category: CategoryId; image: string; desc: string; price: number | null; from?: boolean; badge?: string; badgeTone?: BadgeTone }
export const PRODUCTS: Product[] = [
  { id: 'drip', name: 'Celebration Drip Cake', category: 'cakes', image: P + 'concept-cake.png', desc: 'Layered sponge with a glossy drip finish and topper of your choice. Made to order.', price: null, from: true, badge: 'Made to order' },
  { id: 'banana', name: 'Classic Banana Bread', category: 'bakes', image: P + 'concept-banana-bread.png', desc: 'Soft, moist loaf with a golden crust. [Description to confirm]', price: null, badge: 'Bestseller', badgeTone: 'gold' },
  { id: 'chops', name: 'Small Chops Platter', category: 'chops', image: P + 'concept-small-chops.png', desc: 'Samosa, spring rolls and more, packed party-ready. [Contents to confirm]', price: null, from: true, badge: 'Party size', badgeTone: 'leaf' },
  { id: 'fura', name: 'Yogurt Fura', category: 'yogurt', image: P + 'concept-yogurt-fura.png', desc: 'Creamy yogurt with fura — chilled, fresh and familiar.', price: null, badge: 'Chilled', badgeTone: 'milk' },
  { id: 'mix', name: 'Pastry Assortment', category: 'bakes', image: P + 'concept-pastries.png', desc: 'A mix of cupcakes, doughnuts and buns. [Selection to confirm]', price: null },
  { id: 'box', name: 'Celebration Treat Box', category: 'celebration', image: P + 'concept-doughnuts.png', desc: 'Assorted sweet treats boxed and sealed for gifting.', price: null, from: true, badge: 'Gift ready', badgeTone: 'cocoa' },
];
export const CATS = [{ id: 'all', label: 'All treats' }, { id: 'cakes', label: 'Cakes' }, { id: 'bakes', label: 'Pastries & Banana Bread' }, { id: 'chops', label: 'Small Chops' }, { id: 'yogurt', label: 'Yogurt & Fura' }, { id: 'celebration', label: 'Celebration Boxes' }];
export const CAT_CAPTION: Record<CategoryId, string> = { cakes: 'Birthdays & milestones', bakes: 'Everyday favourites', chops: 'Party-ready platters', yogurt: 'Chilled & fresh', celebration: 'Gifts & bundles' };
export const CAT_IMG: Record<CategoryId, string> = { cakes: P + 'concept-cake.png', bakes: P + 'concept-banana-bread.png', chops: P + 'concept-small-chops.png', yogurt: P + 'concept-yogurt-fura.png', celebration: P + 'concept-doughnuts.png' };

export type Route = 'home' | 'menu' | 'product' | 'celebrations';
export type Go = (route: Route, arg?: string) => void;
export interface CartItem extends Product { qty: number }
