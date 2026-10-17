import { ChangeDetectionStrategy, Component, ElementRef, HostListener, afterNextRender, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { PROCESS_FULL, QUALITY_CHECKS } from '../../core/data/content';
import { photo } from '../../core/data/images';
import { ArtComponent } from '../../shared/components/art.component';
import { IconComponent } from '../../shared/components/icon.component';
import { BreadcrumbComponent, CtaBandComponent } from '../../shared/components/small.components';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-craftsmanship',
  standalone: true,
  imports: [ArtComponent, IconComponent, BreadcrumbComponent, CtaBandComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './craftsmanship.component.html',
  styleUrl: './craftsmanship.component.scss',
})
export class CraftsmanshipComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  protected readonly steps = PROCESS_FULL;
  protected readonly heroBg = photo('cane-handmade', 16);
  protected readonly checks = QUALITY_CHECKS;
  protected readonly crumbs = [{ label: 'Home', link: '/' }, { label: 'Our craftsmanship' }];
  protected readonly active = signal(0);
  protected readonly progress = signal(0);

  constructor() {
    inject(Title).setTitle('Our craftsmanship | Crafted By Cane');
    inject(Meta).updateTag({ name: 'description', content: 'Follow a piece from raw cane to finished furniture, step by step: selection, shaping, weaving, assembly, finishing and custom manufacturing.' });
    afterNextRender(() => this.onScroll());
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const els = this.host.querySelectorAll<HTMLElement>('[data-step]');
    const line = window.innerHeight * 0.42;
    let idx = 0;
    els.forEach((el, i) => { if (el.getBoundingClientRect().top < line) idx = i; });
    if (idx !== this.active()) this.active.set(idx);
    const first = els[0]?.getBoundingClientRect().top ?? 0;
    const lastEl = els[els.length - 1];
    const lastBottom = lastEl?.getBoundingClientRect().bottom ?? 1;
    const total = lastBottom - first || 1;
    this.progress.set(Math.max(0, Math.min(1, (line - first) / total)));
  }

  protected jump(i: number): void {
    this.host.querySelectorAll<HTMLElement>('[data-step]')[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
