import { ArtDef, CATEGORIES } from './categories';
import { cut, hasCut, photo, photoNumbers } from './images';

export type PriceType = 'fixed' | 'from' | 'quote';
export type Badge = 'BESTSELLER' | 'NEW' | 'MADE TO ORDER' | 'HANDMADE' | 'CUSTOM';
export type HomeTag = 'Furniture' | 'Lighting' | 'Decor' | 'Swings';

export interface Product {
  slug: string;
  code: string;
  name: string;
  category: string;
  desc: string;
  priceType: PriceType;
  price?: number;
  badge?: Badge;
  /** number of the source photo in the category folder */
  photoNo: number;
  type: string;
  material: 'Natural cane' | 'Cane and wood' | 'Cane and rope';
  finishes: string[];
  tag: HomeTag;
  featured?: boolean;
  order: number;
  /** primary image: background-free cut-out when it looks clean, otherwise the photo */
  image: ArtDef;
  /** detail-page gallery: primary, the original photo, then more shots from the same category folder */
  gallery: ArtDef[];
}

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const PREFIX: Record<string, string> = {
  'cane-wicker': 'WK', 'cane-handmade': 'HM', 'cane-stepler': 'ST', 'cane-stick': 'SK',
  'rope-work': 'RP', lamp: 'LP', 'zula-furniture': 'ZL',
};
const FINISH_SETS = [['Natural', 'Honey'], ['Honey', 'Dark walnut'], ['Natural', 'Honey', 'Dark walnut']];

type Row = [
  name: string, category: string, photoNo: number, desc: string, priceType: PriceType, price: number | null,
  type: string, material: Product['material'], tag: HomeTag, badge?: Badge, featured?: boolean,
];

const ROWS: Row[] = [
  // ---- handmade (folder cane_handmade) ----
  ['Woven Barrel Armchair', 'cane-handmade', 1, 'Rounded wicker tub chair with a deep, soft seat cushion.', 'from', 18500, 'Armchairs', 'Natural cane', 'Furniture', 'BESTSELLER', true],
  ['Carved Cane-Back Armchair', 'cane-handmade', 3, 'Turned teak frame with a hand-woven cane back and seat.', 'from', 14200, 'Armchairs', 'Cane and wood', 'Furniture', 'HANDMADE'],
  ['Walnut Cane-Back Armchair', 'cane-handmade', 8, 'Angled walnut frame with an open-weave cane back and seat.', 'from', 13800, 'Armchairs', 'Cane and wood', 'Furniture', 'NEW', true],
  ['Natural Teak Cane-Back Armchair', 'cane-handmade', 9, 'The same slim frame in light teak with a woven cane seat.', 'from', 13800, 'Armchairs', 'Cane and wood', 'Furniture'],
  ['Woven-Top Teak Bench', 'cane-handmade', 7, 'Long teak bench with a hand-woven cane top for hallways and dining.', 'from', 16500, 'Benches', 'Cane and wood', 'Furniture'],
  ['Classic Wicker Armchair', 'cane-handmade', 10, 'Soft-curved wicker armchair with a tight, even weave.', 'fixed', 8600, 'Armchairs', 'Natural cane', 'Furniture'],
  ['Woven Ottoman Stool', 'cane-handmade', 11, 'Low wicker stool on slim metal legs, handy as a footrest.', 'fixed', 4200, 'Stools', 'Cane and wood', 'Furniture', 'HANDMADE'],
  ['Sculpted Wicker Lounge Chair', 'cane-handmade', 13, 'A folded, sculptural lounge chair woven in one flowing form.', 'quote', null, 'Armchairs', 'Natural cane', 'Furniture', 'MADE TO ORDER'],
  ['Round Wicker Lounge Set', 'cane-handmade', 15, 'Two rounded chairs and a matching low table, woven to match.', 'quote', null, 'Sets', 'Natural cane', 'Furniture', 'CUSTOM'],

  // ---- stepler (folder cane_stepler) ----
  ['Cane Barrel Lounge Chair', 'cane-stepler', 7, 'Dark-framed lounge chair with a woven cane back and cushion.', 'from', 21000, 'Chairs', 'Cane and wood', 'Furniture', 'NEW'],
  ['Cane-Back Bench, Green Seat', 'cane-stepler', 5, 'Curved cane-back bench with an upholstered green seat.', 'from', 15500, 'Benches', 'Cane and wood', 'Furniture', undefined, true],
  ['Cane Panel Door Set', 'cane-stepler', 1, 'A pair of cane-panelled doors in a natural teak frame.', 'quote', null, 'Panels', 'Cane and wood', 'Decor', 'CUSTOM'],
  ['Cane-Panel Sofa Frame', 'cane-stepler', 6, 'Teak sofa frame with woven cane side and back panels.', 'quote', null, 'Sofas', 'Cane and wood', 'Furniture', 'MADE TO ORDER'],
  ['Cane Wall Panelling', 'cane-stepler', 10, 'Metal-framed cane panels for walls, partitions and joinery.', 'quote', null, 'Panels', 'Cane and wood', 'Decor'],

  // ---- stick (folder cane_stick) ----
  ['Round Cane Bedside Cabinet', 'cane-stick', 7, 'Drum-shaped bedside cabinet with cane-webbing drawer fronts.', 'from', 12500, 'Cabinets', 'Cane and wood', 'Furniture', 'NEW', true],
  ['Cane-Fronted Drawer Box', 'cane-stick', 6, 'Walnut-stained drawer front with an open cane-webbing panel.', 'fixed', 3800, 'Storage', 'Cane and wood', 'Decor'],
  ['Cane Panel Screen Set', 'cane-stick', 5, 'Rounded cane panels that stand as screens or fold as dividers.', 'quote', null, 'Screens', 'Cane and wood', 'Decor', 'MADE TO ORDER'],
  ['Woven Cane Mat Sheets', 'cane-stick', 3, 'Hand-woven cane sheets for walls, ceilings and furniture fronts.', 'from', 1900, 'Mats', 'Natural cane', 'Decor'],
  ['Cane-Wrapped Column Panel', 'cane-stick', 4, 'A tall panel wrapped in fine cane for corners and columns.', 'quote', null, 'Panels', 'Natural cane', 'Decor'],
  ['Arched Cane Wardrobe Doors', 'cane-stick', 8, 'Three arched cane-inset doors in a warm wooden frame.', 'quote', null, 'Cabinets', 'Cane and wood', 'Furniture', 'CUSTOM'],

  // ---- wicker (folder cane_wicker) ----
  ['Cane Panel Round Coffee Table', 'cane-wicker', 1, 'Round teak table with a segmented cane-webbing top.', 'from', 14500, 'Tables', 'Cane and wood', 'Furniture', 'BESTSELLER', true],
  ['Oval Cane Display Cabinet', 'cane-wicker', 2, 'Tall oval cabinet in black steel with cane-webbing sides.', 'from', 9800, 'Storage', 'Cane and wood', 'Furniture'],
  ['Oval Cane Cabinet, Angled', 'cane-wicker', 3, 'The oval cabinet seen from the side, with a shelf at the base.', 'from', 16500, 'Storage', 'Cane and wood', 'Furniture'],
  ['Open Cane Armchair', 'cane-wicker', 10, 'Teak armchair with a hand-woven cane seat and back.', 'from', 15800, 'Chairs', 'Cane and wood', 'Furniture', 'HANDMADE'],
  ['Cane-Back Bench', 'cane-wicker', 12, 'Two-seater bench with a rounded cane back and walnut seat.', 'from', 12400, 'Benches', 'Cane and wood', 'Furniture'],
  ['Curved Cane Screen', 'cane-wicker', 13, 'A curved cane-webbing screen on a slim wooden frame.', 'from', 11500, 'Screens', 'Cane and wood', 'Decor'],
  ['Cane Panel, Teak Frame', 'cane-wicker', 14, 'Tall cane-webbing panel framed in light teak, made to size.', 'from', 5400, 'Panels', 'Cane and wood', 'Decor'],
  ['Cane Sofa Frame', 'cane-wicker', 19, 'Walnut sofa frame with a cane back panel, ready for cushions.', 'quote', null, 'Sofas', 'Cane and wood', 'Furniture', 'MADE TO ORDER'],
  ['Cane-Sided Daybed', 'cane-wicker', 21, 'Steel-framed daybed with woven cane side panels.', 'quote', null, 'Daybeds', 'Cane and wood', 'Furniture', 'CUSTOM'],

  // ---- rope work (folder rope_work) ----
  ['Teak Rope Swing Daybed', 'rope-work', 1, 'Teak swing daybed hung from heavy rope, with deep cushions.', 'quote', null, 'Swings', 'Cane and rope', 'Swings', 'MADE TO ORDER', true],
  ['Rope Dining Armchair, Sage', 'rope-work', 3, 'Cord-wrapped armchair on a slim steel frame with sage cushions.', 'from', 12800, 'Chairs', 'Cane and rope', 'Furniture'],
  ['Terracotta Rope Lounge Chair', 'rope-work', 4, 'Rope-woven lounge chair with a striped cushion for the veranda.', 'from', 18500, 'Chairs', 'Cane and rope', 'Furniture', 'NEW'],
  ['Navy Cord Teak Chair', 'rope-work', 6, 'Teak chair with a navy paper-cord seat and back.', 'fixed', 14500, 'Chairs', 'Cane and rope', 'Furniture', 'HANDMADE', true],
  ['Rope-Woven Teak Bench', 'rope-work', 9, 'Cord-woven bench seat on a sculpted walnut base.', 'from', 12500, 'Benches', 'Cane and rope', 'Furniture'],
  ['Rope and Teak Sofa', 'rope-work', 13, 'Three-seat sofa with rope-wrapped sides and a teak frame.', 'quote', null, 'Sofas', 'Cane and rope', 'Furniture', 'CUSTOM'],
  ['Hanging Rope Daybed', 'rope-work', 15, 'A suspended daybed on knotted ropes with grey cushions.', 'quote', null, 'Swings', 'Cane and rope', 'Swings', 'MADE TO ORDER'],
  ['Cord-Seat Lounge Chair', 'rope-work', 23, 'Walnut lounge chair with a woven natural-cord seat.', 'from', 21500, 'Chairs', 'Cane and rope', 'Furniture'],
  ['Grey Cord Outdoor Armchair', 'rope-work', 24, 'Outdoor armchair wrapped in pale grey cord over a dark frame.', 'from', 19500, 'Chairs', 'Cane and rope', 'Furniture'],
  ['Cord-Back Teak Armchair', 'rope-work', 7, 'Angled teak armchair with a rope-woven back.', 'from', 15200, 'Chairs', 'Cane and rope', 'Furniture'],

  // ---- lamps (folder lamp) ----
  ['Open Rattan Pendant', 'lamp', 5, 'Wide, open-weave rattan pendant that throws a soft, patterned glow.', 'from', 5200, 'Pendants', 'Natural cane', 'Lighting', 'NEW', true],
  ['Twisted Cane Bottle Pendants', 'lamp', 6, 'A pair of bottle-shaped pendants woven in an open twist.', 'fixed', 6800, 'Pendants', 'Natural cane', 'Lighting'],
  ['Wide Rattan Ceiling Shade', 'lamp', 8, 'A broad, low ceiling shade for dining tables and counters.', 'from', 7400, 'Pendants', 'Natural cane', 'Lighting'],
  ['Woven Dome Pendant, Two-Tone', 'lamp', 9, 'Dome pendant woven in two natural tones.', 'fixed', 4900, 'Pendants', 'Natural cane', 'Lighting', 'BESTSELLER', true],
  ['Flat Disc Pendant', 'lamp', 10, 'Flat woven disc pendants that hang at staggered heights.', 'quote', null, 'Pendants', 'Natural cane', 'Lighting', 'CUSTOM'],
  ['Woven Bamboo Dome Pendant', 'lamp', 11, 'Open-weave dome with a tight, patterned lattice.', 'fixed', 3600, 'Pendants', 'Natural cane', 'Lighting', 'HANDMADE'],
  ['Cane Bell Pendant', 'lamp', 12, 'Tall bell-shaped shade with two woven bands.', 'fixed', 4200, 'Pendants', 'Natural cane', 'Lighting'],
  ['Woven Table Lamp', 'lamp', 13, 'Cross-woven table lamp that glows warm in the evening.', 'fixed', 2400, 'Table lamps', 'Natural cane', 'Lighting'],
  ['Rope-Wrapped Table Lamp', 'lamp', 14, 'Rope-wrapped table lamp on a wooden base.', 'fixed', 2800, 'Table lamps', 'Cane and rope', 'Lighting'],

  // ---- swings and furniture (folder jula_furniture) ----
  ['Hanging Cane Egg Chair', 'zula-furniture', 1, 'Golden cane hanging chair with an open lattice shell.', 'quote', null, 'Egg swings', 'Natural cane', 'Swings', 'MADE TO ORDER', true],
  ['Standing Cane Swing Chair', 'zula-furniture', 5, 'Swing chair on its own cane stand, for rooms with no ceiling hook.', 'quote', null, 'Swings', 'Natural cane', 'Swings'],
  ['Patterned Cane Hanging Chair', 'zula-furniture', 12, 'Hanging chair with a patterned back in two cane tones.', 'quote', null, 'Swings', 'Natural cane', 'Swings', 'CUSTOM'],
  ['Cane Teardrop Hanging Chair', 'zula-furniture', 15, 'A teardrop-shaped hanging chair with an open weave.', 'quote', null, 'Egg swings', 'Natural cane', 'Swings', 'MADE TO ORDER'],
  ['Round-Back Cane Armchair', 'zula-furniture', 2, 'Round-back cane armchair with a maroon seat pad.', 'from', 7200, 'Chairs', 'Natural cane', 'Furniture', 'BESTSELLER'],
  ['High-Back Cane Armchair', 'zula-furniture', 3, 'Tall, slim cane armchair with curved arms.', 'from', 6400, 'Chairs', 'Natural cane', 'Furniture'],
  ['Cane Garden Armchair', 'zula-furniture', 4, 'Sturdy curved-back cane chair for verandas and gardens.', 'from', 5800, 'Chairs', 'Natural cane', 'Furniture'],
  ['Cane Drum Table and Chairs', 'zula-furniture', 6, 'Round cane drum table with two matching bucket chairs.', 'quote', null, 'Sets', 'Natural cane', 'Furniture', 'CUSTOM'],
  ['Hanging Egg Chair, Yellow Cushions', 'zula-furniture', 10, 'Hanging egg chair with a dark frame and bright cushions.', 'quote', null, 'Egg swings', 'Cane and rope', 'Swings'],
  ['Wooden Jhula with Cushions', 'zula-furniture', 14, 'Jhula seat in polished cane and wood with a soft cushion.', 'quote', null, 'Jhulas', 'Cane and wood', 'Swings', 'MADE TO ORDER'],
];

const counters: Record<string, number> = {};

export const PRODUCTS: Product[] = ROWS.map((r, i) => {
  const [name, category, photoNo, desc, priceType, price, type, material, tag, badge, featured] = r;
  const pre = PREFIX[category];
  counters[pre] = (counters[pre] ?? 0) + 1;
  const primary = cut(category, photoNo);
  const others = photoNumbers(category).filter((n) => n !== photoNo);
  const start = others.length ? (i * 3) % others.length : 0;
  const extra = [0, 1, 2].map((k) => others[(start + k) % others.length]).filter((n) => n !== undefined);
  const gallery: ArtDef[] = [primary];
  if (hasCut(category, photoNo)) gallery.push(photo(category, photoNo));
  extra.forEach((n) => gallery.push(photo(category, n)));
  return {
    slug: slugify(name),
    code: `CA-${pre}-${String(counters[pre]).padStart(3, '0')}`,
    name, category, desc, priceType, price: price ?? undefined, badge, photoNo, type, material,
    finishes: FINISH_SETS[i % 3], tag, featured, order: i, image: primary, gallery,
  };
});

export const productBySlug = (slug: string | null | undefined) => PRODUCTS.find((p) => p.slug === slug);
export const categoryNameOf = (p: Product) => CATEGORIES.find((c) => c.slug === p.category)?.name ?? '';

export const formatPrice = (n: number) => '₹ ' + n.toLocaleString('en-IN');

/** Quote-only items always sort to the end when sorting by price. */
export function priceSortValue(p: Product, dir: 1 | -1): number {
  if (p.priceType === 'quote') return dir === 1 ? Number.MAX_SAFE_INTEGER : -1;
  return p.price ?? 0;
}
