import { ChangeDetectionStrategy, Component, ElementRef, computed, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIES } from '../../core/data/categories';
import { cut, photo } from '../../core/data/images';
import { HOME_TESTIMONIALS, PROCESS_SHORT, WHY_US } from '../../core/data/content';
import { HomeTag, PRODUCTS } from '../../core/data/products';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { ArtComponent } from '../../shared/components/art.component';
import { IconComponent } from '../../shared/components/icon.component';
import { NewsletterFormComponent } from '../../shared/components/newsletter-form.component';
import { ProductCardComponent } from '../../shared/components/product-card.component';
import { HeroComponent } from './hero.component';
import { Title, Meta } from '@angular/platform-browser';
import { inject } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RevealDirective, ArtComponent, IconComponent, NewsletterFormComponent, ProductCardComponent, HeroComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor() {
    inject(Title).setTitle('Crafted By Cane | Handmade cane furniture and decor');
    inject(Meta).updateTag({ name: 'description', content: 'Hand-woven cane furniture, lamps, swings and home pieces, made by skilled artisans from natural materials and finished to fit your space.' });
  }

  protected readonly categories = CATEGORIES;
  protected readonly process = PROCESS_SHORT;
  protected readonly why = WHY_US;
  protected readonly quotes = HOME_TESTIMONIALS;

  /* category carousel */
  private readonly track = viewChild<ElementRef<HTMLElement>>('track');
  protected readonly atStart = signal(true);
  protected readonly atEnd = signal(false);

  protected scrollTrack(dir: 1 | -1): void {
    const el = this.track()?.nativeElement;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.cat');
    const step = (card?.offsetWidth ?? 240) + 22;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }

  protected onTrackScroll(): void {
    const el = this.track()?.nativeElement;
    if (!el) return;
    this.atStart.set(el.scrollLeft < 8);
    this.atEnd.set(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }

  /* featured products */
  protected readonly tabs: ('All' | HomeTag)[] = ['All', 'Furniture', 'Lighting', 'Decor', 'Swings'];
  protected readonly tab = signal<'All' | HomeTag>('All');
  protected readonly featured = computed(() => {
    const t = this.tab();
    const pool = t === 'All' ? PRODUCTS.filter((p) => p.featured) : PRODUCTS.filter((p) => p.tag === t);
    return [...pool].sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || a.order - b.order).slice(0, 4);
  });

  /* testimonials */
  protected readonly q = signal(0);
  protected readonly quote = computed(() => this.quotes[this.q()]);
  protected readonly dir = signal<'next' | 'prev'>('next');
  protected step(d: 1 | -1): void {
    this.dir.set(d === 1 ? 'next' : 'prev');
    this.q.update((i) => (i + d + this.quotes.length) % this.quotes.length);
  }

  protected readonly installs = [
    { art: photo('rope-work', 1), label: 'Rope swing daybed, garden', link: '/products/teak-rope-swing-daybed', cls: 'big' },
    { art: photo('cane-handmade', 6), label: 'Cane lounge seating', link: '/categories/cane-handmade', cls: '' },
    { art: photo('lamp', 12), label: 'Pendant among plants', link: '/products/cane-bell-pendant', cls: '' },
    { art: photo('zula-furniture', 6), label: 'Drum table and chairs', link: '/products/cane-drum-table-and-chairs', cls: '' },
    { art: photo('cane-stepler', 5), label: 'Cane-back bench', link: '/products/cane-back-bench-green-seat', cls: '' },
  ];

  protected readonly storyWeave = photo('cane-handmade', 16);
  protected readonly storyChair = cut('cane-handmade', 3, 'peach');
  protected readonly custChair = cut('cane-handmade', 8, 'peach');
  protected readonly custLamp = cut('lamp', 5);

  protected readonly social = [
    { art: cut('cane-handmade', 11), link: '/products/woven-ottoman-stool' },
    { art: cut('lamp', 13), link: '/products/woven-table-lamp' },
    { art: cut('rope-work', 3), link: '/products/rope-dining-armchair-sage' },
    { art: cut('zula-furniture', 1), link: '/products/hanging-cane-egg-chair' },
    { art: cut('cane-stick', 7), link: '/products/round-cane-bedside-cabinet' },
    { art: cut('cane-wicker', 1), link: '/products/cane-panel-round-coffee-table' },
  ];
  protected readonly stars = [1, 2, 3, 4, 5];
}
