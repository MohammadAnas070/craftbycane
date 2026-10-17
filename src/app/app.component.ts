import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteFooterComponent } from './shared/components/site-footer.component';
import { SiteHeaderComponent } from './shared/components/site-header.component';
import { WhatsappFabComponent } from './shared/components/small.components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent, WhatsappFabComponent],
  template: `
    <a class="skip" href="#main">Skip to content</a>
    <app-site-header />
    <main id="main" tabindex="-1"><router-outlet /></main>
    <app-site-footer />
    <app-whatsapp-fab />
  `,
  styles: [`
    :host { display: block; }
    main { display: block; min-height: 60vh; outline: none; animation: fade-in 0.5s var(--ease); }
    .skip { position: fixed; left: 12px; top: -60px; z-index: 200; padding: 12px 18px; background: var(--forest); color: var(--ivory); border-radius: 2px; transition: top 0.2s; }
    .skip:focus { top: 12px; }
  `],
})
export class AppComponent {}
