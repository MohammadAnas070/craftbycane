import { ChangeDetectionStrategy, Component, Input, OnInit, computed, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { inject } from '@angular/core';
import { CATEGORIES } from '../../core/data/categories';
import { EMPTY_FILTERS, FilterState, SORT_OPTIONS, SortKey, applyFilters, hasFilters } from '../../core/data/product-filters';
import { PRODUCTS } from '../../core/data/products';
import { cut } from '../../core/data/images';
import { ArtComponent } from '../../shared/components/art.component';
import { FilterPanelComponent } from '../../shared/components/filter-panel.component';
import { IconComponent } from '../../shared/components/icon.component';
import { ProductGridComponent } from '../../shared/components/product-grid.component';
import { CtaBandComponent, PageHeroComponent } from '../../shared/components/small.components';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [PageHeroComponent, ArtComponent, IconComponent, ProductGridComponent, FilterPanelComponent, CtaBandComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  protected readonly categories = CATEGORIES;
  protected readonly sorts = SORT_OPTIONS;
  protected readonly mosaic = [cut('cane-handmade', 3, 'sand'), cut('lamp', 9), cut('zula-furniture', 1)];
  protected readonly crumbs = [{ label: 'Home', link: '/' }, { label: 'Products' }];

  protected readonly cat = signal('all');
  protected readonly query = signal('');
  protected readonly sort = signal<SortKey>('newest');
  protected readonly filters = signal<FilterState>({ ...EMPTY_FILTERS });
  protected readonly drawer = signal(false);
  protected readonly loading = signal(true);

  @Input() set category(v: string | undefined) { this.cat.set(CATEGORIES.some((c) => c.slug === v) ? v! : 'all'); }
  @Input() set q(v: string | undefined) { this.query.set(v ?? ''); }

  protected readonly pool = computed(() => (this.cat() === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === this.cat())));
  protected readonly results = computed(() => applyFilters(this.pool(), this.filters(), this.query(), this.sort()));
  protected readonly activeFilters = computed(() => hasFilters(this.filters()));

  constructor() {
    inject(Title).setTitle('All products | Crafted By Cane');
    inject(Meta).updateTag({ name: 'description', content: 'Browse every handwoven cane piece: chairs, lamps, swings, baskets, mirrors and more. Request a quote on anything that needs a custom size.' });
  }

  ngOnInit(): void {
    // brief skeleton on first load, as products would be fetched
    setTimeout(() => this.loading.set(false), 450);
  }

  protected setCat(slug: string): void { this.cat.set(slug); }
  protected onSort(e: Event): void { this.sort.set((e.target as HTMLSelectElement).value as SortKey); }
  protected resetAll(): void { this.cat.set('all'); this.query.set(''); this.filters.set({ ...EMPTY_FILTERS }); }
}
