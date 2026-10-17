import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { formatPrice } from '../../core/data/products';
import { InquiryResult, InquiryService } from '../../core/services/inquiry.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { IconComponent } from '../../shared/components/icon.component';
import { InquiryResultComponent } from '../../shared/components/inquiry-result.component';
import { ProductCardComponent } from '../../shared/components/product-card.component';
import { BreadcrumbComponent, EmptyStateComponent } from '../../shared/components/small.components';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink, IconComponent, ProductCardComponent, BreadcrumbComponent, EmptyStateComponent, InquiryResultComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="head">
      <div class="container head__in">
        <div>
          <app-breadcrumb [items]="[{ label: 'Home', link: '/' }, { label: 'Wishlist' }]" />
          <h1>Your wishlist <span class="n">{{ wl.count() }}</span></h1>
          <p class="muted head__p">Saved items stay on this device. Send the list to us in one message and we will quote everything together.</p>
        </div>
        @if (wl.count()) {
          <div class="head__btns">
            <button type="button" class="btn" (click)="send()" [disabled]="sending()">{{ sending() ? 'Preparing...' : 'Send as one inquiry' }}</button>
            <button type="button" class="btn btn--outline" (click)="wl.clear(); result.set(null)"><app-icon name="trash" [s]="15" /> Clear</button>
          </div>
        }
      </div>
    </section>

    <section class="section--tight body">
      <div class="container">
        @if (prepared(); as r) {
          <div class="res"><app-inquiry-result heading="Your wishlist inquiry is ready" [text]="r.text" [whatsapp]="r.whatsapp" [mailto]="r.mailto" (edit)="result.set(null)" /></div>
        }
        @if (wl.items().length) {
          <div class="grid">@for (p of wl.items(); track p.slug; let i = $index) { <app-product-card [product]="p" [index]="i" /> }</div>
          <p class="note muted">Wishlist items are not reserved. Availability and price are confirmed with your quotation.</p>
        } @else {
          <app-empty-state icon="heart" heading="Nothing saved yet" text="Tap the heart on any piece to keep it here.">
            <a routerLink="/products" class="btn">Browse products</a>
          </app-empty-state>
        }
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .head { background: var(--ivory-2); padding-block: 36px 44px; }
    .head__in { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 24px; }
    .head h1 { margin-top: 26px; font-size: clamp(38px, 5vw, 64px); }
    .n { display: inline-grid; place-items: center; min-width: 40px; height: 40px; padding: 0 12px; margin-left: 8px; vertical-align: middle; background: var(--terracotta); color: var(--ivory); border-radius: 999px; font-family: var(--font-sans); font-size: 16px; font-weight: 600; }
    .head__p { margin-top: 14px; max-width: 52ch; }
    .head__btns { display: flex; flex-wrap: wrap; gap: 12px; }
    .body { padding-block: 44px clamp(64px, 8vw, 104px); min-height: 40vh; }
    .res { margin-bottom: 40px; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px 14px; }
    @media (min-width: 900px) { .grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 40px 22px; } }
    .note { margin-top: 40px; font-size: 13px; text-align: center; }
  `],
})
export class WishlistComponent {
  protected readonly wl = inject(WishlistService);
  private readonly inquiry = inject(InquiryService);
  protected readonly sending = signal(false);
  protected readonly result = signal<InquiryResult | null>(null);

  constructor() {
    inject(Title).setTitle('Wishlist | Crafted By Cane');
    inject(Meta).updateTag({ name: 'robots', content: 'noindex' });
  }

  protected async send(): Promise<void> {
    this.sending.set(true);
    const list = this.wl.items().map((p, i) => `${i + 1}. ${p.name} (${p.code}), ${p.price ? (p.priceType === 'from' ? 'from ' : '') + formatPrice(p.price) : 'quote requested'}`).join('\n');
    this.result.set(await this.inquiry.submit({ kind: 'wishlist', subject: 'I would like a quotation for these pieces', fields: [{ label: 'Pieces', value: '\n' + list }] }));
    this.sending.set(false);
  }

  protected prepared(): Extract<InquiryResult, { status: 'prepared' }> | null {
    const r = this.result();
    return r && r.status === 'prepared' ? r : null;
  }
}
