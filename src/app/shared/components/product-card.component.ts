import { ChangeDetectionStrategy, Component, Input, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product, categoryNameOf, formatPrice } from '../../core/data/products';
import { WishlistService } from '../../core/services/wishlist.service';
import { ArtComponent } from './art.component';
import { IconComponent } from './icon.component';
import { RevealDirective } from '../directives/reveal.directive';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, ArtComponent, IconComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card" [appReveal]="delay()">
      <div class="card__media">
        <app-art [art]="p().image" [alt]="p().name + ', ' + category()" aspect="4 / 5" [eager]="eager" />
        @if (p().badge) {
          <span class="card__badge" [class.card__badge--new]="p().badge === 'NEW'">{{ p().badge }}</span>
        }
        <button type="button" class="card__heart" [class.is-on]="saved()" (click)="toggle($event)"
          [attr.aria-pressed]="saved()" [attr.aria-label]="(saved() ? 'Remove ' : 'Save ') + p().name + (saved() ? ' from wishlist' : ' to wishlist')">
          <app-icon name="heart" [s]="16" />
        </button>
        <span class="card__quick" aria-hidden="true">Quick view</span>
      </div>
      <div class="card__body">
        <p class="card__cat">{{ category() }}</p>
        <h3 class="card__name"><a [routerLink]="['/products', p().slug]" class="card__link">{{ p().name }}</a></h3>
        <p class="card__desc">{{ p().desc }}</p>
        <p class="price">
          @switch (p().priceType) {
            @case ('fixed') { <span class="price__v">{{ price() }}</span> }
            @case ('from') { <span class="price__pre">From</span><span class="price__v">{{ price() }}</span> }
            @default { <span class="price__quote"><span class="price__ring"></span>Request a Quote</span> }
          }
        </p>
      </div>
    </article>
  `,
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  private readonly wishlist = inject(WishlistService);
  protected readonly p = signal<Product>(null!);
  protected readonly category = computed(() => categoryNameOf(this.p()));
  protected readonly price = computed(() => (this.p().price ? formatPrice(this.p().price!) : ''));
  protected readonly delay = signal(0);

  @Input({ required: true }) set product(v: Product) { this.p.set(v); }
  /** position in the visible list; drives the 60 ms stagger */
  @Input() set index(v: number) { this.delay.set((v % 12) * 60); }
  @Input() eager = false;

  protected saved(): boolean { return this.wishlist.has(this.p().slug); }

  protected toggle(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.wishlist.toggle(this.p().slug);
  }
}
