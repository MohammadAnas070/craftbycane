import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIES } from '../../core/data/categories';
import { SITE, contact } from '../../core/data/site';
import { IconComponent } from './icon.component';
import { LogoComponent } from './logo.component';
import { NewsletterFormComponent } from './newsletter-form.component';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [RouterLink, IconComponent, LogoComponent, NewsletterFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer__grid">
          <div class="footer__brand">
            <app-logo tone="light" />
            <p>Handcrafted cane furniture and decor, made in small batches by skilled artisans using natural materials.</p>
            <div class="social">
              <a [href]="site.social.instagram" aria-label="Instagram"><app-icon name="instagram" [s]="17" /></a>
              <a [href]="site.social.facebook" aria-label="Facebook"><app-icon name="facebook" [s]="17" /></a>
              <a [href]="site.social.youtube" aria-label="YouTube"><app-icon name="youtube" [s]="17" /></a>
            </div>
          </div>

          <nav aria-label="Collections">
            <h2 class="footer__h">Collections</h2>
            <ul>
              @for (c of categories; track c.slug) { <li><a [routerLink]="['/categories', c.slug]">{{ c.name }}</a></li> }
            </ul>
          </nav>
          <nav aria-label="Explore">
            <h2 class="footer__h">Explore</h2>
            <ul>
              <li><a routerLink="/about">About us</a></li>
              <li><a routerLink="/craftsmanship">Our craftsmanship</a></li>
              <li><a routerLink="/gallery">Gallery and projects</a></li>
              <li><a routerLink="/testimonials">Testimonials</a></li>
              <li><a routerLink="/journal">Journal</a></li>
              <li><a routerLink="/custom-orders">Custom orders</a></li>
            </ul>
          </nav>
          <nav aria-label="Support">
            <h2 class="footer__h">Support</h2>
            <ul>
              <li><a routerLink="/contact">Contact us</a></li>
              <li><a routerLink="/faq">FAQ</a></li>
              <li><a routerLink="/shipping-policy">Shipping and delivery</a></li>
              <li><a routerLink="/returns-policy">Returns and refunds</a></li>
              <li><a routerLink="/journal/caring-for-cane-furniture-through-the-seasons">Care guides</a></li>
            </ul>
          </nav>
          <div>
            <h2 class="footer__h">Stay in touch</h2>
            <p class="footer__small">New pieces and workshop stories, a few times a year.</p>
            <app-newsletter-form variant="footer" />
            <ul class="footer__contact">
              <li>
                <app-icon name="phone" [s]="15" />
                @if (tel(); as t) { <a [href]="t">{{ phone }}</a> } @else { <span>{{ phone }}</span> }
              </li>
              <li>
                <app-icon name="mail" [s]="15" />
                @if (mail(); as m) { <a [href]="m">{{ email }}</a> } @else { <span>{{ email }}</span> }
              </li>
              <li><app-icon name="pin" [s]="15" /><span>{{ address }}</span></li>
            </ul>
          </div>
        </div>

        <div class="footer__bottom">
          <p>© {{ year }} {{ site.name }}. All rights reserved.</p>
          <p class="footer__legal">
            <a routerLink="/privacy-policy">Privacy policy</a><span>·</span>
            <a routerLink="/terms">Terms</a><span>·</span>
            <a routerLink="/shipping-policy">Shipping policy</a><span>·</span>
            <a routerLink="/returns-policy">Returns policy</a>
          </p>
        </div>
      </div>
    </footer>
  `,
  styleUrl: './site-footer.component.scss',
})
export class SiteFooterComponent {
  protected readonly site = SITE;
  protected readonly categories = CATEGORIES;
  protected readonly year = new Date().getFullYear();
  protected readonly phone = contact.phone();
  protected readonly email = contact.email();
  protected readonly address = contact.address();
  protected tel = () => contact.telHref();
  protected mail = () => contact.mailHref();
}
