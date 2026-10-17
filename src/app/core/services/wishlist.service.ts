import { Injectable, computed, signal } from '@angular/core';
import { PRODUCTS, Product } from '../data/products';
import { readJson, writeJson } from './storage';

const KEY = 'cane-atelier:wishlist';
const RECENT_KEY = 'cane-atelier:recent';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly slugs = signal<string[]>(readJson<string[]>(KEY, []));
  private readonly recentSlugs = signal<string[]>(readJson<string[]>(RECENT_KEY, []));

  readonly count = computed(() => this.slugs().length);
  readonly items = computed<Product[]>(() =>
    this.slugs().map((s) => PRODUCTS.find((p) => p.slug === s)).filter((p): p is Product => !!p),
  );
  readonly recent = computed<Product[]>(() =>
    this.recentSlugs().map((s) => PRODUCTS.find((p) => p.slug === s)).filter((p): p is Product => !!p),
  );

  has(slug: string): boolean {
    return this.slugs().includes(slug);
  }

  toggle(slug: string): void {
    this.slugs.update((list) => (list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]));
    writeJson(KEY, this.slugs());
  }

  clear(): void {
    this.slugs.set([]);
    writeJson(KEY, []);
  }

  markViewed(slug: string): void {
    this.recentSlugs.update((list) => [slug, ...list.filter((s) => s !== slug)].slice(0, 8));
    writeJson(RECENT_KEY, this.recentSlugs());
  }
}
