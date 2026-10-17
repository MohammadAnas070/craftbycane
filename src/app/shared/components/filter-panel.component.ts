import { ChangeDetectionStrategy, Component, Input, computed, input, model, signal } from '@angular/core';
import { ALL_FINISHES, ALL_MATERIALS, ALL_PRICES, EMPTY_FILTERS, FilterState, PRICE_LABEL, hasFilters, toggleIn } from '../../core/data/product-filters';
import { PriceType, Product } from '../../core/data/products';
import { IconComponent } from './icon.component';

type GroupKey = 'types' | 'materials' | 'finishes' | 'prices';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (showSearch()) {
      <div class="fp__search">
        <app-icon name="search" [s]="16" />
        <input type="search" class="fp__input" [placeholder]="searchPlaceholder()" [value]="query()" (input)="query.set($any($event.target).value)" aria-label="Search" />
      </div>
    }
    @for (g of groups(); track g.key) {
      <fieldset class="fp__group">
        <legend class="sr-only">{{ g.label }}</legend>
        <button type="button" class="fp__head" (click)="toggle(g.key)" [attr.aria-expanded]="!closed().has(g.key)">
          <span>{{ g.label }}</span>
          <app-icon [name]="closed().has(g.key) ? 'plus' : 'minus'" [s]="14" />
        </button>
        <div class="fp__body" [class.is-closed]="closed().has(g.key)">
          <div>
            @for (o of g.options; track o.value) {
              <label class="check fp__opt">
                <input type="checkbox" [checked]="state()[g.key].includes($any(o.value))" (change)="pick(g.key, o.value)" />
                <span>{{ o.label }}</span>
                <span class="fp__n">{{ o.count }}</span>
              </label>
            }
          </div>
        </div>
      </fieldset>
    }
    <button type="button" class="btn btn--outline btn--sm fp__clear" [disabled]="!active()" (click)="clear()">Clear filters</button>
  `,
  styles: [`
    :host { display: block; }
    .fp__search { display: flex; align-items: center; gap: 10px; height: 46px; padding: 0 14px; background: var(--white); border: 1px solid var(--line); border-radius: var(--radius); color: var(--ink-muted); transition: border-color 0.2s, box-shadow 0.2s; }
    .fp__search:focus-within { border-color: var(--forest); box-shadow: 0 0 0 1px var(--forest); }
    .fp__input { flex: 1; min-width: 0; border: 0; background: transparent; font: inherit; font-size: 14px; outline: none; color: var(--charcoal); }
    .fp__group { border: 0; margin: 28px 0 0; padding: 0; min-width: 0; }
    .fp__head { display: flex; width: 100%; align-items: center; justify-content: space-between; padding-bottom: 10px; border-bottom: 1px solid var(--line); font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; }
    .fp__body { display: grid; grid-template-rows: 1fr; transition: grid-template-rows 0.3s var(--ease); }
    .fp__body.is-closed { grid-template-rows: 0fr; }
    .fp__body > div { overflow: hidden; padding-top: 6px; }
    .fp__opt { padding-block: 7px; font-size: 14px; }
    .fp__opt span:nth-of-type(1) { flex: 1; }
    .fp__n { font-size: 12px; color: var(--ink-muted); }
    .fp__clear { margin-top: 28px; }
  `],
})
export class FilterPanelComponent {
  readonly pool = input.required<Product[]>();
  readonly types = input<string[]>([]);
  readonly showSearch = input(false);
  readonly searchPlaceholder = input('Search this category');
  readonly state = model.required<FilterState>();
  readonly query = model('');

  protected readonly closed = signal(new Set<GroupKey>());
  protected readonly active = computed(() => hasFilters(this.state()) || !!this.query());

  protected readonly groups = computed(() => {
    const pool = this.pool();
    const count = (fn: (p: Product) => boolean) => pool.filter(fn).length;
    const g: { key: GroupKey; label: string; options: { value: string; label: string; count: number }[] }[] = [];
    if (this.types().length) {
      g.push({ key: 'types', label: 'Type', options: this.types().map((t) => ({ value: t, label: t, count: count((p) => p.type === t) })).filter((o) => o.count) });
    }
    g.push({ key: 'materials', label: 'Material', options: ALL_MATERIALS.map((m) => ({ value: m, label: m, count: count((p) => p.material === m) })).filter((o) => o.count) });
    g.push({ key: 'finishes', label: 'Finish', options: ALL_FINISHES.map((f) => ({ value: f, label: f, count: count((p) => p.finishes.includes(f)) })).filter((o) => o.count) });
    g.push({ key: 'prices', label: 'Price', options: ALL_PRICES.map((v) => ({ value: v, label: PRICE_LABEL[v], count: count((p) => p.priceType === v) })).filter((o) => o.count) });
    return g.filter((x) => x.options.length);
  });

  protected pick(key: GroupKey, value: string): void {
    const s = this.state();
    this.state.set({ ...s, [key]: toggleIn(s[key] as string[], value) } as FilterState);
  }

  protected toggle(key: GroupKey): void {
    this.closed.update((c) => { const n = new Set(c); n.has(key) ? n.delete(key) : n.add(key); return n; });
  }

  clear(): void {
    this.state.set({ ...EMPTY_FILTERS });
    this.query.set('');
  }
}
