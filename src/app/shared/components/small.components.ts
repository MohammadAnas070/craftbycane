import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { whatsappUrl } from '../../core/data/site';
import { UiService } from '../../core/services/ui.service';
import { RevealDirective } from '../directives/reveal.directive';
import { IconComponent } from './icon.component';

/* ------------------------------ floating WhatsApp ------------------------------ */
@Component({
  selector: 'app-whatsapp-fab',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="fab no-print" [class.is-hidden]="ui.hideFab()" [href]="url" target="_blank" rel="noopener" aria-label="Message us on WhatsApp">
      <app-icon name="whatsapp" [s]="26" [stroke]="1.5" />
      <span class="fab__tip">WhatsApp</span>
    </a>
  `,
  styles: [`
    .fab { position: fixed; right: 20px; bottom: 20px; z-index: 55; width: 56px; height: 56px; display: grid; place-items: center; border-radius: 50%;
      background: var(--forest); color: var(--ivory); box-shadow: 0 12px 28px rgba(41, 40, 35, 0.28);
      animation: fab-in 0.6s var(--ease) 1.2s backwards; transition: transform 0.3s var(--ease), background-color 0.2s, opacity 0.25s; }
    .fab:hover { background: var(--forest-dark); transform: translateY(-3px) scale(1.05); }
    .fab.is-hidden { opacity: 0; pointer-events: none; transform: translateY(16px); }
    .fab__tip { position: absolute; right: 68px; padding: 7px 12px; background: var(--charcoal); color: var(--ivory); border-radius: 2px; font-size: 12px; letter-spacing: 0.08em; white-space: nowrap; opacity: 0; transform: translateX(8px); transition: opacity 0.25s, transform 0.25s var(--ease); pointer-events: none; }
    .fab:hover .fab__tip, .fab:focus-visible .fab__tip { opacity: 1; transform: none; }
    @keyframes fab-in { from { opacity: 0; transform: translateY(20px) scale(0.8); } }
    @media (max-width: 640px) { .fab { right: 14px; bottom: 14px; width: 52px; height: 52px; } .fab__tip { display: none; } }
  `],
})
export class WhatsappFabComponent {
  protected readonly ui = inject(UiService);
  protected readonly url = whatsappUrl('Hello Crafted By Cane, I would like to know more about your pieces.');
}

/* ------------------------------ breadcrumb ------------------------------ */
export interface Crumb { label: string; link?: string | string[] }

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="bc" aria-label="Breadcrumb">
      <ol>
        @for (c of items; track c.label; let last = $last) {
          <li>
            @if (c.link && !last) { <a [routerLink]="c.link">{{ c.label }}</a> }
            @else { <span [attr.aria-current]="last ? 'page' : null">{{ c.label }}</span> }
            @if (!last) { <app-icon name="chevron-right" [s]="12" /> }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: [`
    ol { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 4px; font-size: 13px; color: var(--ink-muted); }
    li { display: inline-flex; align-items: center; gap: 8px; margin-right: 6px; }
    a { transition: color 0.2s; }
    a:hover { color: var(--terracotta); }
    li:last-child span { color: var(--charcoal); font-weight: 500; }
  `],
})
export class BreadcrumbComponent {
  @Input({ required: true }) items: Crumb[] = [];
}

/* ------------------------------ page hero (compact) ------------------------------ */
@Component({
  selector: 'app-page-hero',
  standalone: true,
  imports: [BreadcrumbComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="ph" [class.ph--forest]="tone === 'forest'" [class.ph--sand]="tone === 'sand'">
      <div class="container ph__in">
        <div class="ph__copy">
          @if (crumbs.length) { <app-breadcrumb [items]="crumbs" class="ph__bc" /> }
          @if (eyebrow) { <span class="eyebrow ph__eyebrow">{{ eyebrow }}</span> }
          <h1 class="ph__title">{{ heading }}</h1>
          @if (lead) { <p class="lead ph__lead">{{ lead }}</p> }
          <ng-content />
        </div>
        <div class="ph__side"><ng-content select="[side]" /></div>
      </div>
    </section>
  `,
  styles: [`
    .ph { background: var(--ivory-2); position: relative; overflow: hidden; }
    .ph--sand { background: var(--sand); }
    .ph--forest { background: var(--forest); color: var(--ivory); }
    .ph--forest .ph__title { color: var(--ivory); }
    .ph--forest .lead { color: rgba(248, 245, 239, 0.85); }
    .ph--forest .eyebrow { color: var(--cane); }
    .ph__in { display: grid; gap: 32px; align-items: center; padding-block: clamp(36px, 5vw, 64px); }
    @media (min-width: 900px) { .ph__in { grid-template-columns: 1.1fr 1fr; } }
    .ph__bc { display: block; margin-bottom: 36px; }
    .ph__eyebrow { margin-bottom: 18px; }
    .ph__title { font-size: clamp(44px, 5.8vw, 76px); line-height: 1; animation: fade-up 0.8s var(--ease) both; }
    .ph__lead { margin-top: 22px; animation: fade-up 0.8s var(--ease) 0.12s both; }
    .ph__eyebrow, .ph__bc { animation: fade-in 0.6s var(--ease) both; }
    .ph__side:empty { display: none; }
  `],
})
export class PageHeroComponent {
  @Input() crumbs: Crumb[] = [];
  @Input() eyebrow = '';
  @Input({ required: true }) heading = '';
  @Input() lead = '';
  @Input() tone: 'warm' | 'sand' | 'forest' = 'warm';
}

/* ------------------------------ CTA band ------------------------------ */
@Component({
  selector: 'app-cta-band',
  standalone: true,
  imports: [RouterLink, IconComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="band--sand cta">
      <div class="container cta__in" appReveal>
        <div>
          <h2 class="cta__title">{{ heading }}</h2>
          <p class="lead cta__text">{{ text }}</p>
        </div>
        <div class="cta__btns">
          <a [routerLink]="primaryLink" class="btn">{{ primaryLabel }}</a>
          <a [href]="wa" target="_blank" rel="noopener" class="btn btn--wa"><app-icon name="whatsapp" [s]="17" /> WhatsApp</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .cta { padding-block: clamp(56px, 7vw, 96px); }
    .cta__in { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 28px 48px; }
    .cta__title { font-size: clamp(32px, 3.6vw, 48px); max-width: 18ch; }
    .cta__text { margin-top: 16px; max-width: 46ch; color: var(--charcoal); }
    .cta__btns { display: flex; flex-wrap: wrap; gap: 14px; }
  `],
})
export class CtaBandComponent {
  @Input() heading = 'Have a space in mind? We will make it to fit.';
  @Input() text = 'Share your idea, size and finish. We reply with a quotation request form and next steps.';
  @Input() primaryLabel = 'Custom order';
  @Input() primaryLink: string | string[] = '/custom-orders';
  protected readonly wa = whatsappUrl('Hello Crafted By Cane, I have a space in mind and would like a custom piece.');
}

/* ------------------------------ empty state ------------------------------ */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty">
      <app-icon [name]="icon" [s]="30" />
      <h3>{{ heading }}</h3>
      <p class="muted">{{ text }}</p>
      <ng-content />
    </div>
  `,
  styles: [`
    .empty { display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; padding: 56px 24px; border: 1px dashed var(--cane); border-radius: var(--radius); color: var(--cane); animation: fade-in 0.4s var(--ease); }
    h3 { font-size: 28px; font-weight: 400; margin-top: 6px; }
    p { max-width: 44ch; }
    :host ::ng-deep .btn { margin-top: 12px; }
  `],
})
export class EmptyStateComponent {
  @Input() icon = 'search';
  @Input() heading = 'No pieces match these filters';
  @Input() text = 'Try clearing a filter, or tell us what you are looking for.';
}
