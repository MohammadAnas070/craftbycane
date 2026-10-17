import { ChangeDetectionStrategy, Component, computed, input, output, signal, effect } from '@angular/core';
import { Product } from '../../core/data/products';
import { EmptyStateComponent } from './small.components';
import { ProductCardComponent } from './product-card.component';

/** Product grid with skeleton loading, empty state and a "load more" button with progress. */
@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [ProductCardComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <div class="grid" [class.grid--3]="cols() === 3" aria-busy="true" aria-label="Loading products">
        @for (n of skeletons; track n) {
          <div><div class="skeleton sk-img"></div><div class="skeleton sk-l1"></div><div class="skeleton sk-l2"></div></div>
        }
      </div>
    } @else if (!items().length) {
      <app-empty-state>
        <button type="button" class="btn btn--outline" (click)="reset.emit()">Reset filters</button>
      </app-empty-state>
    } @else {
      <div class="grid" [class.grid--3]="cols() === 3">
        @for (p of shown(); track p.slug; let i = $index) {
          <app-product-card [product]="p" [index]="i" />
        }
      </div>
      @if (items().length > step()) {
        <div class="more">
          <div class="more__bar" role="progressbar" [attr.aria-valuenow]="shown().length" aria-valuemin="0" [attr.aria-valuemax]="items().length" aria-label="Products shown">
            <span [style.width.%]="(shown().length / items().length) * 100"></span>
          </div>
          <p class="more__n">{{ shown().length }} of {{ items().length }} shown</p>
          @if (shown().length < items().length) {
            <button type="button" class="btn btn--outline" (click)="more()">{{ moreLabel() }}</button>
          }
        </div>
      }
    }
  `,
  styles: [`
    :host { display: block; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 36px 16px; }
    @media (min-width: 720px) { .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 40px 20px; } }
    @media (min-width: 1100px) { .grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 44px 22px; } .grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    @media (max-width: 539px) { .grid { gap: 28px 12px; } }
    .sk-img { aspect-ratio: 4 / 5; } .sk-l1 { height: 12px; width: 60%; margin-top: 18px; } .sk-l2 { height: 22px; width: 90%; margin-top: 12px; }
    .more { display: flex; flex-direction: column; align-items: center; gap: 14px; margin-top: 56px; }
    .more__bar { width: 164px; height: 3px; background: var(--sand-2); border-radius: 2px; overflow: hidden; }
    .more__bar span { display: block; height: 100%; background: var(--forest); transition: width 0.5s var(--ease); }
    .more__n { font-size: 13px; color: var(--ink-muted); }
  `],
})
export class ProductGridComponent {
  readonly items = input.required<Product[]>();
  readonly cols = input<3 | 4>(4);
  readonly loading = input(false);
  readonly step = input(12);
  readonly moreLabel = input('Load more pieces');
  readonly reset = output<void>();

  protected readonly skeletons = [1, 2, 3, 4, 5, 6, 7, 8];
  private readonly count = signal(12);
  protected readonly shown = computed(() => this.items().slice(0, this.count()));

  constructor() {
    // a new result set starts from the first page again
    effect(() => { this.items(); this.count.set(this.step()); }, { allowSignalWrites: true });
  }

  protected more(): void { this.count.update((c) => c + this.step()); }
}
