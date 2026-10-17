import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, computed, effect, inject, input, signal, untracked, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { ART, ArtDef, CATEGORIES, categoryBySlug } from '../../core/data/categories';
import { PRODUCTS, Product, categoryNameOf, formatPrice, productBySlug } from '../../core/data/products';
import { SITE, whatsappUrl } from '../../core/data/site';
import { InquiryResult, InquiryService } from '../../core/services/inquiry.service';
import { UiService } from '../../core/services/ui.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ArtComponent } from '../../shared/components/art.component';
import { FieldErrorComponent, emailValidator, phoneValidator } from '../../shared/components/field-error.component';
import { IconComponent } from '../../shared/components/icon.component';
import { InquiryResultComponent } from '../../shared/components/inquiry-result.component';
import { LightboxComponent, LightboxItem } from '../../shared/components/lightbox.component';
import { ProductCardComponent } from '../../shared/components/product-card.component';
import { BreadcrumbComponent } from '../../shared/components/small.components';
import { RevealDirective } from '../../shared/directives/reveal.directive';

const SWATCH: Record<string, string> = { Natural: '#d4b48a', Honey: '#c3924f', 'Dark walnut': '#8b6537' };
const SIZES = ['Standard', 'Large', 'Custom size'];

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, ArtComponent, IconComponent, BreadcrumbComponent, ProductCardComponent, LightboxComponent, FieldErrorComponent, InquiryResultComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly inquiry = inject(InquiryService);
  private readonly ui = inject(UiService);
  protected readonly wishlist = inject(WishlistService);

  readonly slug = input.required<string>();
  protected readonly p = computed<Product | undefined>(() => productBySlug(this.slug()));
  protected readonly cat = computed(() => categoryBySlug(this.p()?.category));
  protected readonly crumbs = computed(() => {
    const p = this.p(), c = this.cat();
    return [{ label: 'Home', link: '/' }, { label: 'Products', link: '/products' }, { label: c?.short ?? '', link: c ? ['/categories', c.slug] : undefined }, { label: p?.name ?? '' }];
  });

  protected readonly sizes = SIZES;
  protected readonly swatch = SWATCH;
  protected readonly finish = signal('');
  protected readonly size = signal('Standard');
  protected readonly qty = signal(1);
  protected readonly note = signal('');
  protected readonly noteOpen = signal(false);

  protected readonly gallery = computed<ArtDef[]>(() => this.p()?.gallery ?? []);
  protected readonly gi = signal(0);
  protected readonly lightbox = signal(false);
  protected readonly lbItems = computed<LightboxItem[]>(() =>
    this.gallery().map((a, i) => ({ art: a, title: i === 0 ? (this.p()?.name ?? '') : i === 1 && this.p()?.image.mode === 'cutout' ? `${this.p()?.name}, original photo` : `More from ${this.cat()?.short ?? 'the range'}`, eyebrow: `Photo ${i + 1} of ${this.gallery().length}` })),
  );
  protected readonly zoom = signal({ on: false, x: 50, y: 50 });

  protected readonly priceText = computed(() => {
    const p = this.p();
    return p?.price ? formatPrice(p.price) : '';
  });

  protected readonly waMessage = computed(() => {
    const p = this.p();
    if (!p) return '';
    const bits = [`finish ${this.finish()}`, `size ${this.size()}`, `quantity ${this.qty()}`];
    const note = this.note().trim();
    return `Hello, I am interested in the ${p.name} (code ${p.code}), ${bits.join(', ')}.${note ? ` Note: ${note}.` : ''} Could you share the price and timeline?`;
  });
  protected readonly waUrl = computed(() => whatsappUrl(this.waMessage()));

  protected readonly related = computed(() => {
    const p = this.p();
    if (!p) return [];
    const same = PRODUCTS.filter((x) => x.category === p.category && x.slug !== p.slug);
    const rest = PRODUCTS.filter((x) => x.category !== p.category && x.featured);
    return [...same, ...rest].slice(0, 4);
  });
  protected readonly recent = computed(() => this.wishlist.recent().filter((x) => x.slug !== this.slug()).slice(0, 3));

  protected readonly care = ['Dust with a soft dry cloth or brush.', 'Wipe spills right away with a slightly damp cloth.', 'Keep out of constant direct sun and heavy rain.', 'Avoid sitting on the cane back or standing on the seat.'];
  protected readonly dims = computed(() => {
    const p = this.p();
    if (!p) return '';
    return p.type === 'Chairs' ? 'Standard 70 × 72 × 85 cm · Large 78 × 78 × 90 cm (sample)' : 'Sample sizes are confirmed with your quotation';
  });

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    phone: new FormControl('', { nonNullable: true, validators: [phoneValidator] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, emailValidator] }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
  });
  protected readonly sending = signal(false);
  protected readonly result = signal<InquiryResult | null>(null);
  protected readonly inquiryEl = viewChild<ElementRef<HTMLElement>>('inquiryEl');

  constructor() {
    this.ui.hideFab.set(true);
    effect(() => {
      const p = this.p();
      if (!p) { this.router.navigateByUrl('/not-found', { replaceUrl: true }); return; }
      this.title.setTitle(`${p.name} | Crafted By Cane`);
      this.meta.updateTag({ name: 'description', content: `${p.desc} ${categoryNameOf(p)}. Request a quote or message us on WhatsApp.` });
      this.finish.set(p.finishes[Math.min(1, p.finishes.length - 1)]);
      this.size.set('Standard'); this.qty.set(1); this.note.set(''); this.noteOpen.set(false); this.gi.set(0);
      this.result.set(null);
      // untracked: markViewed reads and writes the recent list, which would re-trigger this effect forever
      untracked(() => this.wishlist.markViewed(p.slug));
    }, { allowSignalWrites: true });
  }

  ngOnDestroy(): void { this.ui.hideFab.set(false); }

  protected saved(): boolean { return this.wishlist.has(this.slug()); }
  protected bumpQty(d: number): void { this.qty.update((q) => Math.max(1, Math.min(99, q + d))); }

  protected onQty(e: Event): void {
    const v = parseInt((e.target as HTMLInputElement).value, 10);
    this.qty.set(Number.isFinite(v) ? Math.max(1, Math.min(99, v)) : 1);
  }

  protected onZoom(e: MouseEvent): void {
    if (window.matchMedia('(hover: none)').matches) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.zoom.set({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  }

  protected requestQuote(): void {
    this.form.controls.message.setValue(this.waMessage());
    this.result.set(null);
    this.inquiryEl()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected async send(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const p = this.p()!;
    const v = this.form.getRawValue();
    this.sending.set(true);
    const res = await this.inquiry.submit({
      kind: 'product',
      subject: `inquiry about ${p.name} (${p.code})`,
      fields: [
        { label: 'Name', value: v.name }, { label: 'Phone', value: v.phone }, { label: 'Email', value: v.email },
        { label: 'Product', value: `${p.name} (${p.code})` }, { label: 'Message', value: v.message },
      ],
    });
    this.sending.set(false);
    this.result.set(res);
  }

  protected whatsappFromForm(): string { return whatsappUrl(this.waMessage()); }
  protected readonly site = SITE;
  protected readonly cats = CATEGORIES;
  protected readonly art = ART;
  protected catName(p: Product): string { return categoryNameOf(p); }
  protected prepared(): Extract<InquiryResult, { status: 'prepared' }> | null {
    const r = this.result();
    return r && r.status === 'prepared' ? r : null;
  }
}
