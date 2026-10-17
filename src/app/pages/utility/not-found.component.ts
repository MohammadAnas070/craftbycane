import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="nf">
      <svg class="nf__weave" viewBox="0 0 400 400" aria-hidden="true">
        <defs><pattern id="w" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M0 20 20 0 40 20 20 40Z" fill="none" stroke="#b78b5a" stroke-width="1.2" /><path d="M20 0v40M0 20h40" stroke="#b78b5a" stroke-width="0.6" opacity=".6" /></pattern></defs>
        <rect width="400" height="400" fill="url(#w)" />
      </svg>
      <div class="container nf__in">
        <p class="eyebrow eyebrow--center">Error 404</p>
        <h1>This page slipped through the weave</h1>
        <p class="lead">The page you are looking for may have moved. Try searching, or head back to the collection.</p>
        <div class="nf__btns">
          <a routerLink="/" class="btn">Back to homepage</a>
          <a routerLink="/products" class="btn btn--outline">Browse products</a>
        </div>
        <ul class="chip-row nf__chips">
          <li><a class="chip" [routerLink]="['/categories', 'cane-wicker']">Wicker</a></li>
          <li><a class="chip" [routerLink]="['/categories', 'lamp']">Lamps</a></li>
          <li><a class="chip" [routerLink]="['/categories', 'zula-furniture']">Zula and Swings</a></li>
          <li><a class="chip" [routerLink]="['/categories', 'rope-work']">Rope work</a></li>
          <li><a class="chip" routerLink="/custom-orders">Custom orders</a></li>
        </ul>
      </div>
    </section>
  `,
  styles: [`
    .nf { position: relative; overflow: hidden; min-height: 70vh; display: grid; place-items: center; background: var(--ivory-2); padding-block: 80px; text-align: center; }
    .nf__weave { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.14; mask-image: radial-gradient(closest-side, transparent 30%, #000); -webkit-mask-image: radial-gradient(closest-side, transparent 30%, #000); animation: drift 40s linear infinite alternate; }
    @keyframes drift { to { transform: scale(1.15) translate(-2%, 2%); } }
    .nf__in { position: relative; display: flex; flex-direction: column; align-items: center; gap: 22px; max-width: 640px; }
    h1 { font-size: clamp(42px, 6vw, 76px); animation: fade-up 0.8s var(--ease) both; }
    .lead { animation: fade-up 0.8s var(--ease) 0.15s both; }
    .nf__btns { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 10px; }
    .nf__chips { justify-content: center; margin-top: 18px; }
  `],
})
export class NotFoundComponent {
  constructor() {
    inject(Title).setTitle('Page not found | Crafted By Cane');
    inject(Meta).updateTag({ name: 'robots', content: 'noindex' });
  }
}
