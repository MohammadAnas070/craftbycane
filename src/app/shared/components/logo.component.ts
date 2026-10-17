import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="logo" [class.logo--light]="tone === 'light'" routerLink="/" aria-label="Crafted By Cane, home">
      <svg class="logo__mark" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="20" class="bg" />
        <g class="spokes">
          <path d="M20 12.500v15M12.500 20h15M14.700 14.700l10.600 10.600M25.300 14.700 14.700 25.300" />
        </g>
        <circle cx="20" cy="20" r="7.600" class="ring" />
      </svg>
      <span class="logo__text">
        <span class="logo__name">Crafted By Cane</span>
        <span class="logo__sub">Handwoven cane living</span>
      </span>
    </a>
  `,
  styles: [`
    .logo { display: inline-flex; align-items: center; gap: 12px; color: var(--forest); white-space: nowrap; }
    .logo__mark { width: 40px; height: 40px; flex: none; transition: transform 0.6s var(--ease); }
    .logo:hover .logo__mark { transform: rotate(45deg); }
    .bg { fill: var(--forest); }
    .ring { fill: none; stroke: var(--ivory); stroke-width: 1.8; }
    .spokes { stroke: #c8d0c4; stroke-width: 1.4; }
    .logo__text { display: flex; flex-direction: column; line-height: 1; }
    .logo__name { font-family: var(--font-serif); font-weight: 600; font-size: 20px; letter-spacing: 0.1em; text-transform: uppercase; }
    .logo__sub { margin-top: 6px; font-size: 8.5px; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--cane-dark); }
    .logo--light { color: var(--ivory); }
    .logo--light .bg { fill: var(--ivory); }
    .logo--light .ring { stroke: var(--forest); }
    .logo--light .spokes { stroke: var(--forest-soft); }
    .logo--light .logo__sub { color: var(--cane); }
    @media (max-width: 420px) { .logo { gap: 9px; } .logo__mark { width: 34px; height: 34px; } .logo__name { font-size: 17px; } .logo__sub { font-size: 7.5px; letter-spacing: 0.2em; } }
  `],
})
export class LogoComponent {
  @Input() tone: 'dark' | 'light' = 'dark';
}
