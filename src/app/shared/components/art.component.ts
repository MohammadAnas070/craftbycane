import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { ART, ArtDef, ArtKey, TONE_COLOR } from '../../core/data/categories';

/**
 * Image tile. Shows the tone colour first, then fades the image in, so lists never flash
 * white and layout stays stable (width/height come from the asset).
 *  - mode "photo"  : fills the tile (object-fit: cover)
 *  - mode "cutout" : background-free product, shown whole (object-fit: contain) on a themed backdrop
 */
@Component({
  selector: 'app-art',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <img
      [src]="def.src" [alt]="alt" [attr.width]="def.w" [attr.height]="def.h"
      [attr.loading]="eager ? 'eager' : 'lazy'" [attr.fetchpriority]="eager ? 'high' : null" decoding="async"
      [class.is-loaded]="loaded()" (load)="loaded.set(true)" />
  `,
  host: {
    '[style.background]': 'bg',
    '[style.aspect-ratio]': 'ratio',
    '[class.is-cutout]': 'def.mode === "cutout"',
  },
  styles: [`
    :host { display: block; position: relative; overflow: hidden; }
    img { width: 100%; height: 100%; object-fit: cover; object-position: var(--art-pos, 50% 50%); opacity: 0; transition: opacity 0.5s var(--ease), transform 0.9s var(--ease); }
    img.is-loaded { opacity: 1; }
    :host(.is-cutout) img { object-fit: contain; object-position: 50% 55%; padding: var(--cut-pad, 9%); box-sizing: border-box; filter: drop-shadow(0 16px 14px rgba(70, 48, 28, 0.2)); }
    :host(.is-cutout)::after { content: ''; position: absolute; inset: auto 18% 7% 18%; height: 5%; border-radius: 50%; background: radial-gradient(closest-side, rgba(70, 48, 28, 0.18), transparent); pointer-events: none; }
  `],
})
export class ArtComponent {
  protected def: ArtDef = ART.chair;
  protected bg = '';
  protected ratio = '';
  protected readonly loaded = signal(false);

  @Input({ required: true }) set art(v: ArtKey | ArtDef) {
    this.def = typeof v === 'string' ? ART[v] : v;
    const c = TONE_COLOR[this.def.tone];
    this.bg = this.def.mode === 'cutout' ? `radial-gradient(ellipse 80% 70% at 50% 42%, ${LIGHT[this.def.tone]} 0%, ${c} 100%)` : c;
    this.loaded.set(false);
  }
  @Input() alt = '';
  @Input() eager = false;
  /** CSS aspect-ratio, e.g. "4 / 5". Leave empty to let the parent size it. */
  @Input() set aspect(v: string) { this.ratio = v; }
}

/** Soft highlight used at the centre of cutout backdrops. */
const LIGHT: Record<string, string> = {
  sand: '#f3eadb', ivory: '#f8f2e8', sage: '#e1e6d8', peach: '#f0d9c8', charcoal: '#4a463e', green: '#4d7561',
};
