import { Injectable, signal } from '@angular/core';

/** Cross-component UI state: search overlay, mobile drawer, announcement bar. */
@Injectable({ providedIn: 'root' })
export class UiService {
  readonly searchOpen = signal(false);
  readonly drawerOpen = signal(false);
  readonly announcementOpen = signal(true);
  /** Set by pages that show their own sticky action bar so the WhatsApp button steps aside. */
  readonly hideFab = signal(false);

  openSearch(): void { this.drawerOpen.set(false); this.searchOpen.set(true); }
  closeSearch(): void { this.searchOpen.set(false); }
  openDrawer(): void { this.drawerOpen.set(true); }
  closeDrawer(): void { this.drawerOpen.set(false); }
}
