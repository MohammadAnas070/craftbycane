import { ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ART, ArtDef } from '../../core/data/categories';
import { cut } from '../../core/data/images';
import { ArtComponent } from '../../shared/components/art.component';
import { IconComponent } from '../../shared/components/icon.component';

interface Slide { key: string; label: string; link: string; art: ArtDef; tone: string }

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink, IconComponent, ArtComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  host: { '[attr.data-slide]': 'active()', '[class.is-paused]': 'paused()' },
})
export class HeroComponent implements OnInit, OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly slides: Slide[] = [
    { key: 'room', label: 'Hanging Cane Egg Chair', link: '/products/hanging-cane-egg-chair', art: cut('zula-furniture', 1), tone: 'sand' },
    { key: 'chair', label: 'Walnut Cane-Back Armchair', link: '/products/walnut-cane-back-armchair', art: cut('cane-handmade', 8, 'peach'), tone: 'peach' },
    { key: 'lamp', label: 'Woven Dome Pendant, Two-Tone', link: '/products/woven-dome-pendant-two-tone', art: cut('lamp', 9), tone: 'charcoal' },
  ];
  protected readonly active = signal(0);
  protected readonly paused = signal(false);
  protected readonly images = ART;
  protected readonly interval = 7000;

  private timer: ReturnType<typeof setTimeout> | null = null;
  private raf = 0;
  private reduced = false;
  private removeListeners: (() => void)[] = [];

  ngOnInit(): void {
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.reduced) {
      this.schedule();
      this.zone.runOutsideAngular(() => this.bindParallax());
      const onVis = () => (document.hidden ? this.clear() : this.schedule());
      document.addEventListener('visibilitychange', onVis);
      this.removeListeners.push(() => document.removeEventListener('visibilitychange', onVis));
    }
  }

  ngOnDestroy(): void {
    this.clear();
    cancelAnimationFrame(this.raf);
    this.removeListeners.forEach((r) => r());
  }

  protected go(i: number): void {
    this.active.set((i + this.slides.length) % this.slides.length);
    this.schedule();
  }

  protected hold(on: boolean): void {
    this.paused.set(on);
    if (on) this.clear();
    else this.schedule();
  }

  private schedule(): void {
    this.clear();
    if (this.reduced || this.paused()) return;
    this.timer = setTimeout(() => {
      this.active.update((i) => (i + 1) % this.slides.length);
      this.schedule();
    }, this.interval);
  }

  private clear(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  }

  /** Pointer parallax: writes two CSS variables; each layer decides how far to move. */
  private bindParallax(): void {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const el = this.host;
    let tx = 0, ty = 0, cx = 0, cy = 0, running = false;
    const tick = () => {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      el.style.setProperty('--mx', cx.toFixed(3));
      el.style.setProperty('--my', cy.toFixed(3));
      if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) this.raf = requestAnimationFrame(tick);
      else running = false;
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!running) { running = true; this.raf = requestAnimationFrame(tick); }
    };
    const leave = () => { tx = 0; ty = 0; if (!running) { running = true; this.raf = requestAnimationFrame(tick); } };
    el.addEventListener('pointermove', move, { passive: true });
    el.addEventListener('pointerleave', leave);
    this.removeListeners.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
  }
}
