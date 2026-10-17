import { cut } from './images';

export type Tone = 'sand' | 'ivory' | 'sage' | 'peach' | 'charcoal' | 'green';

/** Background colour baked into each illustration tile (used as placeholder while it loads). */
export const TONE_COLOR: Record<Tone, string> = {
  sand: '#e7dbcb',
  ivory: '#f1e8db',
  sage: '#cbd3c2',
  peach: '#ddb9a0',
  charcoal: '#33322d',
  green: '#345b49',
};

export interface ArtDef { src: string; tone: Tone; w: number; h: number; mode?: 'photo' | 'cutout' }

const a = (name: string, tone: Tone, w = 914, h = 1143): ArtDef => ({ src: `assets/images/${name}.webp`, tone, w, h });

export const ART = {
  chair: a('chair', 'peach'),
  chairTerra: a('chair-terra', 'peach', 1080, 977),
  lamp: a('lamp', 'charcoal', 909),
  cluster: a('cluster', 'charcoal', 914, 1144),
  pendants: a('pendants', 'charcoal', 1081, 977),
  swing: a('swing', 'green'),
  swingLarge: a('swing-large', 'green', 1621, 2026),
  jhula: a('jhula', 'sage', 914, 1144),
  stepler: a('stepler', 'ivory'),
  stick: a('stick', 'sage', 914, 1139),
  rope: a('rope', 'sand', 909, 1139),
  basket: a('basket', 'ivory', 914, 1139),
  tray: a('tray', 'sand', 914, 1139),
  sidetable: a('sidetable', 'peach', 909, 1144),
  sidetableWide: a('sidetable-wide', 'sage', 1080, 982),
  mirror: a('mirror', 'ivory', 914, 1144),
  mirrorWide: a('mirror-wide', 'ivory', 1081, 982),
  weave: a('weave', 'sand', 1038, 1056),
} satisfies Record<string, ArtDef>;
export type ArtKey = keyof typeof ART;
export type ArtRef = ArtKey | ArtDef;

export interface Category {
  slug: string;
  id: string;
  name: string;
  short: string;
  blurb: string;
  heroTitle: string;
  heroCopy: string;
  tone: Tone;
  /** representative product shot (background-free) used on category cards and heroes */
  art: ArtDef;
  types: string[];
  about: { kicker: string; title: string; p1: string; p2: string; points: { icon: string; title: string; text: string }[] };
}

const pts = (t1: string, d1: string, t2: string, d2: string, t3: string, d3: string) => [
  { icon: 'leaf', title: t1, text: d1 },
  { icon: 'hand', title: t2, text: d2 },
  { icon: 'ruler', title: t3, text: d3 },
];

export const CATEGORIES: Category[] = [
  {
    slug: 'cane-handmade', id: 'CANE_HANDMADE', name: 'Handmade Cane Products', short: 'Handmade',
    blurb: 'Armchairs, benches and stools, woven by hand', heroTitle: 'Seats woven with character',
    heroCopy: 'Armchairs, benches and stools woven and framed entirely by hand.', tone: 'sand', art: cut('cane-handmade', 1),
    types: ['Armchairs', 'Benches', 'Stools', 'Sets'],
    about: { kicker: 'About handmade', title: 'Every weave made by one pair of hands', p1: 'Handmade pieces are where the weave is easiest to see up close: a chair back, a bench top, a stool. Each one is made start to finish by a single pair of hands.', p2: 'We keep shapes simple so the weave leads. Sizes and finishes can be adapted for homes, hospitality or a particular corner.', points: pts('Natural cane', 'Sustainable, renewable fibre.', 'Hand-woven', 'Open weave, tight edges.', 'Made to fit', 'Size and finish options.') },
  },
  {
    slug: 'cane-stepler', id: 'CANE_STEPLER', name: 'Cane Stepler Products', short: 'Stepler',
    blurb: 'Cane-panelled benches, sofas and doors', heroTitle: 'Cane panels, framed to last',
    heroCopy: 'Benches, sofas and doors with cane panels set into solid frames.', tone: 'ivory', art: cut('cane-stepler', 7),
    types: ['Chairs', 'Benches', 'Sofas', 'Panels'],
    about: { kicker: 'About stepler', title: 'Solid frames, woven panels', p1: 'Stepler pieces pair a strong wooden frame with panels of fine cane webbing, fitted tight so they stay flat for years.', p2: 'Frame wood, panel size and cushion fabric can all be changed to suit a living room, a cafe or a hallway.', points: pts('Solid frames', 'Seasoned wood under woven panels.', 'Cane-panelled', 'Webbing fitted by hand.', 'Made to fit', 'Size and fabric on request.') },
  },
  {
    slug: 'cane-stick', id: 'CANE_STICK', name: 'Cane Stick Products', short: 'Stick',
    blurb: 'Cane-webbing cabinets, screens and panels', heroTitle: 'Cane webbing, fitted anywhere',
    heroCopy: 'Cabinets, screens and panels faced with fine cane webbing.', tone: 'sage', art: cut('cane-stick', 7),
    types: ['Cabinets', 'Storage', 'Screens', 'Panels', 'Mats'],
    about: { kicker: 'About stick', title: 'Texture for doors, screens and cabinets', p1: 'Fine cane webbing softens plain joinery. We face cabinet doors, drawers, screens and wall panels, and we weave loose sheets for your own carpenter to fit.', p2: 'Panel sizes, frame colours and webbing patterns can be matched to your space.', points: pts('Graded cane', 'Chosen by thickness and colour.', 'Hand-fitted', 'Panels cut and framed by hand.', 'Made to fit', 'Any size, any frame.') },
  },
  {
    slug: 'cane-wicker', id: 'CANE_WICKER', name: 'Cane Wicker Products', short: 'Wicker',
    blurb: 'Cane-webbing tables, benches and cabinets', heroTitle: 'Classic wicker, made to be lived in',
    heroCopy: 'Chairs, tables, benches and cabinets with a soft, open weave.', tone: 'peach', art: cut('cane-wicker', 1),
    types: ['Chairs', 'Benches', 'Tables', 'Storage', 'Screens', 'Panels', 'Sofas', 'Daybeds'],
    about: { kicker: 'About wicker', title: 'Soft weave, strong frame', p1: 'Wicker is woven from flexible cane around a sturdy frame. It stays light, breathes in warm weather and ages with a lovely patina.', p2: 'Our artisans choose the cane, weave the pattern by hand and finish each piece with a protective coat. Sizes and finishes can be adapted on request.', points: pts('Natural cane', 'Sustainable, renewable fibre.', 'Hand-woven', 'Open weave, tight edges.', 'Made to fit', 'Size and finish options.') },
  },
  {
    slug: 'rope-work', id: 'ROPE_WORK', name: 'Rope Work and Woven Products', short: 'Rope work',
    blurb: 'Rope-woven chairs, benches and swings', heroTitle: 'Twisted, knotted and woven rope',
    heroCopy: 'Chairs, benches and swings wrapped and woven in natural cord.', tone: 'sand', art: cut('rope-work', 4),
    types: ['Chairs', 'Benches', 'Sofas', 'Swings'],
    about: { kicker: 'About rope work', title: 'Cord, woven strand by strand', p1: 'Rope and paper cord are wrapped and woven over teak and steel frames, giving seats a soft, tactile surface that holds its shape.', p2: 'Cord colours, frame woods and cushion fabrics can be adapted for a veranda, a cafe or a living room.', points: pts('Natural fibre', 'Tonal, durable cord.', 'Hand-woven', 'Wrapped and tied by hand.', 'Made to fit', 'Colours and sizes on request.') },
  },
  {
    slug: 'lamp', id: 'LAMP', name: 'Cane Lamps and Lighting', short: 'Lamps',
    blurb: 'Pendants and table lamps that glow through the weave', heroTitle: 'Light that glows through the weave',
    heroCopy: 'Pendants and table lamps that throw a warm, patterned light.', tone: 'charcoal', art: cut('lamp', 9),
    types: ['Pendants', 'Table lamps'],
    about: { kicker: 'About lamps', title: 'Warm light, patterned by hand', p1: 'A woven shade turns a plain bulb into a soft, patterned glow. Each shade is shaped over a form and woven strand by strand.', p2: 'Shade size, drop length and fittings can be adapted for stairwells, cafes and dining tables.', points: pts('Natural cane', 'Shades woven from cane.', 'Hand-woven', 'Shaped over forms.', 'Made to fit', 'Size and drop on request.') },
  },
  {
    slug: 'zula-furniture', id: 'ZULA_FURNITURE', name: 'Zula, Jhula and Swing Furniture', short: 'Swings',
    blurb: 'Hanging chairs, jhulas and cane seating', heroTitle: 'Hang a little calm',
    heroCopy: 'Hanging chairs, jhulas and cane armchairs for verandas and living rooms.', tone: 'sage', art: cut('zula-furniture', 1),
    types: ['Egg swings', 'Swings', 'Jhulas', 'Chairs', 'Sets'],
    about: { kicker: 'About swings', title: 'Made to hang, built to hold', p1: 'Hanging seats start with a strong cane frame and a woven shell. Chains, hooks and fixings are chosen for the way you will hang them.', p2: 'We confirm size, load and fixing details with your quotation so the piece hangs safely in your space.', points: pts('Strong frames', 'Seasoned cane and wood.', 'Hand-woven', 'Shell woven strand by strand.', 'Made to fit', 'Size and fixings confirmed.') },
  },
];

export const categoryBySlug = (slug: string | null | undefined) => CATEGORIES.find((c) => c.slug === slug);
