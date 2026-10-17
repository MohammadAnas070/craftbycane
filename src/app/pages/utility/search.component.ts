import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { CATEGORIES } from '../../core/data/categories';
import { ARTICLES } from '../../core/data/content';
import { PRODUCTS } from '../../core/data/products';
import { searchText } from '../../core/data/product-filters';
import { ArtComponent } from '../../shared/components/art.component';
import { IconComponent } from '../../shared/components/icon.component';
import { ProductCardComponent } from '../../shared/components/product-card.component';
import { BreadcrumbComponent, EmptyStateComponent } from '../../shared/components/small.components';

type Tab = 'products' | 'categories' | 'journal';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterLink, ArtComponent, IconComponent, ProductCardComponent, BreadcrumbComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="head">
      <div class="container">
        <app-breadcrumb [items]="[{ label: 'Home', link: '/' }, { label: 'Search' }]" />
        <h1>Results for “{{ term() }}”</h1>
        <form class="sf" (submit)="go($event)" role="search">
          <app-icon name="search" [s]="18" />
          <input type="search" [value]="term()" (input)="draft.set($any($event.target).value)" placeholder="Search pieces, categories, journal..." aria-label="Search" />
          <button type="submit" class="btn btn--sm">Search</button>
        </form>
        <div class="tabs" role="tablist">
          <button type="button" role="tab" [attr.aria-selected]="tab() === 'products'" (click)="tab.set('products')">Products <em>{{ products().length }}</em></button>
          <button type="button" role="tab" [attr.aria-selected]="tab() === 'categories'" (click)="tab.set('categories')">Categories <em>{{ cats().length }}</em></button>
          <button type="button" role="tab" [attr.aria-selected]="tab() === 'journal'" (click)="tab.set('journal')">Journal <em>{{ posts().length }}</em></button>
        </div>
      </div>
    </section>

    <section class="section--tight res">
      <div class="container">
        @if (!total()) {
          <app-empty-state heading="Nothing found for “{{ term() }}”" text="Check the spelling, try a broader word, or tell us what you need.">
            <a routerLink="/custom-orders" class="btn">Request a custom piece</a>
          </app-empty-state>
        } @else {
          @switch (tab()) {
            @case ('products') {
              <div class="pgrid">@for (p of products(); track p.slug; let i = $index) { <app-product-card [product]="p" [index]="i" /> } @empty { <p class="muted">No products match.</p> }</div>
            }
            @case ('categories') {
              <div class="cgrid">
                @for (c of cats(); track c.slug) {
                  <a [routerLink]="['/categories', c.slug]" class="row"><app-art [art]="c.art" alt="" aspect="4 / 3" /><div><h3>{{ c.name }}</h3><p class="muted">{{ c.blurb }}</p></div></a>
                } @empty { <p class="muted">No categories match.</p> }
              </div>
            }
            @case ('journal') {
              <div class="cgrid">
                @for (a of posts(); track a.slug) {
                  <a [routerLink]="['/journal', a.slug]" class="row"><app-art [art]="a.art" alt="" aspect="4 / 3" /><div><p class="eyebrow">{{ a.topic }}</p><h3>{{ a.title }}</h3><p class="muted">{{ a.excerpt }}</p></div></a>
                } @empty { <p class="muted">No articles match.</p> }
              </div>
            }
          }
        }
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .head { background: var(--ivory-2); padding-block: 36px 0; }
    .head h1 { margin-top: 28px; font-size: clamp(38px, 5vw, 64px); }
    .sf { display: flex; align-items: center; gap: 12px; max-width: 620px; margin-top: 26px; padding: 6px 6px 6px 18px; background: var(--white); border: 1px solid var(--line); border-radius: var(--radius); color: var(--ink-muted); }
    .sf:focus-within { border-color: var(--forest); box-shadow: 0 0 0 1px var(--forest); }
    .sf input { flex: 1; min-width: 0; border: 0; outline: none; background: transparent; font: inherit; font-size: 15px; color: var(--charcoal); }
    .tabs { display: flex; gap: 28px; margin-top: 36px; overflow-x: auto; }
    .tabs button { padding: 14px 2px; font-size: 14px; font-weight: 500; color: var(--ink-muted); border-bottom: 2px solid transparent; white-space: nowrap; transition: color 0.2s, border-color 0.25s; }
    .tabs button:hover { color: var(--forest); }
    .tabs button[aria-selected='true'] { color: var(--forest); border-color: var(--terracotta); }
    .tabs em { font-style: normal; margin-left: 6px; padding: 2px 8px; background: var(--sand); border-radius: 999px; font-size: 11px; }
    .res { padding-block: 40px clamp(64px, 8vw, 100px); min-height: 40vh; }
    .pgrid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px 14px; }
    @media (min-width: 900px) { .pgrid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 40px 22px; } }
    .cgrid { display: grid; gap: 22px; }
    @media (min-width: 800px) { .cgrid { grid-template-columns: 1fr 1fr; } }
    .row { display: grid; grid-template-columns: 150px 1fr; gap: 22px; align-items: center; padding: 14px; background: var(--white); border: 1px solid var(--line); border-radius: var(--radius); transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease); }
    .row:hover { transform: translateY(-3px); box-shadow: var(--shadow-sm); }
    .row app-art { border-radius: var(--radius); }
    .row h3 { font-size: 26px; line-height: 1.1; }
    .row p.muted { margin-top: 6px; font-size: 13.5px; }
    .row .eyebrow { font-size: 10px; margin-bottom: 8px; }
  `],
})
export class SearchComponent {
  private readonly router = inject(Router);
  readonly q = input<string>('');
  protected readonly draft = signal<string | null>(null);
  protected readonly tab = signal<Tab>('products');
  protected readonly term = computed(() => (this.q() ?? '').trim());

  protected readonly products = computed(() => {
    const t = this.term().toLowerCase();
    return t ? PRODUCTS.filter((p) => searchText(p).includes(t)) : [];
  });
  protected readonly cats = computed(() => {
    const t = this.term().toLowerCase();
    return t ? CATEGORIES.filter((c) => (c.name + ' ' + c.blurb + ' ' + c.heroCopy).toLowerCase().includes(t)) : [];
  });
  protected readonly posts = computed(() => {
    const t = this.term().toLowerCase();
    return t ? ARTICLES.filter((a) => (a.title + ' ' + a.excerpt + ' ' + a.topic).toLowerCase().includes(t)) : [];
  });
  protected readonly total = computed(() => this.products().length + this.cats().length + this.posts().length);

  constructor() {
    inject(Title).setTitle('Search | Crafted By Cane');
    inject(Meta).updateTag({ name: 'robots', content: 'noindex' });
  }

  protected go(e: Event): void {
    e.preventDefault();
    const q = (this.draft() ?? this.term()).trim();
    if (q) this.router.navigate(['/search'], { queryParams: { q } });
  }
}
