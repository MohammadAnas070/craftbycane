import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SEARCH_SUGGESTIONS } from '../../core/data/content';
import { PRODUCTS, Product, categoryNameOf } from '../../core/data/products';
import { UiService } from '../../core/services/ui.service';
import { ArtComponent } from './art.component';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-search-overlay',
  standalone: true,
  imports: [RouterLink, ArtComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ov" [class.is-open]="ui.searchOpen()" [attr.aria-hidden]="!ui.searchOpen()">
      <div class="ov__scrim" (click)="ui.closeSearch()"></div>
      <div class="ov__panel" role="dialog" aria-modal="true" aria-label="Search" [attr.inert]="ui.searchOpen() ? null : ''">
        <form class="ov__form" (submit)="go($event)" role="search">
          <app-icon name="search" [s]="20" />
          <input #field type="search" class="ov__input" placeholder="Search pieces, categories, journal..." aria-label="Search the site"
            [value]="query()" (input)="query.set($any($event.target).value)" autocomplete="off" />
          <button type="button" class="ov__close" (click)="ui.closeSearch()" aria-label="Close search"><app-icon name="close" [s]="20" /></button>
        </form>
        <div class="chip-row ov__chips">
          @for (s of suggestions; track s) {
            <button type="button" class="chip" (click)="query.set(s)">{{ s }}</button>
          }
        </div>
        <ul class="ov__results">
          @for (p of results(); track p.slug) {
            <li>
              <a [routerLink]="['/products', p.slug]" class="ov__item">
                <app-art [art]="p.image" [alt]="p.name" aspect="1 / 1" />
                <span class="ov__name">{{ p.name }}</span>
                <span class="ov__cat">{{ catName(p) }}</span>
              </a>
            </li>
          } @empty {
            <li class="ov__empty">No pieces match “{{ query() }}”. <a routerLink="/custom-orders">Request a custom piece</a></li>
          }
        </ul>
        @if (query().trim()) {
          <a class="link-arrow ov__all" [routerLink]="['/search']" [queryParams]="{ q: query().trim() }">See all results <app-icon class="arrow" name="arrow-right" [s]="14" /></a>
        }
      </div>
    </div>
  `,
  styles: [`
    .ov { position: fixed; inset: 0; z-index: 110; visibility: hidden; transition: visibility 0s linear 0.35s; }
    .ov.is-open { visibility: visible; transition-delay: 0s; }
    .ov__scrim { position: absolute; inset: 0; background: rgba(41, 40, 35, 0.6); backdrop-filter: none; opacity: 0; transition: opacity 0.3s var(--ease); }
    .is-open .ov__scrim { opacity: 1; }
    .ov__panel { position: relative; width: min(900px, 100% - 2 * var(--gutter)); margin: clamp(20px, 8vh, 90px) auto 0; padding: 28px clamp(20px, 3vw, 36px) 32px; background: var(--ivory); border-radius: var(--radius); box-shadow: var(--shadow); max-height: calc(100vh - 40px); overflow-y: auto; opacity: 0; transform: translateY(-14px); transition: opacity 0.3s var(--ease), transform 0.4s var(--ease); }
    .is-open .ov__panel { opacity: 1; transform: none; }
    .ov__form { display: flex; align-items: center; gap: 14px; padding-bottom: 14px; border-bottom: 1px solid var(--forest); color: var(--ink-muted); }
    .ov__input { flex: 1; min-width: 0; border: 0; background: transparent; font-family: var(--font-serif); font-size: clamp(22px, 3vw, 30px); color: var(--forest); outline: none; padding: 4px 0; }
    .ov__input::placeholder { color: #a39c8e; }
    .ov__close { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 50%; &:hover { background: var(--sand); } }
    .ov__chips { margin-top: 18px; }
    .ov__chips .chip { min-height: 32px; padding: 0 16px; font-size: 12.5px; }
    .ov__results { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; margin-top: 24px; }
    @media (min-width: 720px) { .ov__results { grid-template-columns: repeat(4, 1fr); } }
    .ov__item { display: flex; flex-direction: column; gap: 4px; &:hover .ov__name { color: var(--terracotta); } &:hover app-art ::ng-deep img { transform: scale(1.06); } }
    .ov__item app-art { border-radius: var(--radius); margin-bottom: 8px; }
    .ov__item app-art ::ng-deep img { transition: transform 0.6s var(--ease), opacity 0.4s; }
    .ov__name { font-family: var(--font-serif); font-size: 18px; line-height: 1.15; color: var(--forest); transition: color 0.2s; }
    .ov__cat { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--cane-dark); font-weight: 600; }
    .ov__empty { grid-column: 1 / -1; padding: 24px 0; color: var(--ink-muted); a { color: var(--terracotta); text-decoration: underline; } }
    .ov__all { margin-top: 24px; }
  `],
})
export class SearchOverlayComponent {
  protected readonly ui = inject(UiService);
  private readonly router = inject(Router);
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');

  protected readonly suggestions = SEARCH_SUGGESTIONS;
  protected readonly query = signal('');
  protected readonly results = computed<Product[]>(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return PRODUCTS.filter((p) => p.featured).slice(0, 4);
    return PRODUCTS.filter((p) => (p.name + ' ' + p.desc + ' ' + p.type + ' ' + categoryNameOf(p)).toLowerCase().includes(q)).slice(0, 4);
  });

  constructor() {
    effect(() => {
      if (this.ui.searchOpen()) setTimeout(() => this.field()?.nativeElement.focus(), 60);
    });
  }

  protected catName(p: Product): string { return categoryNameOf(p); }

  protected go(e: Event): void {
    e.preventDefault();
    const q = this.query().trim();
    if (q) this.router.navigate(['/search'], { queryParams: { q } });
  }
}
