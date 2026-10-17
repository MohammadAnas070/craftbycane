import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { CATEGORIES, Category, categoryBySlug } from '../../core/data/categories';
import { EMPTY_FILTERS, FilterState, SORT_OPTIONS, SortKey, applyFilters, hasFilters } from '../../core/data/product-filters';
import { PRODUCTS } from '../../core/data/products';
import { whatsappUrl } from '../../core/data/site';
import { ArtComponent } from '../../shared/components/art.component';
import { FilterPanelComponent } from '../../shared/components/filter-panel.component';
import { IconComponent } from '../../shared/components/icon.component';
import { ProductGridComponent } from '../../shared/components/product-grid.component';
import { BreadcrumbComponent, CtaBandComponent } from '../../shared/components/small.components';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [RouterLink, ArtComponent, IconComponent, ProductGridComponent, FilterPanelComponent, CtaBandComponent, BreadcrumbComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  /** route param, bound by withComponentInputBinding */
  readonly slug = input.required<string>();

  protected readonly cat = computed<Category | undefined>(() => categoryBySlug(this.slug()));
  protected readonly dark = computed(() => ['charcoal', 'green'].includes(this.cat()?.tone ?? ''));
  protected readonly pool = computed(() => PRODUCTS.filter((p) => p.category === this.slug()));
  protected readonly related = computed(() => {
    const all = CATEGORIES.filter((c) => c.slug !== this.slug());
    const i = CATEGORIES.findIndex((c) => c.slug === this.slug());
    return [1, 2, 3].map((n) => CATEGORIES[(i + n) % CATEGORIES.length]).filter((c) => all.includes(c));
  });
  protected readonly crumbs = computed(() => [{ label: 'Home', link: '/' }, { label: 'Products', link: '/products' }, { label: this.cat()?.short ?? '' }]);
  protected readonly wa = computed(() => whatsappUrl(`Hello Crafted By Cane, I am interested in ${this.cat()?.name ?? 'your products'}.`));

  protected readonly sorts = SORT_OPTIONS;
  protected readonly sort = signal<SortKey>('newest');
  protected readonly type = signal('');
  protected readonly query = signal('');
  protected readonly filters = signal<FilterState>({ ...EMPTY_FILTERS });
  protected readonly drawer = signal(false);

  protected readonly effective = computed<FilterState>(() => ({ ...this.filters(), types: this.type() ? [this.type()] : this.filters().types }));
  protected readonly results = computed(() => applyFilters(this.pool(), this.effective(), this.query(), this.sort()));
  protected readonly typeChips = computed(() => (this.cat()?.types ?? []).filter((t) => this.pool().some((p) => p.type === t)));
  protected readonly anyFilter = computed(() => hasFilters(this.filters()) || !!this.query() || !!this.type());

  constructor() {
    effect(() => {
      const c = this.cat();
      if (!c) { this.router.navigateByUrl('/not-found', { replaceUrl: true }); return; }
      this.title.setTitle(`${c.name} | Crafted By Cane`);
      this.meta.updateTag({ name: 'description', content: `${c.heroCopy} ${c.about.p1}` });
      // a different category starts with clean filters
      this.type.set(''); this.query.set(''); this.filters.set({ ...EMPTY_FILTERS });
    }, { allowSignalWrites: true });
  }

  protected onSort(e: Event): void { this.sort.set((e.target as HTMLSelectElement).value as SortKey); }
  protected reset(): void { this.type.set(''); this.query.set(''); this.filters.set({ ...EMPTY_FILTERS }); }
  protected countOf(c: Category): number { return PRODUCTS.filter((p) => p.category === c.slug).length; }
}
