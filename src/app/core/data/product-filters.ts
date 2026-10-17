import { PRODUCTS, PriceType, Product, categoryNameOf, priceSortValue } from './products';

export type SortKey = 'newest' | 'name' | 'price-asc' | 'price-desc';

export interface FilterState {
  types: string[];
  materials: string[];
  finishes: string[];
  prices: PriceType[];
}

export const EMPTY_FILTERS: FilterState = { types: [], materials: [], finishes: [], prices: [] };

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'Name A to Z' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

export const PRICE_LABEL: Record<PriceType, string> = { fixed: 'Fixed price', from: 'Starting at', quote: 'Request a Quote' };

export function hasFilters(f: FilterState): boolean {
  return !!(f.types.length || f.materials.length || f.finishes.length || f.prices.length);
}

export function searchText(p: Product): string {
  return `${p.name} ${p.desc} ${p.type} ${p.material} ${p.code} ${categoryNameOf(p)}`.toLowerCase();
}

export function applyFilters(pool: Product[], f: FilterState, query: string, sort: SortKey): Product[] {
  const q = query.trim().toLowerCase();
  const out = pool.filter(
    (p) =>
      (!q || searchText(p).includes(q)) &&
      (!f.types.length || f.types.includes(p.type)) &&
      (!f.materials.length || f.materials.includes(p.material)) &&
      (!f.finishes.length || p.finishes.some((x) => f.finishes.includes(x))) &&
      (!f.prices.length || f.prices.includes(p.priceType)),
  );
  switch (sort) {
    case 'name': return out.sort((a, b) => a.name.localeCompare(b.name));
    case 'price-asc': return out.sort((a, b) => priceSortValue(a, 1) - priceSortValue(b, 1) || a.order - b.order);
    case 'price-desc': return out.sort((a, b) => priceSortValue(b, -1) - priceSortValue(a, -1) || a.order - b.order);
    default: return out.sort((a, b) => a.order - b.order);
  }
}

export function toggleIn<T>(list: T[], v: T): T[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

export const ALL_MATERIALS = ['Natural cane', 'Cane and wood', 'Cane and rope'] as const;
export const ALL_FINISHES = ['Natural', 'Honey', 'Dark walnut'] as const;
export const ALL_PRICES: PriceType[] = ['fixed', 'from', 'quote'];

export const poolFor = (categorySlug?: string) => (categorySlug ? PRODUCTS.filter((p) => p.category === categorySlug) : PRODUCTS);
