import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { GALLERY, GALLERY_CATEGORIES, GalleryCategory, GalleryItem } from '../../core/data/content';
import { cut } from '../../core/data/images';
import { ArtComponent } from '../../shared/components/art.component';
import { IconComponent } from '../../shared/components/icon.component';
import { LightboxComponent, LightboxItem } from '../../shared/components/lightbox.component';
import { CtaBandComponent, PageHeroComponent } from '../../shared/components/small.components';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [PageHeroComponent, ArtComponent, IconComponent, LightboxComponent, CtaBandComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {
  protected readonly crumbs = [{ label: 'Home', link: '/' }, { label: 'Gallery' }];
  protected readonly cats: ('All' | GalleryCategory)[] = ['All', ...GALLERY_CATEGORIES];
  protected readonly cat = signal<'All' | GalleryCategory>('All');
  protected readonly limit = signal(12);

  protected readonly filtered = computed<GalleryItem[]>(() => GALLERY.filter((g) => this.cat() === 'All' || g.cat === this.cat()));
  protected readonly shown = computed(() => this.filtered().slice(0, this.limit()));

  protected readonly open = signal(false);
  protected readonly idx = signal(0);
  protected readonly lbItems = computed<LightboxItem[]>(() =>
    this.filtered().map((g) => ({
      art: g.art, title: g.title, eyebrow: g.cat,
      text: 'Sample project photo. Location, size and finish details are added once confirmed.',
      facts: [{ k: 'Piece', v: g.piece }, { k: 'Finish', v: g.finish }, { k: 'Range', v: g.space }],
      link: '/products/' + g.product, linkLabel: 'View this product',
    })),
  );

  constructor() {
    inject(Title).setTitle('Gallery and projects | Crafted By Cane');
    inject(Meta).updateTag({ name: 'description', content: 'Cane in real rooms: furniture installations, decorative handicrafts, lamps and custom projects.' });
  }

  protected pick(c: 'All' | GalleryCategory): void { this.cat.set(c); this.limit.set(12); }
  protected openAt(g: GalleryItem): void { this.idx.set(this.filtered().indexOf(g)); this.open.set(true); }
  protected more(): void { this.limit.update((l) => l + 9); }
  protected readonly heroTiles = [cut('lamp', 9), cut('rope-work', 15, 'sand'), cut('zula-furniture', 1)];
}
