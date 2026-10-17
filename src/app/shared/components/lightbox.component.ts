import { ChangeDetectionStrategy, Component, ElementRef, HostListener, computed, effect, input, model, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArtRef } from '../../core/data/categories';
import { ArtComponent } from './art.component';
import { IconComponent } from './icon.component';

export interface LightboxItem {
  art: ArtRef;
  title: string;
  eyebrow?: string;
  text?: string;
  facts?: { k: string; v: string }[];
  link?: string;
  linkLabel?: string;
}

/** Keyboard-accessible lightbox: Esc closes, arrows and swipe navigate, focus is trapped while open. */
@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [RouterLink, ArtComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="lb" [class.is-open]="open()" [attr.aria-hidden]="!open()">
      <div class="lb__scrim" (click)="close()"></div>
      @if (item(); as it) {
        <div #dialog class="lb__panel" role="dialog" aria-modal="true" [attr.aria-label]="it.title" [attr.inert]="open() ? null : ''"
          (touchstart)="touchStart($event)" (touchend)="touchEnd($event)">
          <button #closeBtn type="button" class="lb__close" (click)="close()" aria-label="Close"><app-icon name="close" [s]="20" /></button>
          <div class="lb__fig">
            @for (k of [index()]; track k) { <app-art [art]="it.art" [alt]="it.title" /> }
          </div>
          <div class="lb__info">
            @if (it.eyebrow) { <p class="eyebrow">{{ it.eyebrow }}</p> }
            <h2>{{ it.title }}</h2>
            @if (it.text) { <p class="lb__text">{{ it.text }}</p> }
            @if (it.facts?.length) {
              <dl class="lb__facts">
                @for (f of it.facts!; track f.k) { <div><dt>{{ f.k }}</dt><dd>{{ f.v }}</dd></div> }
              </dl>
            }
            @if (it.link) { <a [routerLink]="it.link" class="link-arrow" (click)="close()">{{ it.linkLabel || 'View this product' }} <app-icon name="arrow-right" [s]="14" /></a> }
          </div>
          @if (items().length > 1) {
            <button type="button" class="lb__nav lb__nav--prev" (click)="step(-1)" aria-label="Previous image"><app-icon name="chevron-left" [s]="20" /></button>
            <button type="button" class="lb__nav lb__nav--next" (click)="step(1)" aria-label="Next image"><app-icon name="chevron-right" [s]="20" /></button>
            <p class="lb__count" aria-live="polite">{{ index() + 1 }} / {{ items().length }}</p>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './lightbox.component.scss',
})
export class LightboxComponent {
  readonly items = input.required<LightboxItem[]>();
  readonly open = model(false);
  readonly index = model(0);

  protected readonly item = computed(() => this.items()[this.index()]);
  private readonly dialog = viewChild<ElementRef<HTMLElement>>('dialog');
  private readonly closeBtn = viewChild<ElementRef<HTMLButtonElement>>('closeBtn');
  private opener: HTMLElement | null = null;
  private x0 = 0;

  constructor() {
    effect(() => {
      if (this.open()) {
        this.opener = document.activeElement as HTMLElement | null;
        document.body.style.overflow = 'hidden';
        setTimeout(() => this.closeBtn()?.nativeElement.focus(), 50);
      } else {
        document.body.style.overflow = '';
        this.opener?.focus?.();
        this.opener = null;
      }
    });
  }

  close(): void { this.open.set(false); }

  step(d: 1 | -1): void {
    const n = this.items().length;
    this.index.update((i) => (i + d + n) % n);
  }

  protected touchStart(e: TouchEvent): void { this.x0 = e.changedTouches[0].clientX; }
  protected touchEnd(e: TouchEvent): void {
    const dx = e.changedTouches[0].clientX - this.x0;
    if (Math.abs(dx) > 50) this.step(dx < 0 ? 1 : -1);
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (!this.open()) return;
    if (e.key === 'Escape') { e.stopPropagation(); this.close(); }
    else if (e.key === 'ArrowRight') this.step(1);
    else if (e.key === 'ArrowLeft') this.step(-1);
    else if (e.key === 'Tab') this.trap(e);
  }

  private trap(e: KeyboardEvent): void {
    const root = this.dialog()?.nativeElement;
    if (!root) return;
    const f = Array.from(root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
}
