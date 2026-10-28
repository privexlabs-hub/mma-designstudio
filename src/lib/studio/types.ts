/* Treats by MMA Studio — document model. Mirrors the JSON shape persisted by the
   prototype (localStorage `tbm-studio:v1` and project files), so old files still open. */

export type ElType = 'text' | 'image' | 'shape' | 'logo' | 'ribbon' | 'table' | 'toc' | 'chart' | 'pageno';
export type FontRole = 'display' | 'body';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type VAlign = 'top' | 'center' | 'bottom';
export type Frame = 'none' | 'round' | 'arch' | 'circle';
export type Fit = 'cover' | 'contain';
export type LogoVariant = 'full' | 'mark';

/** One element on a page. Fields beyond the shared box apply per `type` (see factories in engine.ts). */
export interface El {
  id: string;
  key: string;
  type: ElType;
  x: number; y: number; w: number; h: number;
  opacity: number;
  /** Added by the user (kept across relayout). */
  user?: boolean;
  // text / pageno / table / toc / chart
  text?: string;
  font?: FontRole;
  size?: number;
  weight?: number;
  color?: string;
  align?: TextAlign;
  lh?: number;
  ls?: number;
  upper?: boolean;
  italic?: boolean;
  bg?: string;
  radius?: number;
  pad?: number;
  valign?: VAlign;
  // image
  src?: string;
  fit?: Fit;
  frame?: Frame;
  ring?: string;
  scrim?: boolean;
  // shape
  fill?: string;
  stroke?: string;
  strokeW?: number;
  // logo
  variant?: LogoVariant;
  tile?: string;
  // table / chart
  head?: string;
  line?: string;
  bar?: string;
  track?: string;
}

/** Numeric / string fields the inspector edits generically. */
export type ElPatch = Partial<Omit<El, 'id' | 'type'>>;

export interface Page {
  id: string;
  name: string;
  bg: string;
  elements: El[];
  numbered?: boolean;
  toc?: boolean;
  /** Document page kind id (DOCS[docType].kinds). */
  kind?: string;
  /** Graphic variant key (V) or an inline variant (carousels / web). */
  spec?: string | Variant;
}

export interface Doc {
  tpl: string;
  name: string;
  cat: CatId;
  mode: 'graphic' | 'doc';
  formatId: string;
  w: number;
  h: number;
  pages: Page[];
  pageNumbers: { show: boolean; start: number };
  docType?: DocTypeId;
  edition?: Edition;
}

export type CatId = 'social' | 'platform' | 'banners' | 'avatars' | 'ads' | 'email' | 'web' | 'editorial' | 'documents';
export type Edition = 'cream' | 'cocoa';
export type DocTypeId = 'ebook' | 'report' | 'whitepaper' | 'proposal' | 'casestudy' | 'presentation' | 'article' | 'newsletter' | 'resume';

export interface Format { label: string; w: number; h: number; group: string; ex?: number }
export interface PageSize { label: string; w: number; h: number }

export interface Template {
  id: string;
  name: string;
  cat: CatId;
  sub: string;
  formatId?: string;
  sizes: string[];
  multi?: number;
  docType?: DocTypeId;
  edition?: Edition;
}

/* ---------- layout-engine inputs ---------- */
export type Card = [string, string, string?];
export type Block = [string, string];
export interface ItemOpt {
  flex?: number; frame?: Frame; ring?: string; w?: number; key?: string; cols?: number; stat?: number;
}
export type ItemKind =
  | 'logo' | 'label' | 'meta' | 'handle' | 'author' | 'sub' | 'body' | 'list' | 'heading' | 'h3' | 'cta' | 'ribbon'
  | 'quotemark' | 'option' | 'title' | 'quote' | 'stat' | 'bodyfill' | 'img' | 'table' | 'chart' | 'toc' | 'cols'
  | 'cards' | 'blocks' | 'gallery' | 'box';
export type ItemArg = string | string[] | Card[] | Block[] | ItemOpt | null | undefined;
export type Item = [ItemKind, ...ItemArg[]];

export type ThemeId = 'cream' | 'white' | 'cocoa' | 'photo';
export interface Theme {
  bg: string; title: string; fg: string; muted: string; label: string; ctaBg: string; ctaFg: string;
  card: string; cardFg: string; stat: string; rib: string; tile: string; line: string;
}

export interface Variant {
  name?: string;
  theme?: ThemeId;
  media?: 'none' | 'full' | 'arch' | 'side';
  ring?: number;
  photo?: string;
  align?: 'left' | 'center';
  items: Item[];
}

export interface AvatarSpec {
  name: string; bg: string; kind: LogoVariant | 'initials'; tile?: string; pad?: number; circle?: number; ring?: string;
}

export type LayoutId =
  | 'cover' | 'titlepage' | 'copyright' | 'dedication' | 'epigraph' | 'toc' | 'opener' | 'text' | 'sections' | 'quote'
  | 'callout' | 'figure' | 'table' | 'chart' | 'stats' | 'team' | 'cards' | 'list' | 'twocol' | 'gallery' | 'hero'
  | 'nlheader' | 'nlfooter' | 'resumehead' | 'closing' | 'back';

export interface KindContent {
  label?: string; title?: string; sub?: string; meta?: string; body?: string; quote?: string; author?: string;
  heading?: string; toc?: string; blocks?: Block[]; boxh?: string; box?: string; img?: string; caption?: string;
  table?: string; list?: string; cols?: [string, string]; cards?: Card[]; chart?: string; gallery?: string[];
  cta?: string; handle?: string;
}
export interface PageKind { label: string; layout: LayoutId; c: KindContent; numbered?: boolean; toc?: number; dark?: number }
export interface DocType {
  label: string; size: string; justify?: boolean; slides?: boolean; seq: string[]; kinds: Record<string, PageKind>;
}

export interface Rect { x: number; y: number; w: number; h: number }
export interface Composed { bg: string; elements: El[] }
