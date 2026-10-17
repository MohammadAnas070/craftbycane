import { ChangeDetectionStrategy, Component, HostListener, effect, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CATEGORIES } from '../../core/data/categories';
import { SITE, whatsappUrl } from '../../core/data/site';
import { UiService } from '../../core/services/ui.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ArtComponent } from './art.component';
import { IconComponent } from './icon.component';
import { LogoComponent } from './logo.component';
import { SearchOverlayComponent } from './search-overlay.component';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent, LogoComponent, ArtComponent, SearchOverlayComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss',
})
export class SiteHeaderComponent {
  protected readonly ui = inject(UiService);
  protected readonly wishlist = inject(WishlistService);
  private readonly router = inject(Router);

  protected readonly site = SITE;
  protected readonly categories = CATEGORIES;
  protected readonly scrolled = signal(false);
  protected readonly menuSuppressed = signal(false);
  protected readonly mobileProducts = signal(false);
  protected readonly wa = whatsappUrl('Hello Crafted By Cane, I would like to know more about your pieces.');

  protected readonly links = [
    { label: 'Home', path: '/', exact: true },
    { label: 'About', path: '/about', exact: false },
    { label: 'Craftsmanship', path: '/craftsmanship', exact: false },
    { label: 'Gallery', path: '/gallery', exact: false },
    { label: 'Journal', path: '/journal', exact: false },
    { label: 'Contact', path: '/contact', exact: false },
  ];

  constructor() {
    effect(() => {
      const lock = this.ui.drawerOpen() || this.ui.searchOpen();
      document.body.style.overflow = lock ? 'hidden' : '';
    });
    this.router.events.subscribe(() => {
      this.ui.closeDrawer();
      this.ui.closeSearch();
      this.menuSuppressed.set(true);
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const s = window.scrollY > 8;
    if (s !== this.scrolled()) this.scrolled.set(s);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.menuSuppressed.set(true);
    this.ui.closeDrawer();
    this.ui.closeSearch();
  }

  protected releaseMenu(): void { this.menuSuppressed.set(false); }
}
