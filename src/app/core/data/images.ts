import { ArtDef, Tone } from './categories';
import { PHOTOS } from './photos.generated';

/** Backdrop used behind each category's cut-out products. Chosen to flatter the material. */
export const CATEGORY_TONE: Record<string, Tone> = {
  'cane-handmade': 'sand',
  'cane-stepler': 'ivory',
  'cane-stick': 'sage',
  'cane-wicker': 'peach',
  'rope-work': 'sand',
  lamp: 'charcoal',
  'zula-furniture': 'sage',
};

/** Whole-photo version of an image from a category folder (cover fit). */
export function photo(cat: string, n: number): ArtDef {
  const p = PHOTOS[cat]?.[n];
  if (!p) throw new Error(`Missing photo ${cat}/${n}`);
  return { src: p.photo.src, w: p.photo.w, h: p.photo.h, tone: 'sand', mode: 'photo' };
}

/** Background-removed version (contain fit on a themed backdrop); falls back to the photo. */
export function cut(cat: string, n: number, tone?: Tone): ArtDef {
  const p = PHOTOS[cat]?.[n];
  if (!p) throw new Error(`Missing photo ${cat}/${n}`);
  if (!p.cut) return photo(cat, n);
  return { src: p.cut.src, w: p.cut.w, h: p.cut.h, tone: tone ?? CATEGORY_TONE[cat] ?? 'sand', mode: 'cutout' };
}

export const photoNumbers = (cat: string): number[] => Object.keys(PHOTOS[cat] ?? {}).map(Number);
export const hasCut = (cat: string, n: number): boolean => !!PHOTOS[cat]?.[n]?.cut;
